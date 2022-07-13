import express from 'express';
import postgres from 'pg-promise';
const pgp = postgres(/* options */)

const DB_NAME = process.env.POSTGRES_NAME || '';
const DB_USER = process.env.POSTGRES_USER || '';
const DB_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const DB_PORT = 5432

const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_NAME}`);

const app = express();
app.listen(4000, () => {
    console.log(`server running on port 4000`);
});

app.get('/catalog/size/', (req, res) => {
    res.send({'success': true, 'count': 1});
});

app.get('/catalog/:id', (req, res) => {
    const id = req.params.id;
    res.send({'success': true, 'products': []});
});

app.get('/cart/', (req, res) => {
    res.send({'success': true, 'products': [], 'totalCost': 0});
});

app.get('/cart/item/:id', (req, res) => {
    const id = req.params.id;
    res.send({'success': true, 'products': []});
});

app.post('/cart/item/:id', (req, res) => {
    const id = req.params.id;
    res.send({'success': true});
});

app.delete('/cart/item/:id', (req, res) => {
    const id = req.params.id;
    res.send({'success': true});
});

app.get('/cart/checkout/', (req, res) => {
    res.send({'success': true, 'products': [], 'totalCost': 0});
});
