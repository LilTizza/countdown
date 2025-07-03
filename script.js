// ===================================================================
//
//          EDIT THIS LINE TO SET YOUR COUNTDOWN TARGET DATE
//          Format: "Month Day, Year HH:MM:SS"
//
const targetDate = new Date("December 31, 2025 23:59:59").getTime();
//
// ===================================================================


// Get the HTML elements we need to update
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownContainer = document.getElementById('countdown-container');
const finishedMessage = document.getElementById('finished-message');

// Function to add a leading zero if the number is less than 10
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // If the countdown is finished
    if (distance < 0) {
        clearInterval(countdown);
        countdownContainer.classList.add('hidden');
        finishedMessage.classList.remove('hidden');
        return;
    }

    // Calculate time parts
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the display with the new values
    daysEl.textContent = formatTime(days);
    hoursEl.textContent = formatTime(hours);
    minutesEl.textContent = formatTime(minutes);
    secondsEl.textContent = formatTime(seconds);

}, 1000); // Run this every second