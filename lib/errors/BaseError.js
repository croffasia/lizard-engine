/**
 * Created by andriipoluosmak on 29.03.15.
 */

var assert = require('assert'),
    util = require('util'),
    lizard = require('lizard-engine');

function colorize (str, color) {
    var options = {
        red:      '\u001b[31m'
        , green:    '\u001b[32m'
        , yellow:   '\u001b[33m'
        , blue:     '\u001b[34m'
        , magenta:  '\u001b[35m'
        , cyan:     '\u001b[36m'
        , gray:     '\u001b[90m'
        , reset:    '\u001b[0m'
    };
    return options[color] + str + options.reset;
};

function pad (str, width) {
    return Array(width - str.length).join(' ') + str;
};

var BaseError = function(message){

    Error.call(this);

    this.message = message;
    this.name    = "BaseError";
    this.code    = 1;
    this.memory  = process.memoryUsage();

    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    Error.captureStackTrace(this, arguments.callee);

    this.__stack = this.stack;
    Error.prepareStackTrace = orig;

    // Lets make our JSON object.
    this._stack = [];
    for (var i = 1; i < this.__stack.length; i ++) {
        var frame = this.__stack[i];
        //console.log(frame.getFileName());
        this._stack.push({
            filename: frame.getFileName().replace(lizard.get('project dir'), '')
            , typename: frame.getTypeName()
            , linenum: frame.getLineNumber()
            , funcname: frame.getFunctionName()
            , method: frame.getMethodName()
        });
    }

    // Since we provided our own prepareStackTrace, we need
    // to provide a new stack getter for display. Lets make
    // it look better while we are at it.
    Object.defineProperty(this, 'stack', {
        get: function () {
            var buf = [];

            buf.push('');
            buf.push(pad('', 8) + colorize(this.name, 'red'));
            buf.push(pad('', 8) + colorize(Array(this.name.length + 1).join('-'), 'gray'));
            buf.push(pad('', 8) + colorize(this.message, 'magenta'));
            buf.push(pad('', 8) + colorize((this.memory.heapTotal / 1048576).toFixed(3) + ' MB', 'blue') + colorize(' total ', 'gray'));
            buf.push(pad('', 8) + colorize((this.memory.heapUsed / 1048576).toFixed(3) + ' MB', 'blue') + colorize(' used  ', 'gray'));
            buf.push(pad('', 8) + colorize(Array(this.name.length + 1).join('-'), 'gray'));
            buf.push('');

            this._stack.forEach(function (frame) {
                buf.push('  ' + colorize(pad(frame.linenum + '', 5), 'blue') + colorize(' ' + frame.filename, 'gray') );
                buf.push(pad('', 8) + colorize((frame.funcname ? frame.funcname : 'Anonymous'), 'green') + ' ' + colorize('[' + frame.typename + ']', 'yellow'));
            });

            buf.push('');
            return buf.join('\n');
        }
    });
};

util.inherits(BaseError, Error);

BaseError.prototype.toJSON = function () {
    return {
        name: this.name
        , message: this.message
        , memory: this.memory
        , stack: this._stack
        , code: this.code
    };
}

module.exports = BaseError;
