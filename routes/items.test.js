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

/************************************** POST /items */

describe("POST /items", function () {
  test("ok for admin", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        categoryHandle: "c1",
        name: "I-new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      item: {
        id: expect.any(Number),
        name: "I-new",
        categoryHandle: "c1",
      },
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        categoryHandle: "c1",
        name: "I-new",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        categoryHandle: "c1",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /items */

describe("GET /items", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get(`/items`);
    expect(resp.body).toEqual({
      items: [
        {
          id: expect.any(Number),
          name: "I1",
          categoryHandle: "c1",
          categoryName: "C1",
        },
        {
          id: expect.any(Number),
          name: "I2",
          categoryHandle: "c1",
          categoryName: "C1",
        },
        {
          id: expect.any(Number),
          name: "I3",
          categoryHandle: "c1",
          categoryName: "C1",
        },
      ],
    });
  });

  test("works: filtering", async function () {
    const resp = await request(app).get(`/items`).query({ name: "I1" });
    expect(resp.body).toEqual({
      items: [
        {
          id: expect.any(Number),
          name: "I1",
          categoryHandle: "c1",
          categoryName: "C1",
        },
      ],
    });
  });

  test("bad request on invalid filter key", async function () {
    const resp = await request(app).get(`/items`).query({ nope: "nope" });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /items/:id */

describe("GET /items/:id", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/items/${testItemIds[0]}`);
    expect(resp.body).toEqual({
      item: {
        id: testItemIds[0],
        name: "I1",
        category: {
          handle: "c1",
          name: "C1",
          description: "Desc1",
        },
      },
    });
  });

  test("not found for no such item", async function () {
    const resp = await request(app).get(`/items/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /items/:id */

describe("PATCH /items/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .patch(`/items/${testItemIds[0]}`)
      .send({
        name: "I-New",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      item: {
        id: expect.any(Number),
        name: "I-New",
        categoryHandle: "c1",
      },
    });
  });

  test("unauth for others", async function () {
    const resp = await request(app)
      .patch(`/items/${testItemIds[0]}`)
      .send({
        name: "I-New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such item", async function () {
    const resp = await request(app)
      .patch(`/items/0`)
      .send({
        handle: "new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on handle change attempt", async function () {
    const resp = await request(app)
      .patch(`/items/${testItemIds[0]}`)
      .send({
        handle: "new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /items/:id */

describe("DELETE /items/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/items/${testItemIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: testItemIds[0] });
  });

  test("unauth for others", async function () {
    const resp = await request(app)
      .delete(`/items/${testItemIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/items/${testItemIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such item", async function () {
    const resp = await request(app)
      .delete(`/items/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
