const http = require('http');
const express = require('express');
const child_process = require('child_process');
const fs = require('fs');
const common = require('./common');
const wikialbums = require('./wikialbums');

const app = express();
const port = 3000;

const ENABLE_VAULT = true;

let vaultConfig;
if (ENABLE_VAULT) {
    const pw = fs.readFileSync('/main/TOKEN_FILE', 'utf8');
    fs.unlinkSync('/main/TOKEN_FILE');
    process.env['SECRETS_ACCESS_TOKEN'] = pw;

    const configRaw = fs.readFileSync('/config.json', 'utf8');
    vaultConfig = JSON.parse(configRaw);
}

const dbProjects = {
    'wikialbums': wikialbums
};

const Log = (l) => {
    common.Log('main.js', l);
};

app.use(express.json());

app.get('/vaultSecret', (req, res) => {
    const queryParams = req.query;
    const queryKey = queryParams.key;

    if (!(queryKey in vaultConfig)) {
        Log("No key found: " + queryKey);
        return;
    }

    const key = vaultConfig[queryKey];
    Log('Fetching key: ' + key);

    let secretKey = child_process.execSync(`secrets.sh ${key}`, { encoding: 'utf8' }).trim();

    res.json({
        message: 'Received GET request',
        data: queryParams,
        secret: secretKey
    });
});

app.get('/dbAction', async (req, res) => {
    const queryParams = req.query;
    const queryProj = queryParams.proj;

    if (!queryProj || !dbProjects[queryProj]) {
        Log("No project found: " + queryProj);
        return;
    }

    let response = await dbProjects[queryProj].handle(queryParams);
    if (response) {
        res.json(response);
    }
});

app.get('/test', (req, res) => {
    const bodyData = req.body;
    res.json({
        message: 'Received GET request',
        data: bodyData
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
    Log(`Server is listening on http://localhost:${port}`);
});

