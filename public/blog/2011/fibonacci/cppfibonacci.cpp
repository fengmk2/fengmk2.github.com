#include <node/v8.h>
#include <node/node.h>

using namespace v8;

int fibonacci(int n) {
  if (n < 2) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

Handle<Value> Fibonacci(const Arguments& args) {
    HandleScope scope;

    if (args.Length() < 1) {
        return ThrowException(Exception::TypeError(
            String::New("First argument must be a number")));
    }
    Local<Integer> integer = args[0]->ToInteger();
    int r = fibonacci(integer->Value());

    return scope.Close(Integer::New(r));
}

void RegisterModule(v8::Handle<v8::Object> target) {
    // Add properties to target
    NODE_SET_METHOD(target, "fibonacci", Fibonacci);
}

// Register the module with node.
NODE_MODULE(cppfibonacci, RegisterModule);