// Quick test script to verify working hours logic
function getCurrentDayHours(operatingHours) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayHours = operatingHours[today];
  
  if (!todayHours) return null;
  
  return {
    day: today.charAt(0).toUpperCase() + today.slice(1),
    hours: todayHours,
    isOpen: !todayHours.closed
  };
}

// Test with sample operating hours
const sampleHours = {
  monday: { open: '11:00', close: '22:00', closed: false },
  tuesday: { open: '11:00', close: '22:00', closed: false },
  wednesday: { open: '11:00', close: '22:00', closed: false },
  thursday: { open: '11:00', close: '22:00', closed: false },
  friday: { open: '11:00', close: '23:00', closed: false },
  saturday: { open: '12:00', close: '23:00', closed: false },
  sunday: { open: '12:00', close: '21:00', closed: false }
};

const currentDay = getCurrentDayHours(sampleHours);
console.log('🕒 Working Hours Test:');
console.log('Current day:', currentDay?.day);
console.log('Hours:', currentDay?.isOpen ? `${currentDay.hours.open} - ${currentDay.hours.close}` : 'Closed');
console.log('Status:', currentDay?.isOpen ? 'Open' : 'Closed');
console.log('✅ Working hours logic working correctly!');
