const http = require('http');
const express = require('express');
const child_process = require('child_process');
const fs = require('fs');

const app = express();
const port = 3000;

const pw = fs.readFileSync('/main/TOKEN_FILE', 'utf8');
fs.unlinkSync('/main/TOKEN_FILE');
process.env['SECRETS_ACCESS_TOKEN'] = pw;

const configRaw = fs.readFileSync('/config.json', 'utf8');
const config = JSON.parse(configRaw);

app.use(express.json());

app.get('/vaultSecret', (req, res) => {
    const queryParams = req.query;
    const queryKey = queryParams.key;

    if (!(queryKey in config)) {
        console.log("No key found: " + queryKey);
        return;
    }

    const key = config[queryKey];
    console.log('Fetching key: ' + key);

    let secretKey = child_process.execSync(`secrets.sh ${key}`, { encoding: 'utf8' }).trim();

    res.json({
        message: 'Received GET request',
        data: queryParams,
        secret: secretKey
    });
});

// Handle POST requests
app.post('/', (req, res) => {
    const bodyData = req.body;
    res.json({
        message: 'Received POST request',
        data: bodyData
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
