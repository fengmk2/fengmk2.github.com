#include <stdio.h>
#include <uv.h>

int counter = 0;

void wait_for_a_while(uv_idle_t* handle, int status) {
  counter++;
  printf("%d\n", counter);
  if (counter >= 10) {
    printf("Stop\n");
    uv_idle_stop(handle);
  }
}

int main() {
  uv_idle_t idler;

  uv_idle_init(uv_default_loop(), &idler);
  uv_idle_start(&idler, wait_for_a_while);

  printf("Idling...\n");
  uv_run(uv_default_loop());

  return 0;
}