(function (w, d) {

    "use strict";

    var Namespace = "Scenario",

        TestEngine = TestEngine || function (testName) {

            var 
            cache = {
                ranTests: {}
            },
            tests = {},
            utils = {
                track: function(name, props){
                    if( typeof props !== "undefined" ){
                        mixpanel.track( name, props );
                    } else {
                        mixpanel.track( name );
                    }
                },
                toSlug: function (v) {
                    return v.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                }
            },
            Public = {
                test: function (name, fn) {
                    tests[testName].push({
                        name: name,
                        fn: fn
                    });
                    return this;
                },
                go: function() {
                    
                    utils.track(testName+' Load');
                    
                    var test = tests[testName][Math.floor(Math.random() * tests[testName].length)],
                        slug = utils.toSlug(test.name);

                    d.body.className += " "+slug;

                    cache.ranTests[testName] = test.name;
                    
                    utils.track(testName, {
                        variant: test.name
                    });
                    
                    if (typeof test.fn === "function") {
                        test.fn.call(null, {
                            name: test.name,
                            slug: slug
                        });
                    }
                    
                    this.complete = function(){
                        utils.track(testName+' Finish');
                    };
                    return this;
                }
            };

            tests[testName] = tests[testName] || [];
            
            return Public;
        };

    this[Namespace] = TestEngine;
    
}).call(this, window, document);
