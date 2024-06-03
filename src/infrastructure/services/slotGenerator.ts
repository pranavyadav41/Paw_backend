// Helper function to convert time to minutes
function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to convert minutes to time
function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Function to find available time slots
function findAvailableTimeSlots(
  existingBookings: any[],
  serviceDuration: number,
  openingTime: string,
  closingTime: string,
  bufferTime: number
): { startTime: string; endTime: string }[] {
  const availableSlots: { startTime: string; endTime: string }[] = [];
  let currentTime = timeToMinutes(openingTime) + bufferTime; // Start 30 minutes after opening time

  // Sort existing bookings by start time
  existingBookings.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Loop through the day 
  while (currentTime + serviceDuration <= timeToMinutes(closingTime)) {
    let isAvailable = true;

    // Check if the current time slot conflicts with existing bookings
    for (const booking of existingBookings) {
      const bookingStartTime = timeToMinutes(booking.startTime);
      const bookingEndTime = timeToMinutes(booking.endTime);

      // Check for overlap with buffer times
      if (
        (currentTime >= bookingStartTime - bufferTime && currentTime < bookingEndTime + bufferTime) ||
        (currentTime + serviceDuration > bookingStartTime - bufferTime &&
          currentTime + serviceDuration <= bookingEndTime + bufferTime)
      ) {
        isAvailable = false;
        // Move current time to the end of this booking plus buffer time
        currentTime = bookingEndTime + bufferTime;
        break;
      }
    }

    if (isAvailable) {
      const startTime = minutesToTime(currentTime);
      const endTime = minutesToTime(currentTime + serviceDuration);
      availableSlots.push({ startTime, endTime });
      // Move to the next possible start time
      currentTime += serviceDuration + bufferTime;
    }
  }

  return availableSlots;
}

export default findAvailableTimeSlots;