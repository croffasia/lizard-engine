/**
 * Created by andriipoluosmak on 26.02.15.
 */
var lizard = require('lizard-engine');

var Database = function(){
    this.mongoose = require('mongoose');
    this.connection = null;
};

Database.prototype.connect = function(){

    var user = lizard.get('mongodb user');
    var password = lizard.get('mongodb password');

    var credentials = "";
    if(user && password) credentials += user+":"+password+"@";

    this.connection = this.mongoose.connect("mongodb://"+credentials+""+lizard.get('mongodb host')+":"+lizard.get('mongodb port')+"/"+lizard.get('mongodb db'));
};

module.exports = new Database();