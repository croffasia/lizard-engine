/**
 * Created by andriipoluosmak on 28.03.15.
 */

var lizard = require('lizard-engine'),
    BaseModel = lizard.Database.Model,
    util = require("util");

var Model = function(){

    BaseModel.apply(this);

    this.collection = "_test_collection";

    this.columns = {_id: null,
        title: { format: this.FormatTitle }
    };
};

util.inherits(Model, BaseModel);

Model.prototype.FormatTitle = function(value){
    return "["+value+"]";
};

module.exports = Model;