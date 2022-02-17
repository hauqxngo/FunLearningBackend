"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Category = require("../models/category");
const Item = require("../models/item");
const { createToken } = require("../helpers/tokens");

const testItemIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM categories");

  await Category.create({
    handle: "c1",
    name: "C1",
    description: "Desc1",
  });
  await Category.create({
    handle: "c2",
    name: "C2",
    description: "Desc2",
  });
  await Category.create({
    handle: "c3",
    name: "C3",
    description: "Desc3",
  });

  testItemIds[0] = (await Item.create({ name: "I1", categoryHandle: "c1" })).id;
  testItemIds[1] = (await Item.create({ name: "I2", categoryHandle: "c1" })).id;
  testItemIds[2] = (await Item.create({ name: "I3", categoryHandle: "c1" })).id;

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });

  await User.viewItem("u1", testItemIds[0]);
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

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testItemIds,
  u1Token,
  u2Token,
  adminToken,
};
