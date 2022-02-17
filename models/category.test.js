"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Category = require("./category.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testItemIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newCategory = {
    handle: "new",
    name: "New",
    description: "New Description",
  };

  test("works", async function () {
    let category = await Category.create(newCategory);
    expect(category).toEqual(newCategory);

    const result = await db.query(
      `SELECT handle, name, description
           FROM categories
           WHERE handle = 'new'`
    );
    expect(result.rows).toEqual([
      {
        handle: "new",
        name: "New",
        description: "New Description",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Category.create(newCategory);
      await Category.create(newCategory);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all", async function () {
    let categories = await Category.findAll();
    expect(categories).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
      },
    ]);
  });

  test("works: by name", async function () {
    let categories = await Category.findAll({ name: "1" });
    expect(categories).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
      },
    ]);
  });

  test("works: empty list on nothing found", async function () {
    let categories = await Category.findAll({ name: "nope" });
    expect(categories).toEqual([]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let category = await Category.get("c1");
    expect(category).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      items: [
        { id: testItemIds[0], name: "Item1" },
        { id: testItemIds[1], name: "Item2" },
      ],
    });
  });

  test("not found if no such category", async function () {
    try {
      await Category.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "New",
    description: "New Description",
  };

  test("works", async function () {
    let category = await Category.update("c1", updateData);
    expect(category).toEqual({
      handle: "c1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT handle, name, description
           FROM categories
           WHERE handle = 'c1'`
    );
    expect(result.rows).toEqual([
      {
        handle: "c1",
        name: "New",
        description: "New Description",
      },
    ]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      name: "New",
      description: "New Description",
    };

    let category = await Category.update("c1", updateDataSetNulls);
    expect(category).toEqual({
      handle: "c1",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT handle, name, description
           FROM categories
           WHERE handle = 'c1'`
    );
    expect(result.rows).toEqual([
      {
        handle: "c1",
        name: "New",
        description: "New Description",
      },
    ]);
  });

  test("not found if no such category", async function () {
    try {
      await Category.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Category.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Category.remove("c1");
    const res = await db.query(
      "SELECT handle FROM categories WHERE handle='c1'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such category", async function () {
    try {
      await Category.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
