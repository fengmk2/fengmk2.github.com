UV_PATH=$(HOME)/git/libuv
CFLAGS=-g -Wall -I$(UV_PATH)/include $(UV_PATH)/libuv.a

uname_S=$(shell uname -s)

ifeq (Darwin, $(uname_S))
CFLAGS+=-framework CoreServices
endif

ifeq (Linux, $(uname_S))
CFLAGS+=-lrt -ldl -lm -lev -pthread
endif

helloworld: build/libuv.a
	gcc $(CFLAGS) $@/main.c -o $@/main

idle-basic: build/libuv.a
	gcc $(CFLAGS) $@/main.c -o $@/main

build/libuv.a:
	make -C $(UV_PATH)

clean:
	rm $(UV_PATH)/libuv.a

.PHONY: clean build