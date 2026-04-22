#include <stdio.h>

/* Declare a static buffer for user input of maximum size 2048 */
static char input[2048];

int main(int argc, char** argv) {
  // print version and exit infomation
  puts("Lispy version 0.0.1");
  puts("Press ctrl + c to exit\n");

  while (1) {
    // output our prompt
    fputs("lispy> ", stdout);

    // readline
    fgets(input, 2048, stdin);

    // echo
    printf("No you're a %s", input);
  }

  return 0;
}
