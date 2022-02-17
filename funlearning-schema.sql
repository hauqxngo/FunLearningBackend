CREATE TABLE categories (
  handle VARCHAR(25) PRIMARY KEY CHECK (handle = lower(handle)),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category_handle VARCHAR(25) NOT NULL
    REFERENCES categories ON DELETE CASCADE
);

CREATE TABLE views (
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  item_id INTEGER
    REFERENCES items ON DELETE CASCADE,
  PRIMARY KEY (username, item_id)
);