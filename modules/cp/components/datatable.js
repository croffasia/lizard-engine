/**
 * Created by andriipoluosmak on 27.02.15.
 */

var lizard = require('lizard-engine'),
    validator = require('validator'),
    _ = require('underscore');

module.exports = function(req, res, options, render){

    var view = new lizard.View(req, res, module.id);
    var locals = view.locals;
    locals.component_options = options;

    var UserModel = lizard.Modules.Model('user', 'user');

    view.on('post', {ajax: 1, action: 'user.signin'}, function(next){

        var email = "";
        var password = "";

        if(_.has(req.body, 'email') && validator.isEmail(req.body.email))
            email = req.body.email;

        if(_.has(req.body, 'password'))
            password = req.body.password;

        if(email != "" && password != ""){
            UserModel.model.Signin(email, password, function(err, results){
                console.log(err, results);
                res.json({err: err, res: results});
            });
        } else {
            res.json({error: "Need data"});
        }

        return;
    });

    view.render('components/signin_form.html', render);

};