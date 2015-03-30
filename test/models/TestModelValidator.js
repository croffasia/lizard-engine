/**
 * Created by andriipoluosmak on 28.03.15.
 */

var lizard = require('lizard-engine'),
    BaseModel = lizard.Database.Model,
    util = require("util");

var Model = function(){
    BaseModel.apply(this);

    this.collection = "_test_collection_validate";

    this.columns = {_id: null,
        email_string:   { validate: "isEmail" },
        not_email_string:   { validate: "!isEmail" },
        email_function: { validate: this.isEmail },
        email_array:    { validate: ["isEmail"] },
        not_email_array:    { validate: ["!isEmail"] },
        url_array_option: { validate: [{action: "isURL", options: [{protocols: ['https']}]}] },
        not_url_array_option: { validate: [{action: "!isURL", options: [{protocols: ['https']}]}] }
    };

};

util.inherits(Model, BaseModel);

Model.prototype.isEmail = function(value){

    return (value.indexOf("@") > -1)?true:false;

};

module.exports = Model;