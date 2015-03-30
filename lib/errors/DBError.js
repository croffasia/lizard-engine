/**
 * Created by andriipoluosmak on 29.03.15.
 */

var BaseError = require('./BaseError'),
    util = require('util');

var DBError = function(message, code){

    BaseError.call(this, message);

    this.name    = 'Database Error';
    this.code    = code;
};

util.inherits(DBError, BaseError);

module.exports = DBError;
