/**
 * Created by andriipoluosmak on 26.02.15.
 */
var lizard = require('lizard-engine');

var MongoDB = function(){};

MongoDB.prototype.connect = function(){

    var user = lizard.get('mongodb user');
    var password = lizard.get('mongodb password');

    var credentials = "";
    if(user && password) credentials += user+":"+password+"@";

    lizard.mongoose.connect("mongodb://"+credentials+""+lizard.get('mongodb host')+":"+lizard.get('mongodb port')+"/"+lizard.get('mongodb db'));
};

module.exports = new MongoDB();