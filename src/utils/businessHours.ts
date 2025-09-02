// Business hours utility functions

interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

interface OperatingHours {
  [day: string]: string | DayHours;
}

/**
 * Parse time string in HH:MM format to minutes since midnight
 */
function parseTimeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Get current time in minutes since midnight
 */
function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Get current day name in lowercase
 */
function getCurrentDayName(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

/**
 * Parse operating hours from different formats
 */
function parseDayHours(dayHoursString: any): DayHours | null {
  if (!dayHoursString) return null;
  
  if (typeof dayHoursString === 'object' && dayHoursString.open && dayHoursString.close) {
    return dayHoursString;
  }
  
  if (typeof dayHoursString === 'string') {
    if (dayHoursString === 'closed') {
      return { open: '', close: '', closed: true };
    }
    
    // Parse "10:30-20:00" format
    const parts = dayHoursString.split('-');
    if (parts.length === 2) {
      return {
        open: parts[0].trim(),
        close: parts[1].trim(),
        closed: false
      };
    }
  }
  
  return null;
}

/**
 * Check if restaurant is currently open
 */
export function isRestaurantOpen(operatingHours: OperatingHours): boolean {
  const currentDay = getCurrentDayName();
  const currentTimeMinutes = getCurrentTimeInMinutes();
  
  const todayHours = parseDayHours(operatingHours[currentDay]);
  
  if (!todayHours || todayHours.closed) {
    return false;
  }
  
  const openTime = parseTimeToMinutes(todayHours.open);
  const closeTime = parseTimeToMinutes(todayHours.close);
  
  // Handle overnight hours (e.g., 22:00-02:00)
  if (closeTime < openTime) {
    return currentTimeMinutes >= openTime || currentTimeMinutes <= closeTime;
  }
  
  return currentTimeMinutes >= openTime && currentTimeMinutes <= closeTime;
}

/**
 * Get restaurant status text and styling
 */
export function getRestaurantStatus(operatingHours: OperatingHours) {
  const isOpen = isRestaurantOpen(operatingHours);
  const currentDay = getCurrentDayName();
  const todayHours = parseDayHours(operatingHours[currentDay]);
  
  if (!todayHours || todayHours.closed) {
    const nextOpening = getNextOpeningTime(operatingHours);
    return {
      text: nextOpening ? `Closed - ${nextOpening}` : 'Closed Today',
      isOpen: false,
      className: 'text-red-200',
      iconClassName: 'text-red-300'
    };
  }
  
  if (isOpen) {
    return {
      text: `Open until ${formatTime(todayHours.close)}`,
      isOpen: true,
      className: 'text-green-200',
      iconClassName: 'text-green-300'
    };
  }
  
  // Closed but will open today
  const currentTimeMinutes = getCurrentTimeInMinutes();
  const openTime = parseTimeToMinutes(todayHours.open);
  
  if (currentTimeMinutes < openTime) {
    return {
      text: `Opens at ${formatTime(todayHours.open)}`,
      isOpen: false,
      className: 'text-orange-200',
      iconClassName: 'text-orange-300'
    };
  }
  
  // Closed for the day, show next opening
  const nextOpening = getNextOpeningTime(operatingHours);
  return {
    text: nextOpening ? `Closed - ${nextOpening}` : 'Closed',
    isOpen: false,
    className: 'text-red-200',
    iconClassName: 'text-red-300'
  };
}

/**
 * Format time from 24-hour to 12-hour format
 */
function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  if (minutes === 0) {
    return `${displayHours}${period}`;
  }
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
}

/**
 * Get next opening time if currently closed
 */
export function getNextOpeningTime(operatingHours: OperatingHours): string | null {
  const currentDay = getCurrentDayName();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayIndex = days.indexOf(currentDay);
  
  // Check today first if not yet opening time
  const todayHours = parseDayHours(operatingHours[currentDay]);
  if (todayHours && !todayHours.closed) {
    const currentTimeMinutes = getCurrentTimeInMinutes();
    const openTime = parseTimeToMinutes(todayHours.open);
    
    if (currentTimeMinutes < openTime) {
      return `Today at ${formatTime(todayHours.open)}`;
    }
  }
  
  // Check next 7 days
  for (let i = 1; i <= 7; i++) {
    const dayIndex = (currentDayIndex + i) % 7;
    const dayName = days[dayIndex];
    const dayHours = parseDayHours(operatingHours[dayName]);
    
    if (dayHours && !dayHours.closed) {
      const dayLabel = i === 1 ? 'Tomorrow' : dayName.charAt(0).toUpperCase() + dayName.slice(1);
      return `${dayLabel} at ${formatTime(dayHours.open)}`;
    }
  }
  
  return null;
}
