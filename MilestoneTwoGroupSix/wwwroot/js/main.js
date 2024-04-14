// main.js
const apiBaseUrl = 'https://localhost:7193/api';

// Event listeners for navigating to Create and Find event pages
document.addEventListener('DOMContentLoaded', () => {
    const createEventButton = document.getElementById('createEventBtn');
    const findEventButton = document.getElementById('findEventBtn');

    if (createEventButton) {
        createEventButton.addEventListener('click', () => {
            window.location.href = 'create-event.html';
        });
    }

    if (findEventButton) {
        findEventButton.addEventListener('click', () => {
            // Here you can navigate to a page that lists events or to a search page
            // For now, it navigates to an assumed 'events-list.html'
            window.location.href = 'event.html';
        });
    }
});

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
            // Here you can process and display events on your main page if necessary
            // Assuming you have a div with id 'eventsList' to display event summaries
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
