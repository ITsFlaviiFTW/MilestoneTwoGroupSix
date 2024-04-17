// main.js
const apiBaseUrl = 'https://localhost:7193/api';

// Event listeners for navigating to Create and Find event pages
document.addEventListener('DOMContentLoaded', () => {
    const createEventButton = document.getElementById('createEventBtn');
    if (createEventButton) {
        createEventButton.addEventListener('click', () => {
            window.location.href = 'create-event.html';
        });
    }
    // Event listener for the find event form
    const findEventForm = document.getElementById('findEventForm');
    if (findEventForm) {
        findEventForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const eventCode = document.getElementById('eventCode').value;
            if (eventCode) {
                // Check if the event code exists before navigating
                checkEventCode(eventCode);
            } else {
                alert('Please enter an event code.');
            }
        });
    }
});

// Function to check if an event code is valid
function checkEventCode(eventCode) {
    fetch(`${apiBaseUrl}/events/${eventCode}`)
        .then(response => {
            if (response.ok) {
                // If the response is OK, navigate to the event details page
                window.location.href = `/event.html?code=${eventCode}`;
            } else {
                // If the event is not found, alert the user
                alert('Event not found. Please check the code and try again.');
            }
        })
        .catch(error => {
            console.error('Error checking event code:', error);
            alert('Error checking event code: ' + error.message);
        });
}


// Fetch and display events
function fetchEvents() {
    fetch(`${apiBaseUrl}/events`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(events => {
            // Here we can process and display events on the main page if necessary
            // Assuming we have a div with id 'eventsList' to display event summaries, probably needs to be implemented later
            // For now, we will just log the events to the console
            const eventsListDiv = document.getElementById('eventsList');
            if (eventsListDiv) {
                eventsListDiv.innerHTML = events.map(event =>
                    `<div>
                        <h3>${event.name}</h3>
                        <p>${event.description}</p>
                        <p>Location: ${event.location}, Date and Time: ${new Date(event.dateTime).toLocaleString()}</p>
                    </div>`
                ).join('');
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            // Display error message on the page
        });
}
