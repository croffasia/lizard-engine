/**
 * Created by andriipoluosmak on 25.02.15.
 */

var BaseOptions = function(){
	this._options = {};
};

BaseOptions.prototype.set = function(key, value){
	if (arguments.length === 1) {
		return this._options[key];
	}

	this._options[key] = value;
};

BaseOptions.prototype.parseOptions = function(options)
{
    if(options != undefined)
    {
        for(var key in options)
        {
            this.set(key, options[key]);
        }
    }
};

BaseOptions.prototype.get = BaseOptions.prototype.set;

module.exports = BaseOptions;
