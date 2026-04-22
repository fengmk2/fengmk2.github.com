#include <stdio.h>

int main(void) {
    int x = 198;
    printf("x: %d, 个位%d, 十位%d\n", x, x % 10, x / 10 % 10);
    return 0;
}
