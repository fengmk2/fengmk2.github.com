# 基于Mongodb的聚合框架解决博客系统的常见需求

使用mongodb + nodejs，可以非常快速地完成一个功能完整的博客系统。
常见的对文章的CRUD和评论的CRUD都能实现。
那么稍微复杂的评论聚合也能实现吗？

本文将讲解如何使用mongodb的聚合框架功能实现评论的常见复杂需求。

## 数据结构

* db.post
```
{
  title: @String,
  content: @String,
  views: @Number,
  created_at: @Date,
  upddated_at: @Date,
  author: @String,
  url: @String,
  tags: [@String, ...],
  comments: [{
    content: @String,
    author: @String,
    created_at: @Date,
    votes: @Number,
    related_id: @ObjectId
  }, ...]
```

## 需求1：获取某个用户的按时间倒序的所有评论

获取 @fengmk2 的评论

db.post.aggregate()

## 需求2：获取最近的评论

## 需求3：获取按评论数排序的文章


## 参考

* [Aggregation Framework](http://www.mongodb.org/display/DOCS/Aggregation+Framework)
* [The Comments Conundrum](http://www.snailinaturtleneck.com/blog/2012/02/02/the-comments-conundrum/)