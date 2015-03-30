/**
 * Created by andriipoluosmak on 17.03.15.
 */

var lizard = require('lizard-engine'),
    validator = require('validator'),
    inherits = require('util').inherits,
    _ = require('underscore');

var Model = function(){

    this.collection = "";
    this.columns = {"_id": null };

};

/**
 * Clear all collection
 * @param cb
 */
Model.prototype.clear = function(cb){

    lizard.Database.collection(this.collection, function(err, col, md_cb){

        if(err){
            if(cb != undefined) cb(err);
            md_cb();
            return;
        }

        col.remove({}, function (query_err, query_res) {
            md_cb();

            var res = {};

            if(query_res != null && _.has(query_res, 'result')){
                res = _.clone(query_res.result);
            }

            if (cb != undefined) cb(query_err, res);
        });
    });
};

/**
 * Insert new document
 *
 * @param document Document object
 * @param cb callback
 */

Model.prototype.insert = function(document, cb)
{
    if(document == undefined){
        if(cb != undefined) cb({message: "Document is Empty"});
        return;
    }

    document = this.validateDocumentFields(document);
    var validate = this.validate(document);

    if(validate.failed == 0){
        lizard.Database.collection(this.collection, function(err, col, md_cb){

            if(err){
                if(cb != undefined) cb(err);
                md_cb();
                return;
            }

            col.insert(document, function(query_err, query_res){
                md_cb();

                if(cb != undefined) cb(query_err, query_res.result);
            });
        });
    } else {
        if(cb != undefined) cb(validate);
    }
};

/**
 * Update document
 *
 * @param where condition
 * @param document updated fields
 * @param cb callback
 */
Model.prototype.update = function(where, document, cb){

    if(document == undefined){
        if(cb != undefined) cb({message: "Document is Empty"});
        return;
    }

    document = this.validateDocumentFields(document);
    var validate = this.validate(document);

    if(validate.failed == 0)
    {
        lizard.Database.collection(this.collection, function(err, col, md_cb){

            if(err){
                if(cb != undefined) cb(err);
                md_cb();
                return;
            }

            col.update(where, { $set: document }, function(query_err, query_res){
                md_cb();

                if (cb != undefined) cb(query_err, query_res.result);
            });
        });
    } else {
        if(cb != undefined) cb(validate);
    }
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
        if(column != null &&
            _.has(column, 'format') &&
            typeof column.format === "function"){

            return column.format.call(null, value);
        }

        return value;
    };

    var newDocument = null;

    if(document != undefined && document != null)
    {
        if (this.columns != null && this.columns != undefined)
        {
            newDocument = _.clone(document);

            for (var column in this.columns)
            {
                newDocument[column] = FormatColumn(this.columns[column], newDocument[column]);
            }
        }
    }

    return (newDocument != null)?newDocument:document;
};

/**
 * Remove document
 *
 * @param where condition
 * @param cb callback
 */

Model.prototype.remove = function(where, cb)
{
    if(where == undefined){
        if(cb != undefined) cb({message: "Condition is Empty"});
        return;
    }

    lizard.Database.collection(this.collection, function(err, col, md_cb){

        if(err){
            if(cb != undefined) cb(err);
            md_cb();
            return;
        }

        col.remove(where, function (query_err, query_res) {
            md_cb();

            if (cb != undefined) cb(query_err, query_res.result);
        });
    });
};

Model.prototype.find = function(where, cb){

    lizard.Database.collection(this.collection, function(err, col, md_cb){

        if(err){
            if(cb != undefined) cb(err);
            md_cb();
            return;
        }

        col.find(where).toArray(function(query_err, query_res){
            md_cb();
            if (cb != undefined) cb(query_err, query_res);
        });
    });

};

Model.prototype.findOne = function(where, cb){

    var context = this;

    lizard.Database.collection(this.collection, function(err, col, md_cb){

        if(err){
            if(cb != undefined) cb(err);
            md_cb();
            return;
        }

        col.findOne(where, function (query_err, query_res) {
            md_cb();
            if (cb != undefined) cb(query_err, query_res);
        });
    });
};

/**
 * Return database collection cursor
 * @param cb
 */
Model.prototype.cursor = function(cb){
    lizard.Database.collection(this.collection, function(err, col, md_cb){

        if(err != null){
            if(cb != undefined) cb(err);
            md_cb();
            return;
        }

        cb(err, col, md_cb);
    });
};

/**
 * Validate document fields name
 * @param document
 */
Model.prototype.validateDocumentFields = function(document){
    for(var key in document){
        if(!_.has(this.columns, key))
            delete document[key];
    }

    return document;
};

/**
 * Column validator before insert or update
 *
 * @param document Document object
 * @param isObjectResult boolean
 * @returns {*}
 */

Model.prototype.validate = function(document, isObjectResult)
{
    if(document != undefined && document != null){

        if (isObjectResult == undefined) isObjectResult = true;

        var validate_result = { failed: 0, success: 0, fields: {} };

        for (var key in document) validate_result[key] = true;

        /**
         * Validator from library
         * @param command
         * @param column
         */
        var CheckByString = function(command){

            var args = [];

            if(arguments.length > 1 && typeof arguments[1] === "string")
                args.push(document[arguments[1]]);
            else
                args = arguments[1];

            var validator_action = "",
                validate_column_result = true;

            if(command.indexOf("!") > -1)
            {
                validator_action = command.split("!")[1];

                if(validator.hasOwnProperty(validator_action))
                {
                    validate_column_result = !validator[validator_action]
                        .apply(validator, args);
                }
            } else if(validator.hasOwnProperty(command)) {

                validate_column_result = validator[command]
                    .apply(validator, args);
            }

            return validate_column_result;
        };

        /**
         * External function validator
         * @param func
         * @param args
         */
        var CheckByFunction = function(func){

            var args = [];

            if(arguments.length > 1 && typeof arguments[1] === "string")
                args = [document[arguments[1]]];
            else
                args = arguments[1];

            if(func == undefined || func == null) return false;

            return func.apply(validator, args);
        };

        var UpdateValidateObject = function(column, result){
            validate_result.fields[column] = result;
            if(result) validate_result.success++;
            else validate_result.failed++;
        };

        if( this.columns != null && this.columns != undefined)
        {
            var validate_column_result = true;

            for (var column in this.columns)
            {
                if (document.hasOwnProperty(column) && this.columns[column] != null
                    && this.columns[column].hasOwnProperty("validate")) {

                    if (this.columns[column].validate instanceof Array)
                    {
                        for (var i = 0; i < this.columns[column].validate.length; i++)
                        {
                            // Simple validator

                            if(typeof this.columns[column].validate[i] === "string")
                            {
                                validate_column_result = CheckByString(this.columns[column].validate[i],
                                                                       column);

                                if(isObjectResult)
                                    UpdateValidateObject(column, validate_column_result);
                                else if (!isObjectResult && !validate_column_result)
                                    return false;

                            // Validator with options

                            } else if (this.columns[column].validate[i] instanceof Object &&
                                this.columns[column].validate[i].hasOwnProperty("action")){

                                var validate_options = [];

                                if(this.columns[column].validate[i].hasOwnProperty("options") &&
                                   this.columns[column].validate[i].options instanceof Array){
                                    validate_options = this.columns[column].validate[i].options;
                                }

                                var args = [document[column]].concat(validate_options);

                                // Use external validator

                                if(typeof this.columns[column].validate[i].action === "function")
                                {
                                    validate_column_result = CheckByFunction(this.columns[column].validate[i].action,
                                                                             args);

                                    if(isObjectResult)
                                        UpdateValidateObject(column, validate_column_result);
                                    else if (!isObjectResult && !validate_column_result)
                                        return false;

                                // Use default validator

                                } else if(typeof this.columns[column].validate[i].action === "string") {

                                    validate_column_result = CheckByString(this.columns[column].validate[i].action,
                                        args);

                                    if(isObjectResult)
                                        UpdateValidateObject(column, validate_column_result);
                                    else if (!isObjectResult && !validate_column_result)
                                        return false;
                                }
                            }
                        }
                    } else if(typeof this.columns[column].validate === "function") {

                        validate_column_result = CheckByFunction(this.columns[column].validate, column);

                        if(isObjectResult)
                            UpdateValidateObject(column, validate_column_result);
                        else if (!isObjectResult && !validate_column_result)
                            return false;

                    } else if(typeof this.columns[column].validate === "string") {

                        validate_column_result = CheckByString(this.columns[column].validate,
                                                               column);

                        if(isObjectResult)
                            UpdateValidateObject(column, validate_column_result);
                        else if (!isObjectResult && !validate_column_result)
                            return false;
                    }
                }
            }
        }

        return validate_result;
    }

    return false;
};

module.exports = Model;