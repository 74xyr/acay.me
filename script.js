// ==============================================
// Main Script for Authorization Site
// ==============================================

const API_URL = 'https://api.acay.me';

// ==============================================
// Callback Page Processing
// ==============================================

function processCallback() {
    // Only run on callback page
    if (!window.location.pathname.includes('callback')) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
        console.error('OAuth Error:', error);
        window.location.href = '/error.html';
        return;
    }

    if (!code) {
        console.error('No authorization code provided');
        window.location.href = '/error.html';
        return;
    }

    // Send code to backend
    fetch(`${API_URL}/callback?code=${encodeURIComponent(code)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Authorization response:', data);
            
            if (data.success) {
                window.location.href = '/success.html';
            } else {
                console.error('Authorization failed:', data.error);
                window.location.href = '/error.html';
            }
        })
        .catch(error => {
            console.error('Authorization error:', error);
            window.location.href = '/error.html';
        });
}

// ==============================================
// Initialize on page load
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Authorization site loaded');
    
    // Process callback if on callback page
    processCallback();
    
    // Add analytics or other initialization here if needed
});

// ==============================================
// Utility Functions
// ==============================================

// Check API status
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();
        console.log('API Status:', data);
        return data.status === 'ok';
    } catch (error) {
        console.error('API is offline:', error);
        return false;
    }
}

// Get user count from API
async function getUserCount() {
    try {
        const response = await fetch(`${API_URL}/api/users/count`);
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error fetching user count:', error);
        return 0;
    }
}

// Display user count (if element exists)
async function displayUserCount() {
    const userCountElement = document.getElementById('userCount');
    if (userCountElement) {
        const count = await getUserCount();
        userCountElement.textContent = count;
    }
}

// Initialize user count display
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayUserCount);
} else {
    displayUserCount();
}
