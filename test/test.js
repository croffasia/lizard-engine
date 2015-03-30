var test_model = require('./models/TestModel'),
    test_model_v = require('./models/TestModelValidator'),
    should = require('should');

describe('Model Validator', function(){

    describe('#validateFields', function(){

        it('should validate object fields', function(done){

            var document = {};
            document.email_string = "email@dot.com";

            var m = new test_model_v();
            m.validateDocumentFields(document);

            if(document == null) return done({message: "null object"});

            should(document).have.property('email_string');
            should(document).not.have.property('noname_field');

            done();

        });

    });

    describe('#stringValidationMethod', function(){

        it('should validate by string', function(done){

            var document = {};
            document.email_string = "email@dot.com";

            var m = new test_model_v();
            var result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 0);
            should(result).have.property('success', 1);

            document = {};
            document.not_email_string = "email@dot.com";

            result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 1);
            should(result).have.property('success', 0);

            done();

        });

    });

    describe('#functionValidationMethod', function(){

        it('should validate by external function', function(done){

            var document = {};
            document.email_function = "email@dot.com";

            var m = new test_model_v();
            var result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 0);
            should(result).have.property('success', 1);

            document = {};
            document.email_function = "email.dot.com";

            result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 1);
            should(result).have.property('success', 0);

            done();

        });

    });

    describe('#stringInArrayValidationMethod', function(){

        it('should validate by string in array', function(done){

            var document = {};
            document.email_array = "email@dot.com";

            var m = new test_model_v();
            var result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 0);
            should(result).have.property('success', 1);

            document = {};
            document.not_email_array = "email@dot.com";

            result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 1);
            should(result).have.property('success', 0);

            done();
        });
    });

    describe('#stringInArrayActionValidationMethod', function(){

        it('should validate by action in array', function(done){

            var document = {};
            document.url_array_option = "https://google.com";

            var m = new test_model_v();
            var result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 0);
            should(result).have.property('success', 1);

            document = {};
            document.url_array_option = "http://google.com";

            result = {};
            result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 1);
            should(result).have.property('success', 0);

            document = {};
            document.not_url_array_option = "http://google.com";

            result = {};
            result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 0);
            should(result).have.property('success', 1);

            document = {};
            document.not_url_array_option = "https://google.com";

            result = {};
            result = m.validate(document);

            if(result == null) return done({message: "null object"});

            should(result).have.property('failed', 1);
            should(result).have.property('success', 0);

            done();
        });
    });

});

describe('Models', function(){

    describe('#format', function(){

        it('should format document fields', function(done){

            var document = {};
            document.title = "Test Title";

            var m = new test_model();
            var newDocument = m.FormatDocument(document);

            should(document).have.property('title', 'Test Title');
            should(newDocument).have.property('title', '[Test Title]');

            done();
        });
    });

    describe('#insert', function(){

        it('should insert 1 row', function(done){

            var document = {};
            document._id = "test";
            document.title = "Test Title";

            var m = new test_model();

            m.insert(document, function(err, res){
                if(err != null) return done(err);

                should(res).have.property('ok', 1);
                should(res).have.property('n', 1);

                done();
            });
        });
    });

    describe('#update', function(){

        it('should update', function(done){

            var where = {_id: "test" };
            var document = { title: "Updated title" };

            var m = new test_model();
            m.update(where, document, function(err, res){
                if(err != null) return done(err);

                should(res).have.property('ok', 1);
                should(res).have.property('n', 1);
                should(res).have.property('nModified', 1);

                done();
            });
        });
    });

    describe('#find', function(){

        it('should find all objects', function(done){

            var where = { };

            var m = new test_model();
            m.find(where, function(err, res){

                if(err != null) return done(err);

                should(res).be.instanceof(Array).with.lengthOf(1);
                should(res[0]).have.property('_id', 'test');

                done();
            });
        });

    });

    describe('#findOne', function(){

        it('should find one object', function(done){

            var where = { _id: "test" };

            var m = new test_model();
            m.findOne(where, function(err, res){

                if(err != null) return done(err);

                should(res).be.instanceof(Object).and.have.property('_id', 'test');

                done();
            });
        });

    });

    describe('#remove', function(){

        it('should remove without error', function(done){

            var where = {_id: "test" };

            var m = new test_model();
            m.remove(where, function(err, res){
                if(err != null) return done(err);

                should(res).have.property('ok', 1);
                should(res).have.property('n', 1);

                done();
            });
        });
    });

    describe('#cursor', function(){

        it('should returned mongodb cursor', function(done){

            var m = new test_model();
            m.cursor(function(err, res){

                if(err != null) return done(err);

                should(res).be.instanceof(Object).and.have.property('s');
                should(res['s']).be.instanceof(Object).and.have.property('name', '_test_collection');

                done();
            });
        });

    });

    describe('#clear', function(){

        it('should clear all data', function(done){

            var m = new test_model();
            m.clear(function(err, res){

                if(err != null) return done(err);

                should(res).be.instanceOf(Object).and.have.property('ok', 1);
                should(res).be.instanceOf(Object).have.property('n', 0);

                done();
            });
        });

    });

});