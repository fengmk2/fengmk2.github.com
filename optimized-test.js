'use strict';

// http://dev.zm1v1.com/2015/08/19/javascript-optimization-killers/?spm=0.0.0.0.Rxyzi2

// 包含需要审查的用法的函数 (这里是 with 语句)
function argumentsToArray(args) {
  var res = new Array(args.length);
  for (var i = 0; i < args.length; i++) {
    res[i] = args[i];
  }
  return res;
  // return 3;
  // try {} catch (e) {}
  // with({}) { }
}

// function testFn() {
//   var res = argumentsToArray(arguments);
//   console.log(res.length);
//   return res.length;
// }

// function testFn() {
//   var res = new Array(arguments.length);
//   for (var i = 0; i < arguments.length; i++) {
//     res[i] = arguments[i];
//   }
//   console.log(res.length);
//   return res.length;
// }

// function testFn() {
//   // var res = [].slice.call(arguments);
//   var res = Array.prototype.slice.apply(arguments);
//   console.log(res.length);
//   return res.length;
// }

// function testFn(...args) {
//   return args.length;
// }

// function testFn() {
//   let a = 1;
//   let b = 2;
//   [a, b] = [b, a];
//   return a;
// }

function testFn(a, b) {
  const foo = [1, 2, 3];
  let total = 0;
  for (const a of foo) {
    const c = a;
    total += c;
  }
  return total;
}

function printStatus(fn) {
  var status = %GetOptimizationStatus(fn);
  // https://github.com/NathanaelA/v8-Natives/issues/5
  switch(status) {
    case 1: console.log("Function is optimized"); break;
    case 2: console.log("Function is not optimized"); break;
    case 3: console.log("Function is always optimized"); break;
    case 4: console.log("Function is never optimized"); break;
    case 6: console.log("Function is maybe deoptimized"); break;
    case 7: console.log("Function is TurboFan compiler"); break;
    default: console.log("Unknow GetOptimizationStatus %s", status); break;
  }
}

console.log('node %s', process.version);
console.log(testFn.toString());
console.log(testFn());

// 告诉编译器类型信息
testFn();
// 为了使状态从 uninitialized 变为 pre-monomorphic, 再变为 monomorphic, 两次调用是必要的
testFn();

%OptimizeFunctionOnNextCall(testFn);
// 下一次调用
testFn();

// 检查
printStatus(testFn);

// $ node --trace_opt --trace_deopt --allow-natives-syntax optimized-test.js
