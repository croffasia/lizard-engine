/**
 * Created by andriipoluosmak on 17.03.15.
 */

var lizard = require('lizard-engine'),
    inherits = require('util').inherits,
    csv = require('csv'),
    lodash = require('lodash'),
    revalidator = require('revalidator');

var Model = function(){

    this.collection = "";
    this.schema = {};
    console.log("BASE MODEL");

};

Model.prototype.init = function(schema){

    if(schema !== undefined && typeof schema === "object"){
        this.schema = schema;
    }
};

/**
 * Query builder
 * @returns Collection cursor
 */

Model.prototype.build = function(){
    return lizard.Database.getConnection().collection(this.collection);
};

/**
 * Export to CSV
 *
 * @param where query
 * @param transform array map callback
 * @param to String (file name) or res.attachment(file_name)
 * @param options cvs options object
 */

Model.prototype.toCSV = function(where, transform, to, options){

    this.build().find(where, function(err, res){

        if(err !== null){
            return cb(err, null);
        }

        var documents = [];
        if(transform === undefined || transform === null){
            documents = res.map(transform);
        } else {
            documents = res;
        }

        csv().from(documents).to(to, options);
    });

};

/**
 * Formating document
 *
 * @param document
 * @returns {*}
 * @constructor
 */

Model.prototype.FormatDocument = function(document){

    var FormatColumn = function(column, value)
    {
        if(column !== null &&
            column.hasOwnProperty('format') &&
            typeof column.format === "function"){

            return column.format.call(null, value);
        }

        return value;
    };

    var newDocument = null;

    if(document !== undefined && document !== null)
    {
        if (this.columns !== null && this.columns !== undefined)
        {
            newDocument = lodash.clone(document);

            for (var column in this.columns)
            {
                if(this.columns.hasOwnProperty(column) && newDocument.hasOwnProperty(column)){
                    newDocument[column] = FormatColumn(this.columns[column], newDocument[column]);
                }
            }
        }
    }

    return (newDocument !== null)?newDocument:document;
};

/**
 * Validate part of schema
 *
 * @param field path to part. Example: key or root_key.child_key
 * @param value value for validate
 */

Model.prototype.validatePart = function(field, value){
    var explode = field.split(".");

    var find = lodash.clone(this.schema);
    var partSchema = { properties: {}};

    for(var i = 0; i < explode.length; i++)
    {
        if(find.hasOwnProperty(explode[i]) && i < explode.length - 1)
        {
            find[explode[i]] = find[explode[i]];
        } else if(find.hasOwnProperty(explode[i]) && i == explode.length - 1) {
            partSchema.properties[explode[i]] = find[explode[i]];
        }
    }

    return revalidator.validate(value, partSchema);
};

/**
 * Column validator before insert or update
 *
 * @param document Document object
 * @returns {*}
 */

Model.prototype.validate = function(document)
{
    return revalidator.validate(document, { properties: this.schema });
};

module.exports = Model;