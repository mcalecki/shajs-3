const childProcess = require("child_process");

const fsp = require("fs/promises");
const path = require("path");
const { postLocal } = require("./api");
const EventEmitter = require("events");
const process = require("process");
let worker = null;
const events = new EventEmitter();
exports.events = events;
let time = new Date().getTime();
const Init = (exports.Init = function () {
  if (worker) return;
  // console.log("#Master Init");
  worker = childProcess.fork(path.join(__dirname, "worker.js"));

  // worker.send("Hello world.");
});
Init();
/**
 * 更新数据
 * @param {{header: string, footer: string, tailLength: number,headFoot:string}} data
 */
exports.update = function (data) {
  worker.send({ type: "set", data });
};

exports.startGen = function (data) {
  worker.send({ type: "set", data });
  worker.send({ type: "start" });
};

exports.stopGen = function () {
  worker.send({ type: "stop" });
};

exports.exit = function () {
  try {
    worker.kill();
  } catch (error) {}
  worker = null;
};
