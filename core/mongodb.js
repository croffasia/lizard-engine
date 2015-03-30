/**
 * Created by andriipoluosmak on 26.02.15.
 */
var lizard = require('lizard-engine'),
    connection = require('mongodb').MongoClient;

/**
 * MongoDB Database
 * @constructor
 */

var Database = function()
{
    var user = lizard.get('mongodb user');
    var password = lizard.get('mongodb password');

    var credentials = "";
    if(user && password) credentials += user+":"+password+"@";

    this.mongodb_url = "mongodb://"+credentials+""+lizard.get('mongodb host')+":"+lizard.get('mongodb port')+"/"+lizard.get('mongodb db');
};

/**
 * Base Model
 */
Database.prototype.Model = require('./base_model');

/**
 * Connect to Database and run query
 * @param collection_name Collection name
 * @param cb
 */
Database.prototype.collection = function(collection_name, cb)
{
    connection.connect(this.mongodb_url, function(err, db)
    {
        if(err && cb != undefined)
        {
            db.close();
            return cb(err);
        }

        var collection = db.collection(collection_name);

        if(cb != undefined)
        {
            cb(err, collection, function()
            {
                db.close();
            });
        } else {
            db.close();
        }
    });
};

module.exports = new Database();