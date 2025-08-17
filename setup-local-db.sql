-- Create user and database for pizzabuilder app
CREATE USER pizzabuilder WITH PASSWORD 'pizzapassword';
CREATE DATABASE pizzadb OWNER pizzabuilder;
GRANT ALL PRIVILEGES ON DATABASE pizzadb TO pizzabuilder;
