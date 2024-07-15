document.getElementById('passwordForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const service = document.getElementById('service').value;
    const password = document.getElementById('password').value;

    const response = await fetch('save_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service, password }),
    });

    const result = await response.text();
    document.getElementById('result').innerText = result;
});
