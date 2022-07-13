import express from 'express';
import postgres from 'pg-promise';
const pgp = postgres();

const DB_NAME = process.env.POSTGRES_NAME || '';
const DB_USER = process.env.POSTGRES_USER || '';
const DB_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const DB_PORT = 5432

const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_NAME}`);

const app = express();
app.listen(8000, () => {
    console.log(`server running on port 8000`);
});

app.get('/catalog/size/', async (req, res) => {
    try {
        const count = await db.oneOrNone('SELECT COUNT(1) FROM "products"');

        res.status(200);
        res.send({'success': true, 'count': count || 0});
    }
    catch(e) {
        res.status(501);
        res.send({'success': false});
    }
});

app.get('/catalog/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let product = await db.oneOrNone('SELECT id, name, price, quantity FROM "products" WHERE id = $1', [id]);

        if (product === null) {
            res.status(404);
            res.send({'success': false});
        }

        product.price = parseInt(product.price, 10);

        res.status(200);
        res.send({'success': true, 'products': [product]});
    } catch(e) {
        console.error(e);
        res.status(501);
        res.send({'success': false});
    }
});

app.get('/cart/', async (req, res) => {
    try {
        let products = await db.manyOrNone('SELECT id, name, price FROM "products" WHERE cart_id IS NOT NULL');
        if (products === null) {
            products = []
        }
        products = products.map(product => {return {...product, 'price': parseInt(product.price, 10)}});
        const totalCost = await db.oneOrNone('SELECT SUM(price) FROM "products" WHERE cart_id IS NOT NULL');

        res.status(200);
        res.send({'success': true, 'products': products, 'totalCost': parseInt(totalCost["sum"], 10) || 0});
    } catch(e) {
        console.error(e);
        res.status(501);
        res.send({'success': false});
    }
});

app.get('/cart/item/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let product = await db.oneOrNone('SELECT id, name, price FROM "products" WHERE cart_id IS NOT NULL AND id = $1', [id]);

        if (product === null) {
            res.status(404);
            res.send({'success': false});
        }

        product.price = parseInt(product.price, 10);

        res.status(200);
        res.send({'success': true, 'products': [product]});
    } catch(e) {
        console.error(e);
        res.status(501);
        res.send({'success': false});
    }
});

app.post('/cart/item/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const cart = await db.one('SELECT id FROM "carts" c');
        const product = await db.oneOrNone('SELECT id, name, price, quantity, cart_id FROM "products" p WHERE cart_id IS NULL AND quantity > 0 AND id = $1', [id]);

        if (product === null) {
            res.status(404);
            res.send({'success': false});
        }

        await db.none('UPDATE "products" SET cart_id = $1, quantity = 0 WHERE id = $2', [cart.id, id]);

        res.status(200);
        res.send({'success': true});
    } catch(e) {
        console.error(e);
        res.status(501);
        res.send({'success': false});
    }
});

app.delete('/cart/item/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await db.oneOrNone('SELECT id, name, price, quantity, cart_id FROM "products" p WHERE cart_id IS NOT NULL AND id = $1', [id]);

        if (product === null) {
            res.status(404);
            res.send({'success': false});
        }

        await db.none('UPDATE "products" SET cart_id = NULL, quantity = 1');

        res.status(200);
        res.send({'success': true});
    } catch(e) {
        console.error(e);
        res.status(501);
        res.send({'success': false});
    }
});

app.post('/cart/checkout/', async (req, res) => {
    try {
        let products = await db.manyOrNone('SELECT id, name, price, quantity FROM "products" WHERE cart_id IS NOT NULL');
        const totalCost = await db.oneOrNone('SELECT SUM(price) FROM "products" WHERE cart_id IS NOT NULL');

        if (products === null) {
            res.status(501);
            res.send({'success': false});
        }

        await db.none('UPDATE "products" SET cart_id = NULL WHERE cart_id IS NOT NULL');
        products = products.map(product => {return {...product, 'price': parseInt(product.price, 10), 'quantity': 1}});

        res.status(200);
        res.send({'success': true, 'products': products, 'totalCost': parseInt(totalCost["sum"], 10)});
    } catch(e) {
        console.error(e);
        res.status(501);
        res.send({'success': false});
    }
});
