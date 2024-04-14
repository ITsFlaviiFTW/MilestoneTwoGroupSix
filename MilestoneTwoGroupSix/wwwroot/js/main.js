const apiBaseUrl = 'https://localhost:7193/api';

// General page initialization and global event handlers
document.addEventListener('DOMContentLoaded', (event) => {
    // Fetch and display events when the page loads
    fetchEvents();

    // Add event listeners for any global actions, like navigation
    // Example: document.getElementById('navHome').addEventListener('click', showHomePage);
});

function fetchEvents() {
    fetch(`${apiBaseUrl}/events`)
        .then(response => response.json())
        .then(events => {
            // Process and display events
            // Example: document.getElementById('eventsList').innerHTML = events.map(e => `...`).join('');
        })
        .catch(error => console.error('Error fetching events:', error));
}

// Add more general-purpose functions as needed...
