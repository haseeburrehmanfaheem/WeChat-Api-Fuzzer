const CDP = require("chrome-remote-interface");
const remotedebuggerurllink = "ws://127.0.0.1:32751";
const repl = require("repl");
const fs = require("fs").promises;
const filePath = "/Users/haseeb/Desktop/devTool/parameters/output1.txt";


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

global.resultSet = async function () {
    var finalScript = `(()=>{return JSON.stringify(globalThis.resultSet);})()`;
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
}


global.evaluate = async function (script,api) {
  if (!evaluated) {
    console.log("not evaluated :: some error ");
    return;
  }

  var finalScript = `(()=>{
        
        try{
            ${script};
            return JSON.stringify(globalThis.resultSet);

        } catch(err){
            globalThis.resultSet["${api}"]=err;
            return JSON.stringify(err);
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
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.trim().split('\n');
        lines.forEach(line => {
            const firstSpaceIndex = line.indexOf(' ');
            let name, parameters;
            if (firstSpaceIndex !== -1) {
                name = line.substring(0, firstSpaceIndex);
                parameters = line.substring(firstSpaceIndex + 1);
            } else {
                name = line;
                parameters = ''; 
            }
            console.log('---'); 
            console.log('Name:', name);
            console.log('Parameters:', parameters);
            
            var finalScript = `wx.${name}({${parameters}success: function (res) {globalThis.resultSet["${name}"]=res;},fail: function(err){globalThis.resultSet["${name}"]=err;}});`;
            evaluate(finalScript, name);
        });
    } catch (err) {
        console.error('Error reading file:', err);
    }
}


runEach();