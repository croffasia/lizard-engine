/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    numeral = require('numeral'),
    validator = require('validator');

var Mixed = function(schema, options, key){

    this.schema = schema;
    this.options = options;
    this.key = key;

    this.schema_item = {};
    this.schema_item[key] = { };

    this.build();
};

Mixed.prototype.build = function(){
    this.schema.add(this.schema_item);
};

module.exports = Mixed;