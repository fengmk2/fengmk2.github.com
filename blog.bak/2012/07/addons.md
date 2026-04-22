# 编写nodejs的C++模块

nodejs提供了完善的插件机制（addons），让我们可以非常方便地调用C和C++库。

## Javascript 映射到 C++

* 普通字符串

```js
'hello world'
```

```cpp
String::New("hello world")
```

* 局部Number型变量

```js
var num = 1;
```

```cpp
Local<Number> num = Number::New(1);
```

* undefined

```js
undefined
```

```cpp
Undefined()
```

* 抛异常

```js
throw new TypeError('Wrong type');
```

```cpp
ThrowException(Exception::TypeError(String::New("Wrong type")));
```

* create object

```js
var user = {name: 'mk2', gender: male};
```

```cpp
Local<Object> user = Object::New();
user->Set(String::NewSymbol("name"), String::New("mk2"));
user->Set(String::NewSymbol("gender"), String::New("male"));
```

* function

```js
function add(a, b) {
  return a + b;
}
```

```cpp
Handle<Value> Add(const Arguments& args) {
  HandleScope scope;
  Local<Number> num = Number::New(args[0]->NumberValue() + args[1]->NumberValue());
  return scope.Close(num);
}

void Init(Handle<Object> target) {
  target->Set(String::NewSymbol("add"), FunctionTemplate::New(Add)->GetFunction());
}
```

* callbacks

```js
function next(callback) {
  callback('hi');
}
```

```cpp
Handle<Value> Next(const Arguments& args) {
  HandleScope scope;

  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = { Local<Value>::New(String::New("hi")) };
  cb->Call(Context::GetCurrent()->Global(), argc, argv);

  return scope.Close(Undefined());
}

void Init(Handle<Object> target) {
  target->Set(String::NewSymbol("next"), FunctionTemplate::New(Next)->GetFunction());
}
```

* return a function

```js
function createServer(name) {
  return function echo() {
    return name;
  };
}
```

(wrong)

```cpp
Handle<Value> Echo(const Arguments& args) {
  HandleScope scope;
  return scope.Close(args[0]);
}

Handle<Value> CreateServer(const Arguments& args) {
  HandleScope scope;

  Local<FunctionTemplate> tpl = FunctionTemplate::New(Echo);
  Local<Function> fn = tpl->GetFunction(args);
  fn->SetName(String::NewSymbol("echo")); // omit this to make it anonymous

  return scope.Close(fn);
}

void Init(Handle<Object> target) {
  target->Set(String::NewSymbol("createServer"), 
    FunctionTemplate::New(CreateServer)->GetFunction());
}
```

* 类定义

```js
function MyObject(startCounter) {
  this._counter = startCounter;
}

MyObject.prototype.plusOne = function () {
  this._counter += 1;
  return this._counter;
};
```

`myobject.h`

```cpp
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Handle<v8::Object> target);

 private:
  MyObject();
  ~MyObject();

  static v8::Handle<v8::Value> New(const v8::Arguments& args);
  static v8::Handle<v8::Value> PlusOne(const v8::Arguments& args);
  double counter_;
};

#endif
```

`myobject.cc`

```cpp
#define BUILDING_NODE_EXTENSION
#include <node.h>
#include "myobject.h"

using namespace v8;

MyObject::MyObject() {};
MyObject::~MyObject() {};

void MyObject::Init(Handle<Object> target) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
  tpl->SetClassName(String::NewSymbol("MyObject"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);
  // Prototype
  tpl->PrototypeTemplate()->Set(String::NewSymbol("plusOne"),
      FunctionTemplate::New(PlusOne)->GetFunction());

  Persistent<Function> constructor = Persistent<Function>::New(tpl->GetFunction());
  target->Set(String::NewSymbol("MyObject"), constructor);
}

Handle<Value> MyObject::New(const Arguments& args) {
  HandleScope scope;

  MyObject* obj = new MyObject();
  obj->counter_ = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
  obj->Wrap(args.This());

  return args.This();
}

Handle<Value> MyObject::PlusOne(const Arguments& args) {
  HandleScope scope;

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->counter_ += 1;

  return scope.Close(Number::New(obj->counter_));
}
```

