var mongo = require('mongoskin');

var db = mongo.db('127.0.0.1:27017/test');

// create index: 
// key, unique, callback
db.collection('user').ensureIndex([['name', 1]], true, function(err, replies){});

// bind method: db.user ===> db.collection('user')
db.bind('user');

// insert, update, remove
var username = 'user_' + new Date().getTime();
var user = {name: username, age: 18, tweet: 'hello world, I am ' + username, created_at: new Date()};
db.user.insert(user, function(err) {
    if(err) {
        return console.log('inser error', err);
    }
    console.log('inserted, user: ', user);
    db.user.update({_id: user._id}, {$set: {tweet: 'haha update', updated_at: new Date()}}, function(err) {
        if(err) {
            return console.log('update error', err);
        }
        db.user.findOne({_id: user._id}, function(err, updated_user) {
            if(err) {
                return console.log('findOne error:', err);
            }
            console.log('updated user:', updated_user);
            db.user.remove({_id: user._id}, function(err) {
                if(err) {
                    return console.log('remove error:', err);
                }
                db.user.findOne({_id: user._id}, function(err, remove_user) {
                    if(err) {
                        return console.log('findOne error:', err);
                    }
                    console.log('remove user:', remove_user);
                });
            });
        });
    });
});

function newUser(i, callback) {
    var username = 'user_' + i;
    var user = {name: username, age: 18, tweet: 'hello world, I am ' + username, created_at: new Date()};
    db.user.insert(user, function(err) {
        callback();
    });
};

function createUsers(count, callback) {
    var done = 0;
    var fn = function() {
        if(++done >= count) {
            callback();
        } else {
            newUser(done, fn);
        }
    };
    newUser(done, fn);
}

createUsers(45, function() {
    // query: find all user, sort by name desc, limit 20, 10
    db.user.find().sort({name: -1}).skip(20).limit(10).toArray(function(err, users) {
        console.log(err, users);
    });
});

