/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine');

module.exports = function(req, res){

    lizard.Plugins.Run(this, 'auth.logout', req);
    res.redirect('/cp/login');

};