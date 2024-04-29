let sessionId; // Declare sessionId variable in a higher scope

document.addEventListener('DOMContentLoaded', function() {
    // Generate a unique session ID
    sessionId = generateSessionId();

    // Modify the Google Forms URL to include the session ID
    const surveyLink = document.getElementById('survey-link');
    surveyLink.href = `https://docs.google.com/forms/d/e/1FAIpQLScEiElLJ8oJJ6DX-62yJfvb1AzSW-IEVUXGMfD_YS0PrYXjeQ/viewform?usp=sf_link&sessionId=${sessionId}`;

    const siteAccessTime = new Date().toISOString(); // Log site access time (UTC time zone)
    const modals = document.querySelectorAll('.modal'); // Select all modal pop-ups

    // Generate a random index and ensure it selects one of the modals with equal probability
    const index = Math.floor(Math.random() * modals.length);

    // Hide all pop-ups initially
    modals.forEach(modal => modal.style.display = 'none');

    // Display only the randomly selected popup
    const selectedModal = modals[index];
    selectedModal.style.display = 'flex'; // Show the selected modal

    // Function to log events and close the modal
    const logEventAndCloseModal = (action, modal) => {
        const responseTime = new Date().toISOString(); // Time of user response
        const modalTag = modal.getAttribute('id'); // Get the ID or custom attribute to identify the modal
        const data = {
            siteAccessTime: siteAccessTime,
            action: action,
            responseTime: responseTime,
            modalTag: modalTag, // Log which modal was shown
            sessionId: sessionId // Include session ID
        };
        
        sendDataToServer(data); // Pass data to sendDataToServer
        modal.style.display = 'none'; // Close the modal
    };

    // Event handlers for the modal
    selectedModal.querySelector('.btn-accept').addEventListener('click', () => logEventAndCloseModal('Accept', selectedModal));
    selectedModal.querySelector('.btn-decline').addEventListener('click', () => logEventAndCloseModal('Decline', selectedModal));
    selectedModal.querySelector('.close').addEventListener('click', () => logEventAndCloseModal('Close', selectedModal));

    // Close the modal if clicking outside of the modal content
    window.onclick = (event) => {
        if (event.target === selectedModal) {
            logEventAndCloseModal('Background Close', selectedModal);
        }
    };
});

// Function to generate a unique session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2, 10);
}

// Function to send data to the server
const sendDataToServer = (data) => {
    fetch('http://localhost:3000/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Data logged successfully');
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => console.error('Error:', error));
};
