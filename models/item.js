"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for categories. */

class Item {
  /** Create an item (from data), update db, return new item data.
   *
   * data should be { name, categoryHandle }
   *
   * Returns { id, name, categoryHandle }
   **/

  static async create(data) {
    const result = await db.query(
      `INSERT INTO items (name,
                          category_handle)
           VALUES ($1, $2)
           RETURNING id, name, category_handle AS "categoryHandle"`,
      [data.name, data.categoryHandle]
    );
    let item = result.rows[0];

    return item;
  }

  /** Find all items (optional filter on searchFilters).
   *
   * searchFilters (optional):
   * - name (will find case-insensitive, partial matches)
   *
   * Returns [{ id, name, categoryHandle, categoryName }, ...]
   * */

  static async findAll({ name } = {}) {
    let query = `SELECT i.id,
                        i.name,
                        i.category_handle AS "categoryHandle",
                        c.name AS "categoryName"
                 FROM items i 
                   LEFT JOIN categories AS c ON c.handle = i.category_handle`;
    let whereExpressions = [];
    let queryValues = [];

    // For each possible search term, add to whereExpressions and
    // queryValues so we can generate the right SQL

    if (name !== undefined) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`i.name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY i.name";
    const itemsRes = await db.query(query, queryValues);
    return itemsRes.rows;
  }

  /** Given an item id, return data about item.
   *
   * Returns { id, name, categoryHandle, category }
   *   where category is { handle, name, description }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const itemRes = await db.query(
      `SELECT id,
                  name,
                  category_handle AS "categoryHandle"
           FROM items
           WHERE id = $1`,
      [id]
    );

    const item = itemRes.rows[0];

    if (!item) throw new NotFoundError(`No item: ${id}`);

    const categoriesRes = await db.query(
      `SELECT handle,
                  name,
                  description
           FROM categories
           WHERE handle = $1`,
      [item.categoryHandle]
    );

    delete item.categoryHandle;
    item.category = categoriesRes.rows[0];

    return item;
  }

  /** Update item data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name }
   *
   * Returns { id, name, categoryHandle }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE items 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                category_handle AS "categoryHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const item = result.rows[0];

    if (!item) throw new NotFoundError(`No item: ${id}`);

    return item;
  }

  /** Delete given item from database; returns undefined.
   *
   * Throws NotFoundError if category not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM items
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const item = result.rows[0];

    if (!item) throw new NotFoundError(`No item: ${id}`);
  }
}

module.exports = Item;
