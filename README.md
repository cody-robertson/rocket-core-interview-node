# Rocket Core Interview Take-Home Assignment

## Author: Cody Robertson

## Tech

This project is built with Nodejs.

A Postman collection is provided for testing the endpoints.

## Project Structure

Endpoints and queries are defined in src/index.ts

Code to initialize the database is defined in src/setup.ts

## How to Run

This project requires Docker to be installed in order to run.

All other commands are included in the Makefile.

1. Run `make start` to start the project
3. Run `make init_db` to create database tables and initialize the tables with the provided products.json file

The API can now be accessed at http://localhost:8000.
