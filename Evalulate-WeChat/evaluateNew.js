const CDP = require("chrome-remote-interface");
const remotedebuggerurllink = "ws://127.0.0.1:37077";
const repl = require("repl");
const fs = require("fs").promises;

var runtime = null;
var evaluated = false;
var id = 0;

async function main() {
  var chromeDebugger = await CDP({
    target: remotedebuggerurllink,
    local: true,
  });
  var script = `(()=>{globalThis.resultSet = {}; return (globalThis.resultSet !== undefined).toString();})()`;
  this.runtime = chromeDebugger.Runtime;
  await this.runtime
    .evaluate({ expression: script, contextId: 2, timeout: 5000 })
    .then((res) => {
      console.log("evaluated with result : " + res.result.value);

      if (res.result.value === "true") {
        evaluated = true;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  if (evaluated) {
    console.log("evaluated");
    await runEach();
    repl.start();
  }
}

global.evaluate = async function (script) {
  if (!evaluated) {
    console.log("not evaluated :: some error ");
    return;
  }

  var finalScript = `(()=>{
        var result = {};
        try{
            result = ${script};
            return JSON.stringify(result);

        } catch(err){
            result.error = err;
            return JSON.stringify(result);
        }
    })()`;
  await this.runtime
    .evaluate({ expression: finalScript, contextId: 2, timeout: 5000 })
    .then((res) => {
      if (res.result.subtype && res.result.subtype === "error") {
        console.log("error in evaluating script");
        console.log(res.result.description);
      }
      console.log("evaluated with result : " + res.result.value);
    })
    .catch((err) => {
      console.log("err : " + err);
    });
};

async function runEach() {
  const inputD = await fs.readFile("./undocumentedAPIs.txt");
  const inputArray = inputD.toString().split("\n");
  console.log("inputArray : " + inputArray);

  for (const element of inputArray) {
    console.log("element : " + element);
    var finalScript = `wx.${element}({success: function (res) {globalThis.resultSet["${element}"]=res;},fail: function(err){globalThis.resultSet["${element}"]=err;}});`;

    await evaluate(finalScript);
  }
}

main();

// evaluate(`globalThis.resultSet`)

// wx.getLocation({
//   type: "wgs84",
//   success: function (res) {
//     globalThis.resultSet["getLocation"] = res;
//   },
//   fail: function (err) {
//     globalThis.resultSet["getLocation"] = err;
//   },
// });
// wx.getLocation({
//   success: function (res) {
//     globalThis.resultSet["getLocation"] = res;
//   },
//   fail: function (err) {
//     globalThis.resultSet["getLocation"] = err;
//   },
// });

// await evaluate(`wx.getLocation({success: function (res) {globalThis.resultSet["getLocation"]=res;},fail: function(err){globalThis.resultSet["getLocation"]=err;}});`)
// await evaluate(`globalThis.resultSet`)