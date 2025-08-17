#!/bin/bash
# Container monitoring and auto-recovery script
# Run with: ./monitor.sh

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

LOG_FILE="monitor.log"
HEALTH_URL="http://localhost:3000/api/health"
CHECK_INTERVAL=30  # seconds
MAX_FAILURES=3

failure_count=0

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

print_status() {
    echo -e "${GREEN}[OK]${NC} $1"
    log "[OK] $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    log "[WARNING] $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log "[ERROR] $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log "[INFO] $1"
}

check_containers() {
    local containers_down=$(docker-compose ps --services --filter "status=exited")
    
    if [ ! -z "$containers_down" ]; then
        print_error "Containers are down: $containers_down"
        return 1
    else
        print_status "All containers are running"
        return 0
    fi
}

check_health() {
    local response=$(curl -s -w "%{http_code}" "$HEALTH_URL" -o /tmp/health_response.json)
    local http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        local status=$(cat /tmp/health_response.json | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        if [ "$status" = "healthy" ]; then
            print_status "Application health check passed"
            return 0
        else
            print_error "Application reports unhealthy status: $status"
            return 1
        fi
    else
        print_error "Health check failed with HTTP code: $http_code"
        return 1
    fi
}

check_database() {
    if docker-compose exec -T db pg_isready -U pizzabuilder -d pizzadb &> /dev/null; then
        print_status "Database is responsive"
        return 0
    else
        print_error "Database is not responsive"
        return 1
    fi
}

check_resources() {
    # Check disk space
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 90 ]; then
        print_warning "Disk usage is high: ${disk_usage}%"
    fi
    
    # Check memory usage
    local memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$memory_usage" -gt 90 ]; then
        print_warning "Memory usage is high: ${memory_usage}%"
    fi
    
    # Check Docker resources
    local containers_info=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}")
    echo "$containers_info"
}

restart_services() {
    print_info "Attempting to restart services..."
    
    # Try restarting individual services first
    docker-compose restart app
    sleep 10
    
    if check_health; then
        print_status "Service restart successful"
        failure_count=0
        return 0
    fi
    
    # If that fails, restart database too
    print_info "Restarting database as well..."
    docker-compose restart db
    sleep 20
    
    if check_health; then
        print_status "Full restart successful"
        failure_count=0
        return 0
    fi
    
    # Nuclear option
    print_warning "Performing full container restart..."
    docker-compose down
    sleep 5
    docker-compose up -d
    sleep 30
    
    if check_health; then
        print_status "Full restart successful"
        failure_count=0
        return 0
    else
        print_error "Restart failed - manual intervention required"
        return 1
    fi
}

send_alert() {
    local message="$1"
    print_error "ALERT: $message"
    
    # Add your notification method here
    # Examples:
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"$message\"}" \
    #   YOUR_SLACK_WEBHOOK_URL
    
    # Or email:
    # echo "$message" | mail -s "Pizza App Alert" your-email@domain.com
}

main_check() {
    print_info "Starting health check cycle..."
    
    local all_good=true
    
    # Check if containers are running
    if ! check_containers; then
        all_good=false
    fi
    
    # Check database
    if ! check_database; then
        all_good=false
    fi
    
    # Check application health
    if ! check_health; then
        all_good=false
    fi
    
    if [ "$all_good" = true ]; then
        print_status "All systems operational"
        failure_count=0
    else
        failure_count=$((failure_count + 1))
        print_error "Health check failed (attempt $failure_count/$MAX_FAILURES)"
        
        if [ $failure_count -ge $MAX_FAILURES ]; then
            send_alert "Pizza Builder App is down after $MAX_FAILURES failed health checks"
            restart_services
        fi
    fi
    
    # Resource check (informational only)
    print_info "Resource usage:"
    check_resources
}

# Trap to cleanup on exit
cleanup() {
    print_info "Monitoring stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Main monitoring loop
print_info "Starting Pizza Builder App monitoring..."
print_info "Health check URL: $HEALTH_URL"
print_info "Check interval: $CHECK_INTERVAL seconds"
print_info "Max failures before restart: $MAX_FAILURES"
print_info "Log file: $LOG_FILE"
print_info "Press Ctrl+C to stop monitoring"

while true; do
    main_check
    echo ""
    sleep $CHECK_INTERVAL
done
