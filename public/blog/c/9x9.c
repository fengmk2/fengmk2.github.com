#include <stdio.h>

int main(void) {
    int i, j, n;
    for(i = 1; i <= 9; i++) {
        n = i == 1 ? 9 : i;
        for(j = 1; j <= n; j++) {
            printf("%d\t", i * j);
        }
        printf("\n");
    }
    return 0;
}
