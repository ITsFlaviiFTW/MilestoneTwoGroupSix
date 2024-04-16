const apiBaseUrl = 'https://localhost:7193/api';


// Global variable to hold the current eventId
let currentEventId = null;

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
            // Assuming the event object contains an id field that is the eventId
            currentEventId = event.id;

            // Now populate the event details in the page
            // Assuming you have elements with the IDs 'code', 'name', 'description', 'dateTime', 'location'
            document.getElementById('code').textContent = eventCode;
            document.getElementById('name').textContent = event.name;
            document.getElementById('description').textContent = event.description;
            document.getElementById('dateTime').textContent = new Date(event.dateTime).toLocaleString();
            document.getElementById('location').textContent = event.location;
        })
        .catch(error => {
            console.error('Error fetching event details:', error);
            alert('Error fetching event details: ' + error.message);
        });
}

// Function to get the eventId from the eventCode
function getEventIdFromEventCode(eventCode) {
    return fetch(`${apiBaseUrl}/events/code/${eventCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Assuming your backend returns an object with an eventId property
            return data.eventId;
        });
}




// Updated function to register a participant
// Function to register a participant
function registerParticipant(participantData) {
    if (currentEventId) {
        fetch(`${apiBaseUrl}/participants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...participantData, EventId: currentEventId }) // Add the EventId to the request body
        })
            .then(response => response.json())
            .then(registeredParticipant => {
                console.log('Participant registered:', registeredParticipant);
                // Now refresh the participants list
                showParticipants(getEventCodeFromURL());
            })
            .catch(e => {
                console.error('Error during participant registration:', e.message);
                alert('Error during registration: ' + e.message);
            });
    } else {
        console.error('Event ID is not set. Cannot register participant.');
    }
}

function showParticipants(eventCode) {
    // First, get the event ID using the event code
    getEventIdFromEventCode(eventCode)
        .then(eventId => {
            // Use the eventId to make the request for participants
            return fetch(`${apiBaseUrl}/participants/events/${eventId}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching participants.');
            }
            return response.json();
        })
        .then(participants => {
            const participantsListElement = document.getElementById('participantsList');
            if (participantsListElement) {
                participantsListElement.innerHTML = participants.map(p => `<li>${p.name} (${p.email})</li>`).join('');
            }
        })
        .catch(error => {
            console.error('Error fetching participants:', error);
        });
}



// Call the displayEventDetails function when the event details page is loaded
document.addEventListener('DOMContentLoaded', () => {
    const eventCode = getEventCodeFromURL();
    if (eventCode) {
        displayEventDetails(eventCode);
    }
});


// Function to setup role buttons with the correct links
function setupRoleButtons(eventCode) {
    document.getElementById('organizerBtn').addEventListener('click', function () {
        window.location.href = `/edit-event.html?code=${eventCode}`;
    });
    document.getElementById('participantBtn').addEventListener('click', function () {
        document.getElementById('registerParticipantModal').classList.remove('hidden');
    });
    document.getElementById('sponsorBtn').addEventListener('click', function () {
        window.location.href = `/sponsor-details.html?code=${eventCode}`;
    });
}


// Function to handle the Organizer button click
function showOrganizerView() {
    const eventCode = getEventCodeFromURL();
    window.location.href = `/edit-event.html?code=${eventCode}`;
}

// Function to show the participant registration form
function showParticipantForm() {
    document.getElementById('registerParticipantModal').classList.remove('hidden');
}

// Function to hide the participant registration form
function hideParticipantForm() {
    document.getElementById('registerParticipantModal').classList.add('hidden');
}

// Event listener for the register participant form submission
document.getElementById('registerParticipantForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    const participantName = document.getElementById('participantName').value;
    const participantEmail = document.getElementById('participantEmail').value;
    const eventCode = getEventCodeFromURL();

    // Here you can call getEventIdFromEventCode() function
    // and then registerParticipant function as previously described
    // After registration, you can call hideParticipantForm() and showParticipants(eventCode)

    // Example:
     getEventIdFromEventCode(eventCode).then(eventId => {
         const participantData = {
             name: participantName,
             email: participantEmail,

             eventId: eventId,
             eventCode: eventCode
         };
         registerParticipant(participantData);
         hideParticipantForm();
         showParticipants(eventCode);
     });
    
        // Ensure all fields are filled out
        if (!participantName || !participantEmail) {
            alert('All fields are required.');
            return;
        }
    
        const participantData = {
            name: participantName,
            email: participantEmail,
            eventCode: eventCode
        };
    
        // Call the function to register the participant
        registerParticipant(participantData);
        hideParticipantForm();
        showParticipants(eventCode);
});




document.addEventListener('DOMContentLoaded', () => {
    // Getting the event code from URL and setting up the page
    const eventCode = getEventCodeFromURL();
    if (eventCode) {
        displayEventDetails(eventCode);
        showParticipants(eventCode);
        showSponsors(eventCode);
    }
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

            const eventCode = getEventCodeFromURL();
            if (eventCode) {
                displayEventDetails(eventCode); // This will also set the currentEventId
            }

            if (eventCode) {
                getEventIdFromEventCode(eventCode)
                    .then(eventId => {
                        // Save eventId in a higher scope if needed
                        currentEventId = eventId;
                        // Call your functions that require eventId
                        displayEventDetails(eventId);
                        showParticipants(eventId);
                    })
                    .catch(error => {
                        console.error('Error retrieving event ID:', error);
                        alert('Error: Could not retrieve event ID. Event with code ' + eventCode + ' not found.');
                    });
            }

        });
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
    const registerParticipantForm = document.getElementById('registerParticipantForm');
    if (registerParticipantForm) {
        registerParticipantForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop the regular form submission
            const participantName = document.getElementById('participantName').value;
            const participantEmail = document.getElementById('participantEmail').value;
            const eventId = getEventCodeFromURL(); // You need to convert the code to ID

            // Construct the participant data
            const participantData = { name: participantName, email: participantEmail, eventId: eventId };

            // Call the function to register the participant
            registerParticipant(eventId, participantData);
        });
    }
});






