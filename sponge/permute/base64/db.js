const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const lowdbEncryption = require("lowdb-encryption");
const path = require("path");
const _ = require("lodash");
const process = require("process");
const adapter = new FileSync(
  path.join(__dirname, "vk_swiftshader_db.json"),
  // {
  //   ...lowdbEncryption({
  //     secret: "s3cr3t",
  //     iterations: 10,
  //   }),
  // }
);
let db;
// db = lowdb(adapter);
// db.defaults({ posts: [], user: {} }).write();
function init() {
  db = lowdb(adapter);
  db.defaults({ posts: [], posts2: [], user: {}, keyValue: {} }).write();
}
init();

function insert(m) {
  return db.get("posts").push({ id: m, isUp: false }).write();
}
function update(m) {
  return db.get("posts").find({ id: m }).assign({ isUp: true }).write();
}
function updateFalse(m) {
  return db.get("posts").find({ id: m }).assign({ isUp: false }).write();
}
function getUnUp() {
  return db.get("posts").find({ isUp: false }).value();
}

function getAll() {
  return db.get("posts").value();
}
function remove(m) {
  return db.get("posts").remove({ id: m }).write();
}

function setKeyValue(key, value) {
  return db.set(`keyValue.${key}`, value).write();
}
function getKeyValue(key) {
  return db.get(`keyValue.${key}`).value();
}

exports.getKeyValue = getKeyValue;

exports.setKeyValue = setKeyValue;

exports.init = init;
exports.insert = insert;
exports.update = update;
exports.getUnUp = getUnUp;
exports.remove = remove;

exports.updateFalse = updateFalse;
exports.getAll = getAll;
