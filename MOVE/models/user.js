/*!
 * MOVE - models/user.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

function User(email) {
  this.email = email;
}

User.prototype.checkPassword = function (password, callback) {
  // body...
};