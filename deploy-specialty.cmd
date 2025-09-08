ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "mkdir -p /opt/pizza-app/src/app/management-portal/specialty-pizzas"
scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" "src\app\management-portal\specialty-pizzas\page.tsx" root@91.99.194.255:/opt/pizza-app/src/app/management-portal/specialty-pizzas/
