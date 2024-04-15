const apiBaseUrl = 'https://localhost:7193/api';

// Helper function to extract the event code from the URL
function getEventCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}



// Function to create an event
function createEvent(eventData) {
    fetch(`${apiBaseUrl}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error('Server responded with status: ' + response.status + ' ' + JSON.stringify(error));
                });
            }
            return response.json();
        })
        .then(createdEvent => {
            console.log('Event created:', createdEvent);
            window.location.href = `/event.html?code=${createdEvent.code}`; // Make sure this is the correct property name as returned by your server
        })
        .catch(error => {
            console.error('Error creating event:', error);
            alert('Error creating event: ' + error.message);
        });
}




// Function to update an event
function updateEvent(eventId, eventData) {
    fetch(`${apiBaseUrl}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
        .then(response => response.json())
        .then(updatedEvent => {
            console.log('Event updated:', updatedEvent);
            // Update UI accordingly
        })
        .catch(error => console.error('Error updating event:', error));
}

// Function to delete an event
function deleteEvent(eventId) {
    fetch(`${apiBaseUrl}/events/${eventId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                console.log('Event deleted successfully');
                // Update UI accordingly
            } else {
                console.error('Error deleting event:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting event:', error));
}


// Event Details Page
// Function to display event details on the Event Details Page
function displayEventDetails(eventCode) {
    fetch(`${apiBaseUrl}/events/${eventCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Event not found for code: ${eventCode}`);
            }
            return response.json();
        })
        .then(event => {
            // Populate the event details
            document.getElementById('code').textContent = eventCode;
            document.getElementById('name').textContent = event.name;
            document.getElementById('description').textContent = event.description;
            document.getElementById('dateTime').textContent = new Date(event.dateTime).toLocaleString();
            document.getElementById('location').textContent = event.location;
            // You can also invoke functions here to display the list of participants and sponsors
        })
        .catch(error => {
            console.error('Error fetching event details:', error);
            alert('Error fetching event details: ' + error.message);
        });
}

// Function to display the list of participants for the event
function showParticipants(eventCode) {
    fetch(`${apiBaseUrl}/events/${eventCode}/participants`)
        .then(response => response.json())
        .then(participants => {
            // Populate the participants list
            const participantsList = document.getElementById('participantsList');
            participantsList.innerHTML = participants.map(participant =>
                `<li>${participant.name} (${participant.email})</li>`
            ).join('');
        })
        .catch(error => console.error('Error fetching participants:', error));
}

// Function to display the list of sponsors for the event
function showSponsors(eventCode) {
    fetch(`${apiBaseUrl}/events/${eventCode}/sponsors`)
        .then(response => response.json())
        .then(sponsors => {
            // Populate the sponsors list
            const sponsorsList = document.getElementById('sponsorsList');
            sponsorsList.innerHTML = sponsors.map(sponsor =>
                `<li>${sponsor.name} - $${sponsor.amount}</li>`
            ).join('');
        })
        .catch(error => console.error('Error fetching sponsors:', error));
}


// Call the displayEventDetails function when the event details page is loaded
document.addEventListener('DOMContentLoaded', () => {
    const eventCode = getEventCodeFromURL();
    if (eventCode) {
        displayEventDetails(eventCode);
    }
});

// Function to handle the Organizer button click
function showOrganizerView() {
    const eventCode = getEventCodeFromURL();
    window.location.href = `/edit-event.html?code=${eventCode}`;
}

// Function to handle the Participant button click
function showParticipantForm() {
    const eventCode = getEventCodeFromURL();
    window.location.href = `/register-participant.html?code=${eventCode}`;
}

// Function to handle the Sponsor button click
function showSponsorForm() {
    const eventCode = getEventCodeFromURL();
    window.location.href = `/sponsor-details.html?code=${eventCode}`;
}

// Function to setup role buttons with the correct links
function setupRoleButtons(eventCode) {
    document.getElementById('organizerBtn').addEventListener('click', function () {
        window.location.href = `/edit-event.html?code=${eventCode}`;
    });
    document.getElementById('participantBtn').addEventListener('click', function () {
        window.location.href = `/register-participant.html?code=${eventCode}`;
    });
    document.getElementById('sponsorBtn').addEventListener('click', function () {
        window.location.href = `/sponsor-details.html?code=${eventCode}`;
    });
}

// Function to show the list of participants
function showParticipants(eventCode) {
    fetch(`${apiBaseUrl}/events/${eventCode}/participants`)
        .then(response => response.json())
        .then(participants => {
            // Populate the participants list
            const participantsList = document.getElementById('participantsList');
            participantsList.innerHTML = participants.map(participant =>
                `<li>${participant.name} (${participant.email})</li>`
            ).join('');
        })
        .catch(error => console.error('Error fetching participants:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const eventName = document.getElementById('eventName').value;
            const eventDescription = document.getElementById('eventDescription').value;
            const eventDateTime = document.getElementById('eventDateTime').value;
            const eventLocation = document.getElementById('eventLocation').value;

            // Ensure all fields are filled out
            if (!eventName || !eventDescription || !eventDateTime || !eventLocation) {
                alert('All fields are required.');
                return;
            }

            const eventData = {
                Name: eventName,
                Description: eventDescription,
                DateTime: new Date(eventDateTime).toISOString(),
                Location: eventLocation,
            };
            createEvent(eventData);

        });
    }
    // Getting the event code from URL and setting up the page
    const eventCode = getEventCodeFromURL();
    if (eventCode) {
        displayEventDetails(eventCode);
        setupRoleButtons(eventCode);
        showParticipants(eventCode);
        showSponsors(eventCode);
    }

    // Setup role button event listeners if we are on the event details page
    const organizerBtn = document.getElementById('organizerBtn');
    const participantBtn = document.getElementById('participantBtn');
    const sponsorBtn = document.getElementById('sponsorBtn');

    if (organizerBtn && participantBtn && sponsorBtn) {
        organizerBtn.addEventListener('click', () => showOrganizerView(eventCode));
        participantBtn.addEventListener('click', () => showParticipantForm(eventCode));
        sponsorBtn.addEventListener('click', () => showSponsorForm(eventCode));
    }
});


