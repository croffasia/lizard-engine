/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    crypt = require('crypto-js'),
    validator = require('validator');

var Password = function(schema, options, key){

    this.schema = schema;
    this.options = options;
    this.key = key;

    if(this.options.algoritm == undefined) this.options.algoritm = 'SHA224';
    if(this.options.min == undefined) this.options.min = 5;

    this.schema_item = {};
    this.schema_item[key] = { type: String, required: true  };

    this.validate();
    this.setter();
    this.methods();
    this.build();
};

Password.prototype.setter = function(){
    var context = this;
    var Setter = function(val){

        var encoded = val;

        if(crypt[context.options.algoritm] != undefined)
            var encoded = crypt[context.options.algoritm].call(null, val);

        return encoded;
    };

    this.schema_item[this.key].set = Setter;
};

Password.prototype.validate = function(){
    var context = this;
    var validatorLength = function(val){
        return validator.isLength(val, context.options.min)
    };

    this.schema_item[this.key].validate = [validatorLength, 'Message'];
};

Password.prototype.methods = function(){
    var context = this;
    this.schema.method('reset', function(needUpdate, cb){
        var newPassword = randomString(5);
        if(needUpdate == true){
            this.set(context.key, newPassword);
            this.save(function(err){
                cb(newPassword);
            });
        } else { cb(newPassword); }
    });

    this.schema.static('encodePassword', function(val){
        var encoded = val;
        if(crypt[context.options.algoritm] != undefined)
            encoded = crypt[context.options.algoritm].call(null, val);

        return encoded;
    });
};

Password.prototype.build = function(){
    this.schema.add(this.schema_item);
};

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

module.exports = Password;