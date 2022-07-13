import postgres from 'pg-promise';
const pgp = postgres(/* options */)

const DB_NAME = process.env.POSTGRES_NAME || '';
const DB_USER = process.env.POSTGRES_USER || '';
const DB_PASSWORD = process.env.POSTGRES_PASSWORD || '';
const DB_PORT = 5432

const db = pgp(`postgres://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_NAME}`);

const productsQuery = `
CREATE TABLE Products(
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256) NULL,
    price DECIMAL
)
`;

const cartQuery = `
CREATE TABLE Products(
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256) NULL,
    price DECIMAL
)
`;

async function createDbTables() {
    await db.none(productsQuery);
    await db.none(cartQuery);
}

async function loadDataForTables() {

}

createDbTables().then(() => {
    loadDataForTables().then(() => {

    });
});
