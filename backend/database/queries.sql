-- Description: This file contains the queries to create the tables and insert test data into the database.
-- If for any reason you want to delete your db
-- DROP DATABASE db_name;
-- ALTER TABLE users DROP COLUMN google_id;
-- ALTER TABLE users ADD COLUMN github_id;

-- Description: This file contains the queries to create the tables and insert test data into the database.
-- If for any reason you want to delete your db
-- DROP DATABASE db_name;
-- ALTER TABLE users DROP COLUMN google_id;
-- ALTER TABLE users ADD COLUMN github_id;

-- Allowed Languages
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    language_name VARCHAR(100) NOT NULL
);

-- Create Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    first_name VARCHAR(100), 
    last_name VARCHAR(100), 
    country VARCHAR(255), 
    contact_num VARCHAR(15), 
    email VARCHAR(255), 
    google_id VARCHAR(30),
    github_id VARCHAR(30),
    facebook_id VARCHAR(30),
    linkedin_id VARCHAR(30),
    password VARCHAR(255),
    native_language_id INT,
    profile_image bytea,
    FOREIGN KEY (native_language_id) REFERENCES languages(id)
);

-- Relation with Users and Languages
CREATE TABLE user_languages (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    language_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (language_id) REFERENCES languages (id)
);

-- Conversations
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id1 INT,
    user_id2 INT,
    language_learning_id INT,
    FOREIGN KEY (user_id1) REFERENCES users(id),
    FOREIGN KEY (user_id2) REFERENCES users(id),
    FOREIGN KEY (language_learning_id) REFERENCES languages(id),
    conversation_name VARCHAR(250),
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT,
    sender_id INT,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    body TEXT,
    sent_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Translations Table
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    translated_body TEXT,
    translation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Message_Translations Relationship
CREATE TABLE message_translations (
    id SERIAL PRIMARY KEY,
    message_id INT NOT NULL,
    translation_id INT NOT NULL,
    priority INT,
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (translation_id) REFERENCES translations(id)
);

-- Insert Test Languages
INSERT INTO languages (language_name)
VALUES ('Español'), ('Inglés'), ('Francés');

-- Insert Test Users
INSERT INTO users (first_name, last_name, country, contact_num, email, password, native_language_id)
VALUES ('Diego', 'Espejo', 'México', '+52 3312253455', 'espejin@tec.mx', '$2b$05$AxGbE.wgTgMQmTKWs4dCJ.57r.w4qeo4E5qmii.rNvaThIHC4LwMa', 1); -- 123456

INSERT INTO users (first_name, last_name, country, contact_num, email, password, native_language_id)
VALUES ('FIAblo', 'HereFIA', 'Afghanistán',  '+52 3323493405', 'fiablo@tec.mx', '$2b$05$5pL2nDOhZ5G7V/ZGWy6j7ue0cVCuX0wFO8VGQ6qc2l8JUJ37FnVsO', 2); -- 123456

-- Insert Test Conversation
INSERT INTO conversations (user_id1, user_id2, conversation_name)
VALUES (1, 2, 'conversation_1'); -- si es la primer conversacion
