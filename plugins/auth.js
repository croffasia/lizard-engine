/**
 * Created by andriipoluosmak on 26.02.15.
 */

var lizard = require('lizard-engine'),
    crypt = require('crypto-js'),
    _ = require('underscore');

module.exports.save = function(req, user)
{
    //console.log("SAVE = "+crypt.SHA224(user._id+"|"+user.email+"|"+lizard.get('cookies secret')));
    var auth = {};
    //auth.hash = crypt.MD5(user._id+"|"+user.email+"|"+lizard.get('cookies secret'));
    auth.user = {};
    auth.user.name = user.name;
    auth.user.email = user.email;
    auth.user.id   = user.id;

    req.session.auth = auth;
    req.session.auth.hash = crypt.SHA224(user._id+"|"+user.email+"|"+lizard.get('cookies secret'));

    //__INSPECT(req.session, "save: ");
};

module.exports.check = function(req, res)
{
    //__INSPECT(req.session, "check: ");

    if(_.has(req.session, 'auth') && _.has(req.session.auth, 'user'))
    {
        //SHA224
        var hash = req.session.auth.hash;
        var wordArray = crypt.lib.WordArray.create(hash.words, hash.sigBytes);

        var string = crypt.enc.Base64.stringify(wordArray);
        var originaldata = crypt.enc.Base64.parse(string);
        var sessionHash = originaldata.toString();

        var realHash = crypt.SHA224(req.session.auth.user.id+"|"+req.session.auth.user.email+"|"+lizard.get('cookies secret'));
        if(realHash == sessionHash)
        {
            return true;
        }
    }

    return false;
};

module.exports.logout = function(req)
{
    req.session.auth = null;
};

module.exports.get = function(req, cb)
{
    if(_.has(req.session, 'auth') && _.has(req.session.auth, 'user')){
        cb(req.session.auth.user);
    } else {
        cb(null);
    }
};