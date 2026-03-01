/**!
 * sequelize-hello - sequelize.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var co = require('co');
var path = require('path');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('demo', '', '', {
  // sync database before app start, defaul is false
  syncFirst: false,
  // the sql dialect of the database
  // - currently supported: 'mysql', 'sqlite', 'postgres', 'mariadb'
  dialect: 'sqlite',
  // the storage engine for 'sqlite'
  storage: path.join(__dirname, 'database.sqlite'),
  // logging: false,
});

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

co(function* () {
  yield sequelize.sync({ force: true });

  var user = yield User.build({
    name: 'fengmk2',
    ip: '127.0.0.1'
  }).save();
  console.log(user.toJSON());
  yield User.build({
    name: 'fengmk2-suqian.yf',
    ip: '127.0.1.1'
  }).save();
  yield User.build({
    name: 'yubo',
    ip: '127.0.0.1'
  }).save();

  var users = yield User.findAll();
  console.log(users.map(function (user) {
    return user.toJSON();
  }));

  var oneUser = yield User.find(1);
  console.log(oneUser.toJSON());

  var user = yield User.find({
    where: {
      name: 'fengmk2'
    }
  });
  console.log(user.toJSON());

  var user = yield User.find({
    attributes: ['name', 'ip'],
    where: {
      name: 'fengmk2'
    }
  });
  console.log(user.toJSON());

  var users = yield User.findAll({
    where: {
      name: {
        ne: 'fengmk2'
      }
    }
  });
  console.log(users.map(function (user) {
    return user.toJSON();
  }));

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
  console.log(users.map(function (user) {
    return user.toJSON();
  }));

  var users = yield User.findAll({
    where: {
      name: {
        like: 'feng%'
      }
    }
  });
  console.log(users.map(function (user) {
    return user.toJSON();
  }));

  var users = yield User.findAll({
    where: {
      name: {
        like: '%mk%'
      }
    },
    order: [ [ 'id', 'desc' ] ]
  });
  console.log(users.map(function (user) {
    return user.toJSON();
  }));

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
  console.log(users.map(function (user) {
    return user.toJSON();
  }));

  var count = yield User.count();
  console.log(count);

  var count = yield User.count({
    where: {
      name: {
        like: '%y%'
      }
    }
  });
  console.log(count);

  // var count = yield User.count({
  //   distinct: {
  //     field: 'ip'
  //   },
  //   distinctField: 'ip',
  // });
  // console.log(count);

  var user = yield User.find(1);
  user.ip = '10.0.0.1';
  user.isNpmUser = false;
  yield user.save(['ip', 'isNpmUser']);

  var user = yield User.find(2);
  user.isNpmUser = true;
  yield user.save(['isNpmUser']);

  yield User.destroy({
    where: {
      id: 1
    }
  });
  console.log((yield User.count()));
  var user = yield User.find(2);
  yield user.destroy();
  console.log((yield User.count()));

  yield User.destroy();
  console.log((yield User.count()));
})(function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
});
