import postgres from 'pg-promise';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './types';
const pgp = postgres();

const DB_NAME = process.env.POSTGRES_NAME || '';
const DB_USER = process.env.POSTGRES_USER || '';
const DB_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const DB_PORT = 5432

const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_NAME}`);

const cartsQuery = `
BEGIN;
CREATE TABLE "carts" ("id" uuid NOT NULL PRIMARY KEY);
COMMIT;
`;

const productsQuery = `
BEGIN;
CREATE TABLE "products" (
    "id" varchar(64) NOT NULL PRIMARY KEY,
    "name" varchar(256) NOT NULL,
    "price" numeric(15, 2) NOT NULL,
    "quantity" integer NOT NULL,
    "cart_id" uuid NULL
);
ALTER TABLE "products" ADD CONSTRAINT "products_carts_id_dcf9fed2_fk_carts_id" FOREIGN KEY ("cart_id") REFERENCES "carts" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "products_id_158ae930_like" ON "products" ("id" varchar_pattern_ops);
CREATE INDEX "products_cart_id_dcf9fed2" ON "products" ("cart_id");
COMMIT;
`;

async function createDbTables() {
    try {
        await db.none(cartsQuery);
        await db.none(productsQuery);
    } catch (e) {
        console.error(`Error setting up database tables: ${e}`);
    }
}

async function loadDataForTables() {
    try {
        const data = fs.readFileSync('./products.json', 'utf-8');
        const products = JSON.parse(data);
        const formattedProducts = products.map((product: Product) => `('${product.id}', '${product.name}', ${product.price}, ${product.quantity}, NULL)`).join(', ') + ';';

        let query = `
        BEGIN;
        INSERT INTO "products" ("id", "name", "price", "quantity", "cart_id") VALUES
        ${formattedProducts}
        COMMIT;
        `;

        console.log(query);

        await db.none(query);
        await db.none('INSERT INTO "carts" ("id") VALUES ($1)', [uuidv4()]);
    } catch (e) {
        console.error(`Error loading initial products: ${e}`);
    }
}

createDbTables().then(() => {
    console.log("Finished creating tables")
    loadDataForTables().then(() => {
        console.log("Finished importing products");
    });
});
