#!/usr/bin/env python
# -*- coding: utf-8 -*-


def foo(i):
    if i == 0:
     print 'bar'
  elif i == 1:
      print i
  
foo(0)
foo(1)
# 要么是全是tab，要么全是4空格，推荐使用4空格替换一个tab
# 要不然会出现 IndentationError: unindent does not match any outer indentation level