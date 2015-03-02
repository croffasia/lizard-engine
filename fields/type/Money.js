/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    numeral = require('numeral'),
    validator = require('validator');

var Money = function(schema, options, key){

    this.schema = schema;
    this.options = options;
    this.key = key;

    if(this.options.format == undefined) this.options.format = '0,0';

    this.schema_item = {};
    this.schema_item[key] = { type: lizard.Database.mongoose.Schema.Types.Number };

    this.validate();
    this.methods();
    this.build();
};

Money.prototype.validate = function(){
    var context = this;
    var validatorLength = function(val){
        return validator.isNumeric(val.length);
    };

    this.schema_item[this.key].validate = [validatorLength, 'Message'];
};

Money.prototype.methods = function(){
    var context = this;
    this.schema.virtual('numeral').get(function(){
        return numeral(this[this.key]);
    });
};

Money.prototype.build = function(){
    this.schema.add(this.schema_item);
};

module.exports = Money;