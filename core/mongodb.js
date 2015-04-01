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

};

/**
 * Init Database Settings
 */
Database.prototype.init = function(){
    var mongodb_connect_url = lizard.get('mongodb connect url');
    var splited = mongodb_connect_url.split("/");

    if(mongodb_connect_url !== "" && splited instanceof Array && splited.length > 3){
        if(splited[3] === ""){
            mongodb_connect_url += lizard.get('name');
        }
    } else if(mongodb_connect_url !== "" && splited instanceof Array && splited.length == 3){
        mongodb_connect_url += "/"+lizard.get('name');
    }

    this.mongodb_url = mongodb_connect_url || process.env.MONGODB_DB_URL || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || process.env.OPENSHIFT_MONGODB_DB_URL;

    if(this.mongodb_url === undefined || this.mongodb_url === ""){
        throw new lizard.Errors.DBError('MongoDB не сконфигурирована', 1);
    }
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