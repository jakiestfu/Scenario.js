describe("Weights", function(){
	it('should be evenly weighted', function(){
		var res = {
			A: 0,
			B: 0
		};
		var i = 1000;
		while(i--){
			new Scenario({
				name: 'Weight Test',
				track: function(name, opts, cb){ res[opts.Tests]++; }
			})
			.test({name: 'A'})
			.test({name: 'B'})
			.go();
		}
	});
});
