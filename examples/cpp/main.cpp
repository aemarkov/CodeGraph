#include "module.h"
#include <functional>
#include <iostream>

typedef void (*funcptr)();

struct Struct1 {
  int x;
  int y;
};

class Class1 {
public:
  Class1() {}

  ~Class1() {}

  void public_method() { private_method(); }

private:
  int x;
  int y;

  void private_method() {}
};

int global;
int global_value = 1;
const int const_global_value = 1;

static void static_func_1() {
  Class1 c1;
  c1.public_method();
}

static void static_func_2() { module_func_1(); }

static void static_func_3() {
  static_func_1();
  static_func_2();
  module_func_1();
}

static void static_func_4() {
  auto lambda = []() { static_func_2(); };
  funcptr ptr = static_func_2;
  std::function<void()> func = static_func_2;

  lambda();
  ptr();
  func();
}

static void one_line_function() {}

int main() {
  static_func_3();
  static_func_4();
  one_line_function();
  return 0;
}
