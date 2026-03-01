#include <stdio.h>

int main(int argc, char** argv) {
  puts("hello fengmk2");
  puts(*argv);
  puts(*(argv + 1));
  return 0;
}
