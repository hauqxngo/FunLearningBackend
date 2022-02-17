"use strict";

/** Routes for items. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Item = require("../models/item");
const itemNewSchema = require("../schemas/itemNew.json");
const itemUpdateSchema = require("../schemas/itemUpdate.json");
const itemSearchSchema = require("../schemas/itemSearch.json");

const router = express.Router({ mergeParams: true });

/** POST / { item } => { item }
 *
 * item should be { name, categoryHandle }
 *
 * Returns { id, name, categoryHandle }
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, itemNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.create(req.body);
    return res.status(201).json({ item });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { items: [ { id, name, categoryHandle, categoryName }, ...] }
 *
 * Can provide search filter in query:
 * - name (will find case-insensitive, partial matches)

 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;

  try {
    const validator = jsonschema.validate(q, itemSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const items = await Item.findAll(q);
    return res.json({ items });
  } catch (err) {
    return next(err);
  }
});

/** GET /[itemId] => { item }
 *
 * Returns { id, name, category }
 *   where category is { handle, name, description }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const item = await Item.get(req.params.id);
    return res.json({ item });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[itemId]  { fld1, fld2, ... } => { item }
 *
 * Data can include: { name }
 *
 * Returns { id, name, categoryHandle }
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, itemUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.update(req.params.id, req.body);
    return res.json({ item });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Item.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
