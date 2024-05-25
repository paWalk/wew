const express = require('express');
const WebSocket = require('ws');
const TonWeb = require('tonweb');

const app = express();
const port = 3000;

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

async function doTransaction(ws) {
    const tonweb = new TonWeb();
    const address = 'UQCPtEpj4jHllb93auw1JhoCImqH5AtJB5KyF5UH51FlUFeu';
    const history = await tonweb.getTransactions(address, 50);

    history.forEach((transaction) => {
        const message = transaction.in_msg.message;
        const value = transaction.in_msg.value;
        if (value >= 100000000 && message) {
            ws.send(message);
        }
    });
}

wss.on('connection', (ws) => {
    doTransaction(ws);

    ws.on('message', (message) => {
        console.log('received: %s', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
