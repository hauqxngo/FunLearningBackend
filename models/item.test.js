"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Item = require("./item.js");
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
  let newItem = {
    categoryHandle: "c1",
    name: "Test",
  };

  test("works", async function () {
    let item = await Item.create(newItem);
    expect(item).toEqual({
      ...newItem,
      id: expect.any(Number),
    });
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let items = await Item.findAll();
    expect(items).toEqual([
      {
        id: testItemIds[0],
        name: "Item1",
        categoryHandle: "c1",
        categoryName: "C1",
      },
      {
        id: testItemIds[1],
        name: "Item2",
        categoryHandle: "c1",
        categoryName: "C1",
      },
    ]);
  });

  test("works: by name", async function () {
    let items = await Item.findAll({ name: "Item1" });
    expect(items).toEqual([
      {
        id: testItemIds[0],
        name: "Item1",
        categoryHandle: "c1",
        categoryName: "C1",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let item = await Item.get(testItemIds[0]);
    expect(item).toEqual({
      id: testItemIds[0],
      name: "Item1",
      category: {
        handle: "c1",
        name: "C1",
        description: "Desc1",
      },
    });
  });

  test("not found if no such item", async function () {
    try {
      await Item.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  let updateData = {
    name: "New",
  };
  test("works", async function () {
    let item = await Item.update(testItemIds[0], updateData);
    expect(item).toEqual({
      id: testItemIds[0],
      categoryHandle: "c1",
      ...updateData,
    });
  });

  test("not found if no such item", async function () {
    try {
      await Item.update(0, {
        name: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Item.update(testItemIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Item.remove(testItemIds[0]);
    const res = await db.query("SELECT id FROM items WHERE id=$1", [
      testItemIds[0],
    ]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such item", async function () {
    try {
      await Item.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
