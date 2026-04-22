#include <stdio.h>

void diamond(int len, char pic) {
    if(len % 2 == 0) {
        printf("%d not allow!\n", len);
        return;
    }
    int i, j;
    int min = len / 2;
    printf("%d\n", min);
    for(i = 0; i < len; i++) {
        for(j = 0; j < len; j++) {
            if(i + j < min || i - j > min || j - i > min) {
                printf(" \t");
            } else {
                printf("%c\t", pic);
            }
        }
        printf("\n");
    }
}

int main(void) {
    diamond(3, '*');
    diamond(4, '-');
    diamond(5, '+');
    diamond(9, '*');
    return 0;
}
