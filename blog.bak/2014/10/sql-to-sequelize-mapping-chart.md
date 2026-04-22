# SQL to Sequelize Mapping Chart

I like [SQL to MongoDB Mapping Chart](http://docs.mongodb.org/manual/reference/sql-comparison/) post,
so I create the same chart between SQL and [Sequelize].

All demo runable codes at [sequelize.js].

## Create Table

### SQL: `CREATE TABLE`

```sql
CREATE TABLE IF NOT EXISTS `user` (
 `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'primary key',
 `gmt_create` datetime NOT NULL COMMENT 'create time',
 `gmt_modified` datetime NOT NULL COMMENT 'modified time',
 `name` varchar(100) NOT NULL COMMENT 'user name',
 `ip` varchar(64) NOT NULL COMMENT 'user last request ip',
 `npm_user` tinyint(1) DEFAULT '0' COMMENT 'user sync from npm or not, 1: true, other: false',
 PRIMARY KEY (`id`),
 UNIQUE KEY `name` (`name`),
 KEY `gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='user base info';
```

### Sequelize: `sequelize.define()`

```js
var User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    comment: 'user name',
  },
  ip: {
    type: Sequelize.STRING(64),
    allowNull: false,
    comment: 'user last request ip',
  },
  isNpmUser: {
    field: 'npm_user',
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'user sync from npm or not, 1: true, other: false',
  }
}, {
  tableName: 'user',
  comment: 'user base info',
  indexes: [
    {
      unique: true,
      fields: ['name']
    },
    {
      fields: ['gmt_modified']
    }
  ],
  createdAt: 'gmt_create',
  updatedAt: 'gmt_modified',
  charset: 'utf8',
  collate: 'utf8_general_ci',
});
```

## Insert

### SQL: `INSERT INTO`

```sql
INSERT INTO user(name, ip, gmt_create, gmt_modified)
  VALUES ("fengmk2", "127.0.0.1", now(), now());
```

### Sequelize: `sequelize.build()` and `sequelize.save()`

```js
var user = yield User.build({
  name: 'fengmk2',
  ip: '127.0.0.1'
}).save();
```

## Select

```js
User.findAll({
  where: {
    id: {
      gt: 6,              // id > 6
      gte: 6,             // id >= 6
      lt: 10,             // id < 10
      lte: 10,            // id <= 10
      ne: 20,             // id != 20
      between: [6, 10],   // BETWEEN 6 AND 10
      nbetween: [11, 15]  // NOT BETWEEN 11 AND 15
    }
  }
})
```

### Select all

* SQL

```sql
SELECT * FROM user;
```

* Sequelize

```js
var users = yield User.findAll();
```

### Select one row with all columns by primary `id` key

* SQL

```sql
SELECT * FROM user WHERE id = 1;
```

* Sequelize

```js
var oneUser = yield User.find(1);
```

### Select one row with all columns by `name` index

* SQL

```sql
SELECT * FROM user WHERE name = "fengmk2" LIMIT 1;
```

* Sequelize

```js
var user = yield User.find({
  where: {
    name: 'fengmk2'
  }
});
```

### Select one row with some columns by `name` index

* SQL

```sql
SELECT name, ip FROM user WHERE name = "fengmk2";
```

* Sequelize

```js
var user = yield User.find({
  attributes: ['name', 'ip'],
  where: {
    name: 'fengmk2'
  }
});
```

### Select rows where `name` not equal 'fengmk2'

* SQL

```sql
SELECT * FROM user WHERE name != "fengmk2";
```

* Sequelize

```js
var users = yield User.findAll({
  where: {
    name: {
      ne: 'fengmk2'
    }
  }
});
```

### Select rows where `name` not equal 'fengmk2' and `id` bigger than 100

* SQL

```sql
SELECT * FROM user WHERE name != "fengmk2" AND id > 2;
```

* Sequelize

```js
var users = yield User.findAll({
  where: {
    name: {
      ne: 'fengmk2'
    },
    id: {
      gt: 2
    }
  }
});
```

### Select rows where `name` equal 'fengmk2' or 'yubo'

* SQL

```js
SELECT * FROM user WHERE name = "fengmk2" OR name = "yubo";
```

* Sequelize

```js
var users = yield User.findAll({
  where: Sequelize.or(
    {
      name: 'fengmk2'
    },
    {
      name: 'yubo'
    }
  )
});
```

### Select rows where `name` start with 'feng*'

* SQL

```sql
SELECT * FROM user WHERE name LIKE 'feng%';
```

* Sequelize

```js
var users = yield User.findAll({
  where: {
    name: {
      like: 'feng%'
    }
  }
});
```

### Select rows where `name` contains '*mk*' and order by id `desc`

* SQL

```sql
SELECT * FROM user WHERE name LIKE '%mk%' ORDER BY id DESC;
```

* Sequelize

```js
var users = yield User.findAll({
  where: {
    name: {
      like: '%mk%'
    }
  },
  order: [ [ 'id', 'desc' ] ]
});
```

### Select COUNT(*)

* SQL

```sql
SELECT COUNT(*) FROM user;
```

* Sequelize

```js
var count = yield User.count();
```

### Select rows count where name contains `%y%`

* SQL

```sql
SELECT COUNT(*) FROM user WHERE name LIKE '%y%';
```

* Sequelize

```js
var count = yield User.count({
  where: {
    name: {
      like: '%y%'
    }
  }
});
```

### Select distinct ip count

* SQL

```sql
SELECT COUNT(DISTINCT(ip)) FROM user;
```

* Sequelize

TODO

## Update

### SQL: `UPDATE SET`

```sql
UPDATE user SET ip = '10.0.0.1', npm_user = 0, gmt_modified = now() WHERE id = 1;
UPDATE user SET npm_user = 1, gmt_modified = now() WHERE id = 2;
```

### Sequelize: `find()` and `save([columns])`

```js
var user = yield User.find(1);
user.ip = '10.0.0.1';
user.isNpmUser = false;
yield user.save(['ip', 'isNpmUser']);

var user = yield User.find(2);
user.isNpmUser = true;
yield user.save(['isNpmUser']);
```

## Delete

### SQL: `DELETE FROM`

```sql
DELETE FROM user WHERE id = 1;
DELETE FROM user;
```

### Sequelize: `Model.destroy(where)`

```js
yield User.destroy({
  id: 1
});

yield User.destroy();
```

## Love 💗

Hold these can help you a litte bit on coding. :)

[Sequelize]: http://sequelizejs.com/
[sequelize.js]: https://github.com/fengmk2/fengmk2.github.com/blob/master/blog/2014/10/sequelize.js
