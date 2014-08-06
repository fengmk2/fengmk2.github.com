#include <node.h>
#include <v8.h>

using namespace v8;

Handle<Value> Hello(const Arguments& args) {
  HandleScope scope;
  return scope.Close(String::New("world"));
}

Handle<Value> HelloNoClose(const Arguments& args) {
  HandleScope scope;
  return String::New("world no close");
}

Handle<Value> GetUndefined(const Arguments& args) {
  HandleScope scope;
  return Undefined();
}

// https://developers.google.com/v8/embed?hl=zh-CN#handles
// This function returns a new array with three elements, x, y, and z.
Handle<Value> NewPointArray(const Arguments& args) {

  // We will be creating temporary handles so we use a handle scope.
  HandleScope handle_scope;

  // Create a new empty array.
  Handle<Array> array = Array::New(3);

  // Return an empty result if there was an error creating the array.
  if (array.IsEmpty())
    return Handle<Array>();

  // Fill out the values
  array->Set(0, args[0]);
  array->Set(1, args[1]);
  array->Set(2, args[2]);

  // Return the value through Close.
  return handle_scope.Close(array);
}

Handle<Value> NewPointArrayNoClose(const Arguments& args) {

  // We will be creating temporary handles so we use a handle scope.
  HandleScope handle_scope;

  // Create a new empty array.
  Handle<Array> array = Array::New(3);

  // Return an empty result if there was an error creating the array.
  if (array.IsEmpty())
    return Handle<Array>();

  // Fill out the values
  array->Set(0, args[0]);
  array->Set(1, args[1]);
  array->Set(2, args[2]);

  return array;
}

Handle<Value> Cycle(const Arguments& args) {
  HandleScope scope;
  int n = args[0]->Int32Value();
  int s = 0, i = 0;
  for (i = 0; i < n; i++) {
    s++;
  }
  return scope.Close(Integer::New(s));
}

void init(Handle<Object> target) {
  target->Set(String::NewSymbol("hello"),
    FunctionTemplate::New(Hello)->GetFunction());
  target->Set(String::NewSymbol("helloNoClose"),
    FunctionTemplate::New(HelloNoClose)->GetFunction());
  target->Set(String::NewSymbol("newPointArray"),
    FunctionTemplate::New(NewPointArray)->GetFunction());
  target->Set(String::NewSymbol("newPointArrayNoClose"),
    FunctionTemplate::New(NewPointArrayNoClose)->GetFunction());
  target->Set(String::NewSymbol("cycle"),
    FunctionTemplate::New(Cycle)->GetFunction());
  target->Set(String::NewSymbol("getUndefined"),
    FunctionTemplate::New(GetUndefined)->GetFunction());
}
NODE_MODULE(mk2, init)
