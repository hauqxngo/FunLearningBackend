const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testItemIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM categories");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO categories (handle, name, description)
    VALUES ('c1', 'C1', 'Desc1'),
           ('c2', 'C2', 'Desc2'),
           ('c3', 'C3', 'Desc3')`);

  const resultsItems = await db.query(`
    INSERT INTO items (name, category_handle)
    VALUES ('Item1', 'c1'),
           ('Item2', 'c1')
    RETURNING id`);
  testItemIds.splice(0, 0, ...resultsItems.rows.map((r) => r.id));

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  await db.query(
    `
        INSERT INTO views(username, item_id)
        VALUES ('u1', $1)`,
    [testItemIds[0]]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testItemIds,
};
