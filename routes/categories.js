"use strict";

/** Routes for categories. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Category = require("../models/category");

const categoryNewSchema = require("../schemas/categoryNew.json");
const categoryUpdateSchema = require("../schemas/categoryUpdate.json");
const categorySearchSchema = require("../schemas/categorySearch.json");

const router = new express.Router();

/** POST / { category } =>  { category }
 *
 * category should be { handle, name, description }
 *
 * Returns { handle, name, description }
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, categoryNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const category = await Category.create(req.body);
    return res.status(201).json({ category });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { categories: [ { handle, name, description }, ...] }
 *
 * Can filter on provided search filters:
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;

  try {
    const validator = jsonschema.validate(q, categorySearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const categories = await Category.findAll(q);
    return res.json({ categories });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { category }
 *
 *  Category is { handle, name, description, items }
 *   where items is [{ id, name }, ...]
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const category = await Category.get(req.params.handle);
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { category }
 *
 * Patches category data.
 *
 * fields can be: { name, description }
 *
 * Returns { handle, name, description }
 *
 * Authorization required: admin
 */

router.patch("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, categoryUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const category = await Category.update(req.params.handle, req.body);
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    await Category.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
