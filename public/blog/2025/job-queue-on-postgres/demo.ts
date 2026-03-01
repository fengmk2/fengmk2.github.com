import { scheduler } from 'node:timers/promises';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL ?? 'postgresql://postgres:test123123@localhost:5432/mydb';
const client = new Client({
  connectionString,
});

await client.connect();

interface Task {
  id: number;
  type: string;
  payload: Record<string, any>;
  status: string;
  created_at: Date;
}

async function doSomething(task: Task) {
  console.log('Processing task: %j', task);
  await scheduler.wait(500);
  console.log('Finished task: %j', task);
}

async function getTask() {
  const res = await client.query(`
    UPDATE tasks
    SET status = 'processing', processed_at = NOW(), updated_at = NOW()
    WHERE id = (
      SELECT id FROM tasks WHERE status = 'pending'
      ORDER BY created_at ASC LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING *;
  `);
  if (res.rows.length > 0) {
    return res.rows[0] as Task;
  }
  return null;
}

async function finishTask(task: Task) {
  await client.query('UPDATE tasks SET status = $1 WHERE id = $2', ['done', task.id]);
}

let isRunning = false;
async function startTaskWorker() {
  if (isRunning) {
    return;
  }
  isRunning = true;

  while (true) {
    const task = await getTask();
    if (task) {
      await doSomething(task);
      await finishTask(task);
    } else {
      console.log('No task to process, worker exit');
      break;
    }
  }

  isRunning = false;
}

async function startTaskListener() {
  await client.query('LISTEN task_queue');

  client.on('notification', async (msg) => {
    if (msg.channel === 'task_queue') {
      startTaskWorker();
    }
  });

  startTaskWorker();
}

async function startTaskCreator() {
  await scheduler.wait(1000);

  for (let i = 0; i < 10000; i++) {
    const type = 'send_email';
    const payload = {
      to: `test${i}@example.com`,
      subject: `Test email ${i}`,
      body: `This is a test email ${i}`,
    };
    await client.query('INSERT INTO tasks (type, payload) VALUES ($1, $2)', [type, payload]);
    await client.query('NOTIFY task_queue, \'new_task\'');
    console.log(`Created task ${i}: %j`, payload);
    await scheduler.wait(1000);
  }
}

startTaskListener();
startTaskCreator();
