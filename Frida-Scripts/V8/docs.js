const uv_default_loop = new NativeFunction(Module.getExportByName(null, 'uv_default_loop'), 'pointer', []);
const uv_async_init = new NativeFunction(Module.getExportByName(null, 'uv_async_init'), 'int', ['pointer', 'pointer', 'pointer']);
const uv_async_send = new NativeFunction(Module.getExportByName(null, 'uv_async_send'), 'int', ['pointer']);
const uv_close = new NativeFunction(Module.getExportByName(null, 'uv_close'), 'void', ['pointer', 'pointer']);
const uv_unref = new NativeFunction(Module.getExportByName(null, 'uv_unref'), 'void', ['pointer']);

const v8_Isolate_GetCurrent = new NativeFunction(Module.getExportByName(null, '_ZN2v87Isolate10GetCurrentEv'), 'pointer', []);
const v8_Isolate_GetCurrentContext = new NativeFunction(Module.getExportByName(null, '_ZN2v87Isolate17GetCurrentContextEv'), 'pointer', ['pointer']);

const v8_HandleScope_init = new NativeFunction(Module.getExportByName(null, '_ZN2v811HandleScopeC1EPNS_7IsolateE'), 'void', ['pointer', 'pointer']);
const v8_HandleScope_finalize = new NativeFunction(Module.getExportByName(null, '_ZN2v811HandleScopeD1Ev'), 'void', ['pointer']);

const v8_String_NewFromUtf8 = new NativeFunction(Module.getExportByName(null, '_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi'), 'pointer', ['pointer', 'pointer', 'int', 'int']);

const v8_Script_Compile = new NativeFunction(Module.getExportByName(null, '_ZN2v86Script7CompileENS_5LocalINS_7ContextEEENS1_INS_6StringEEEPNS_12ScriptOriginE'), 'pointer', ['pointer', 'pointer', 'pointer']);
const v8_Script_Run = new NativeFunction(Module.getExportByName(null, '_ZN2v86Script3RunENS_5LocalINS_7ContextEEE'), 'pointer', ['pointer', 'pointer']);

const NewStringType = {
  kNormal: 0,
  kInternalized: 1
};

const pending = [];

const processPending = new NativeCallback(function () {
  const isolate = v8_Isolate_GetCurrent();

  const scope = Memory.alloc(24);
  v8_HandleScope_init(scope, isolate);

  const context = v8_Isolate_GetCurrentContext(isolate);

  while (pending.length > 0) {
    const item = pending.shift();
    const source = v8_String_NewFromUtf8(isolate, Memory.allocUtf8String(item), NewStringType.kNormal, -1);
    const script = v8_Script_Compile(context, source, NULL);
    const result = v8_Script_Run(script, context);
  }

  v8_HandleScope_finalize(scope);
}, 'void', ['pointer']);

const onClose = new NativeCallback(function () {
  Script.unpin();
}, 'void', ['pointer']);

const handle = Memory.alloc(128);
uv_async_init(uv_default_loop(), handle, processPending);
uv_unref(handle);

Script.bindWeak(handle, () => {
  Script.pin();
  uv_close(handle, onClose);
});

function run(source) {
  pending.push(source);
  uv_async_send(handle);
}

run('console.log("Hello from Frida");');