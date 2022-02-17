"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testItemIds,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /categories */

describe("POST /categories", function () {
  const newCategory = {
    handle: "new",
    name: "New",
    description: "DescNew",
  };

  test("ok for admin", async function () {
    const resp = await request(app)
      .post("/categories")
      .send(newCategory)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      category: newCategory,
    });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .post("/categories")
      .send(newCategory)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/categories")
      .send({
        handle: "new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /categories */

describe("GET /categories", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/categories");
    expect(resp.body).toEqual({
      categories: [
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
      ],
    });
  });

  test("works: filtering", async function () {
    const resp = await request(app).get("/categories").query({ name: "C3" });
    expect(resp.body).toEqual({
      categories: [
        {
          handle: "c3",
          name: "C3",
          description: "Desc3",
        },
      ],
    });
  });

  test("bad request if invalid filter key", async function () {
    const resp = await request(app).get("/categories").query({ nope: "nope" });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /categories/:handle */

describe("GET /categories/:handle", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/categories/c1`);
    expect(resp.body).toEqual({
      category: {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        items: [
          { id: testItemIds[0], name: "I1" },
          { id: testItemIds[1], name: "I2" },
          { id: testItemIds[2], name: "I3" },
        ],
      },
    });
  });

  test("works for anon: category w/o items", async function () {
    const resp = await request(app).get(`/categories/c2`);
    expect(resp.body).toEqual({
      category: {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        items: [],
      },
    });
  });

  test("not found for no such category", async function () {
    const resp = await request(app).get(`/categories/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /categories/:handle */

describe("PATCH /categories/:handle", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .patch(`/categories/c1`)
      .send({
        name: "C1-new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      category: {
        handle: "c1",
        name: "C1-new",
        description: "Desc1",
      },
    });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .patch(`/categories/c1`)
      .send({
        name: "C1-new",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/cateogries/c1`).send({
      name: "C1-new",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such cateogry", async function () {
    const resp = await request(app)
      .patch(`/cateogries/nope`)
      .send({
        name: "new nope",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on handle change attempt", async function () {
    const resp = await request(app)
      .patch(`/categories/c1`)
      .send({
        handle: "c1-new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /categories/:handle */

describe("DELETE /categories/:handle", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/categories/c1`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: "c1" });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .delete(`/categories/c1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/categories/c1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such category", async function () {
    const resp = await request(app)
      .delete(`/categories/nope`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
