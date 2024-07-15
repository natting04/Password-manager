const express = require('express');
const { Keychain } = require('./password-manager');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/save', async (req, res) => {
    const { service, password } = req.body;
    const keychain = await Keychain.init('your-master-password');
    await keychain.set(service, password);
    res.send('Password saved successfully');
});

app.listen(port, () => {
    console.log(`Password manager server listening at http://localhost:${port}`);
});
