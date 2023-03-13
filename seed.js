import fetch from "node-fetch"; 

const PATH_TO_DB = "./database/db.json"
const API_KEY = "d5443a31-b0bf-5632-86c2-a619d56c9cb8"; // revoke this
const COLLECTION_CONTRACT = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8";
const DEFAULT_LIMIT = 1000;

const main = async () => {
    const db = await setUpDb()

    let cursor = '';
    let length = 0;
    do {
        const data = await callApi(API_KEY,COLLECTION_CONTRACT,DEFAULT_LIMIT,cursor);
        console.log(length += data.sales.length)
        await db.data.push(...data.sales);
        await db.write();
        cursor = data?.continuation;
    } while (cursor !== null); 
}

const setUpDb = async () => {
    const { join, dirname } = await import('node:path')
    const { fileURLToPath } = await import('node:url')
    const { Low } = await import('lowdb')
    const { JSONFile } = await import('lowdb/node')

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, PATH_TO_DB)

    const adapter = new JSONFile(file)
    const db = new Low(adapter)

    db.data ||= []  
    
    return db;
}

const callApi = async (apikey, contract, limit, cursor) => {
    const url = 'https://api.reservoir.tools/sales/v4?'
        + ('contract='+contract)
        + ('&limit='+limit)
        + (cursor ? '&continuation='+cursor : '');
    const options = {method: 'GET', headers: {accept: '*/*', 'x-api-key': apikey}};

    return fetch(url, options)
        .then(res => res.json())
        .catch(err => console.error('error:' + err));
}

main();