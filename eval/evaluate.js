const CDP = require('chrome-remote-interface');
const remotedebuggerurllink = 'ws://127.0.0.1:37077';
const repl = require('repl');


var runtime = null;
var evaluated = false;
var id = 0;

async function main(){
    var chromeDebugger = await CDP({target: remotedebuggerurllink, local: true});
    var script = `(()=>{globalThis.resultSet = {}; return (globalThis.resultSet !== undefined).toString();})()`
    this.runtime = chromeDebugger.Runtime;
    await this.runtime.evaluate({expression: script, contextId:2, timeout: 5000}).then(
        (res)=>{
            console.log("evaluated with result : " + res.result.value);

            if(res.result.value === "true"){
                evaluated = true;
            }
        }).catch((err)=>{
            console.log(err);
        })

        if(evaluated){
            console.log("evaluated");
            repl.start();
        }
}

global.evaluate = async function(script){
    if(!evaluated){
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
    })()`
    await this.runtime.evaluate({expression: finalScript, contextId:2, timeout: 5000}).then(
        (res)=>{
            if(res.result.subtype && res.result.subtype === "error"){
                console.log("error in evaluating script");
                console.log(res.result.description);
            }
            console.log("evaluated with result : " + (res.result.value));
        }).catch((err)=>{
            console.log("err : " + err);
        })
}


main();





