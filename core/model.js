/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine');

var Model = function(name){
    this.schema = null;
    this.schema_config = {};
    this.model = null;
    this.name = name;
};

Model.prototype.add = function(config)
{
    this.schema_config = config;
}

Model.prototype.register = function()
{
    this.schema = new lizard.mongoose.Schema(this.schema_config);
    this.model = lizard.mongoose.model(this.name, this.schema);

    lizard.models[this.name] = this.model;
};

module.exports = Model;