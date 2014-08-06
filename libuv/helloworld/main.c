#include <stdio.h>
#include <uv.h>

int main() {
  uv_loop_t *loop = uv_loop_new();
  // equal=> 
  // struct uv_loop_s *loop = uv_loop_new();

  printf("Hello libuv.\n");
  uv_run(loop);

  return 0;
}