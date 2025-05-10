const mysql = require('mysql2/promise');
const child_process = require('child_process');
const common = require('./common');

const Log = (l) => {
    common.Log('wikialbums.js', l);
};

const vaultDbKey = 'wikialbums-db';
const dbConfig = {};

const setupVaultDbInfo = () => {
    let vaultDbInfoRaw = child_process.execSync(`secrets.sh ${vaultDbKey}`, { encoding: 'utf8' }).trim();
    if (!vaultDbInfoRaw) {
        Log(`Error fetching ${vaultDbKey} from secrets`);
        return false;
    }

    const vaultDbInfo = JSON.parse(vaultDbInfoRaw);
    if
    (
        !vaultDbInfo ||
        !vaultDbInfo.host ||
        !vaultDbInfo.user ||
        !vaultDbInfo.pass ||
        !vaultDbInfo.db
    )
    {
        Log(`Error parsing vault response`);
        return false;
    }

    dbConfig.host = vaultDbInfo.host;
    dbConfig.user = vaultDbInfo.user;
    dbConfig.pass = vaultDbInfo.pass;
    dbConfig.db = vaultDbInfo.db;

    return true;
};

async function connect() {
    const con = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.pass,
        database: dbConfig.db
    });

    con.connect((err) => {
        if (err) Log(`Error connecting to db: ${err}`);
    });

    return con;
};

async function handler(params) {

    if (!setupVaultDbInfo()) return null;
    const connection = await connect();
    if (!connection) return null;

    const action = params.action;
    if (action == 'history') {
        if
        (
            !params.year
        )
        {
            return null;
        }

        let year = parseInt(params.year, 10);

        const [rows, fields] = await connection.query(`SELECT * FROM history WHERE year = ?`, [year]);
        return rows;
    } else if (action == 'addHistory') {
        if
        (
            !params.year ||
            !params.artist ||
            !params.album
        )
        {
            return null;
        }

        let year = parseInt(params.year, 10);
            artist = params.artist,
            album = params.album;

        const [rows, fields] = await connection.query(`INSERT INTO history(year, artist, album) VALUES (?, ?, ?)`, [year, artist, album]);
        Log(rows);
        return rows;
    } else {
        return null;
    }
};

module.exports = {
    handle: handler
};
