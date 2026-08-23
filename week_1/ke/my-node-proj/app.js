// Import specific functions from date-fns
const { format, addDays } = require('date-fns');

// Get the current date
const currentDate = new Date();

// Format the current date
const formattedDate = format(currentDate, 'MMMM dd, yyyy');
console.log('Formatted Date:', formattedDate);

// Add 7 days to the current date
const futureDate = addDays(currentDate, 7);
console.log('Future Date:', format(futureDate, 'MMMM dd, yyyy'));