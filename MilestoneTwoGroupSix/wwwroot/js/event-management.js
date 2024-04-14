const apiBaseUrl = 'https://localhost:7193/api';

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
});

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

// Function to register a participant
function registerParticipant(eventId, participantData) {
// API call to register a participant for an event

}

// Function to cancel a participant's registration
function cancelParticipantRegistration(participantId) {
    // API call to cancel registration
}

// Function to create a sponsorship
function createSponsorship(sponsorshipData) {
    // API call to create a sponsorship
}

// Function to update sponsorship details
function updateSponsorship(sponsorId, sponsorshipData) {
    // API call to update a sponsorship
}


