/**
 * Created by andriipoluosmak on 26.02.15.
 */
var lizard = require('lizard-engine'),
    mongo = require('mongodb'),
    connection = mongo.MongoClient;

/**
 * MongoDB Database
 * @constructor
 */

var Database = function()
{
    this.initTypes();

    this.conn = null;
};

/**
 * Database Field types
 */
Database.prototype.initTypes = function(){

    this.Types = {};
    this.Types.String  = "string";
    this.Types.Number  = "number";
    this.Types.Integer = "integer";
    this.Types.Array   = "array";
    this.Types.Boolean = "boolean";
    this.Types.Object  = "object";
    this.Types.Any     = "any";

    this.ObjectID = mongo.ObjectID;

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

    this.connect();
};

/**
 * Base Model
 */
Database.prototype.Model = require('./base_model');

/**
 * Connect to DB
 */
Database.prototype.connect = function(){
    if(this.conn === null)
    {
        var context = this;
        connection.connect(this.mongodb_url, function(err, db){

            if(err == null){
                context.conn = db;
            } else {
                context.conn = null;
            }
        });
    }
};

/**
 * Return current connection
 */

Database.prototype.getConnection = function(){
    return this.conn;
};

/**
 * Disconnect
 */
Database.prototype.disconnect = function(){
    if(this.conn !== null)
    {
        this.conn.close();
    }
};

module.exports = new Database();