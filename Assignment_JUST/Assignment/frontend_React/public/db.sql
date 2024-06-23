-- //sql quries

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    failed_attempts INTEGER DEFAULT 0,
    account_locked BOOLEAN DEFAULT FALSE
);

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);
