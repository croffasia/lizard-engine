/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine');
var SchemaTypes = lizard.Database.mongoose.SchemaTypes;

function Url(path, options)
{
    SchemaTypes.String.call(this, path, options);

    function validateUrl (val) {
        var urlRegexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return urlRegexp.test(val);
    }

    this.validate(validateUrl, 'Url is invalid');
}

Url.prototype.__proto__ = SchemaTypes.String.prototype;
Url.prototype.cast = function (val) {
    return module.exports.normalizeUrl(val);
};

SchemaTypes.Url = Url;
lizard.Database.mongoose.Types.Url = String;