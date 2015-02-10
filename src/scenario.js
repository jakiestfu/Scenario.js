(function (w, d) {

    "use strict";

    var Namespace = "Scenario";

    var Tester = Tester || function (scenarioOpts) {

        scenarioOpts.track = scenarioOpts.track || function(text, props, cb){
            if( typeof mixpanel !== "undefined" ){
                return mixpanel.track(text, props, cb);
            }
        };

        var self = this;
        var utils;

        /**
         * Keeps track of internal data
         * @type {Object}
         */
        self.cache = {
            ranTests: {},
            weights: {},
            totalWeights: 0
        };

        /**
         * A hash of tests to run
         * @type {Object}
         */
        self.tests = {};

        /**
         * Helper functions
         * @type {Object}
         */
        utils = {

            track: scenarioOpts.track,
            toSlug: function (s) {
                return s.toLowerCase().replace(/-+/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            },
            chooseWeightedItem: function(){
                var toChoose = [],
                    i;
                for(i in self.cache.weights){
                    var _weight = self.cache.weights[i];
                    while(_weight--){
                        toChoose.push(parseInt(i));
                    }
                }
                return toChoose[Math.floor(Math.random() * toChoose.length)];
            },
            checkVariant: function(name){
                /* Check MP cookie for variant name, and return it */  
                return mixpanel.get_property(name) ? mixpanel.get_property(name) : false;
            },
            setVariant: function(variant){
                /* Set the current variant inside the Mixpanel Cookie */
                var mpObj = {};
                mpObj[scenarioOpts.name] = variant;
                mixpanel.register(mpObj);
            }
        };


        self.test = function (opts) {
            opts.weight = opts.weight || 1;

            var index = self.tests[scenarioOpts.name].length;

            self.tests[scenarioOpts.name].push({
                name: opts.name,
                callback: opts.callback,
                weight: opts.weight,
                className: opts.className || utils.toSlug(opts.name)
            });

            self.cache.weights[index] = opts.weight;
            self.cache.totalWeights += opts.weight;

            return this;
        };

        self.go = function() {
            /* If there's a test in the Mixpanel Cookie, keep the user inside that variant */

            if (!utils.checkVariant(scenarioOpts.name)) {
                var chosenTestIndex = utils.chooseWeightedItem();
                var test = self.tests[scenarioOpts.name][chosenTestIndex];
                utils.setVariant(test.name);
            } else {
                var test = utils.checkVariant(scenarioOpts.name);
                /* This is to find the callback for the test */
                var tests = self.tests[scenarioOpts.name];
                for (var i = 0; i <  tests.length; i++) {
                    if (tests[i].name == test.name) {
                      test.callback = tests[i].callback; 
                    }
                }
            }
            d.body.className += " "+test.className;

            self.cache.ranTests[scenarioOpts.name] = test.name;

            utils.track(scenarioOpts.name+" Start", {
                Tests: test.name
            });
            if (typeof test.callback === "function") {
                test.callback.call(null, {
                    name: test.name,
                    slug: test.className,
                    weight: test.weight+'/'+self.cache.totalWeights,
                    odds: Math.floor( (test.weight/self.cache.totalWeights) * 100)
                });
            }
            return this;
        };

        self.complete = function(fn){
            return utils.track(scenarioOpts.name+" Finish", null, fn);
        };

        self.tests[scenarioOpts.name] = self.tests[scenarioOpts.name] || [];
    };

    // Assign to the global namespace
    this[Namespace] = Tester;

}).call(this, window, document);
