# 基于 Postgres 实现一个 Job Queue

今天看到一篇赞美 Postgres 的文章：[Postgres is Too Good (And Why That's Actually a Problem)](https://dev.to/shayy/postgres-is-too-good-and-why-thats-actually-a-problem-4imc) ，显然是非常吸引眼球的，作者用 PG 实现了需要用到的所有微服务。

做 AFFiNE 我们是用 Redis 的 pub/sub 实现的 Job Queue，所以想参考一下用 Postgres 实现对比看看。

## 直接问 ChatGPT 怎样实现

> 基于 Postgres 的 LISTEN/NOTIFY 实现任务队列服务

https://chatgpt.com/share/685527b8-724c-8010-9e5a-1aac521a7acc

## 表结构

`init.sql`

```sql
CREATE TABLE tasks (
  "id" SERIAL PRIMARY KEY,
  "type" TEXT NOT NULL,
  "payload" JSONB,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processed_at" TIMESTAMPTZ(3)
);
```

## Job Queue 基本操作

### 添加任务并广播通知

```sql
INSERT INTO tasks (type, payload) VALUES ('send_email', '{"to": "test@example.com"}');

NOTIFY task_queue, 'new_task';
```

### 监听任务消息并拉取任务

监听任务消息

```ts
await jobListener.query('LISTEN task_queue');

jobListener.on('notification', async (msg) => {
  if (msg.channel === 'task_queue') {
    // 在这里拉取任务
  }
});
```

拉取任务 SQL

```sql
UPDATE tasks
SET status = 'processing', processed_at = NOW(), updated_at = NOW()
WHERE id = (
  SELECT id FROM tasks WHERE status = 'pending'
  ORDER BY created_at ASC LIMIT 1
  FOR UPDATE SKIP LOCKED
)
RETURNING *;
```

## 可运行的代码

先启动一个 Postgres 测试服务

```bash
docker run --name pg-container-job-queue-demo \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=test123123 \
  -e POSTGRES_DB=mydb \
  -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -p 5432:5432 \
  -d postgres:16
```

启动 `demo.ts` 代码，每 5 秒触发一个任务，并打印结果

```bash
node demo.ts
```

## 完整代码

请移步 https://github.com/fengmk2/fengmk2.github.com/tree/master/blog/2025/job-queue-on-postgres

## 有爱

希望本文对你有用 ^_^
