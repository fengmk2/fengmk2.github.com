// @fool http://cnodejs.org/blog/?p=4982#comment-1875

#include <stdio.h>
 
template<int n>
struct fibonacci {
    enum { Result = fibonacci<n-2>::Result + fibonacci<n-1>::Result };
};
 
template<>
struct fibonacci<1> {
    enum { Result = 1 };
};
 
template<>
struct fibonacci<0> {
    enum { Result = 1 };
};
 
int main(int argc, char *argv[])
{
    printf("%d\n", fibonacci<40>::Result);
    return 0;
}