(function (w, d) {

    "use strict";

    var Namespace = "Scenario",

        Tester = Tester || function (testName) {

            var 
            cache = {
                ranTests: {},
                weights: {},
                totalWeights: 0
            },
            tests = {},
            utils = {
                track: function(name, props, fn){

                    if( typeof props !== "undefined" ){
                        mixpanel.track( name, props, fn );
                    } else {
                        mixpanel.track( name, false, fn );
                    }
                },
                toSlug: function (s) {
                    return s.toLowerCase().replace(/-+/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                },
                sortArgs: function(args){
                    var toReturn = {
                        weight: 1
                    },
                    i;
                    for(i in args){
                        switch( typeof args[i] ){
                            case "string":
                                toReturn.testName = args[i];
                                break;
                            case "function":
                                toReturn.fn = args[i];
                                break;
                            case "number":
                                toReturn.weight = args[i];
                                break;
                        }
                    }
                    return toReturn;
                },
                chooseWeightedItem: function(){
                    var toChoose = [],
                        i;
                    for(i in cache.weights){
                        var _weight = cache.weights[i];
                        while(_weight--){
                            toChoose.push(parseInt(i));
                        }
                    }
                    return toChoose[Math.floor(Math.random() * toChoose.length)];
                }
            },
            Public = {
                test: function () {
                    var args = utils.sortArgs( arguments ),
                        index = tests[testName].length;
                    tests[testName].push({
                        name: args.testName,
                        fn: args.fn,
                        weight: args.weight
                    });
                    cache.weights[index] = args.weight;
                    cache.totalWeights += args.weight;
                    return this;
                },
                go: function() {
                    
                    var testIndex = utils.chooseWeightedItem(),
                        test = tests[testName][testIndex],
                        slug = utils.toSlug(test.name);

                    d.body.className += " "+slug;

                    cache.ranTests[testName] = test.name;
                    
                    utils.track(testName+" Start", {
                        test: test.name
                    });
                    
                    if (typeof test.fn === "function") {
                        test.fn.call(null, {
                            name: test.name,
                            slug: slug,
                            weight: test.weight+'/'+cache.totalWeights,
                            odds: Math.floor( (test.weight/cache.totalWeights) * 100)
                        });
                    }

                    this.complete = function(fn){
                        return utils.track(testName+" Finish", null, fn);
                    };
                    return this;
                }
            };

            tests[testName] = tests[testName] || [];
            
            return Public;
        };

    this[Namespace] = Tester;

}).call(this, window, document);
