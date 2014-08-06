#include <stdio.h>

int add_together(int x, int y) {
  int result = x + y;
  return result;
}

typedef struct {
  float x;
  float y;
} point;

int main(int argc, char** argv) {
  int added = add_together(argc, 100);

  point p;
  p.x = 0.11;
  p.y = 100.12;
  
  return 0;
}
