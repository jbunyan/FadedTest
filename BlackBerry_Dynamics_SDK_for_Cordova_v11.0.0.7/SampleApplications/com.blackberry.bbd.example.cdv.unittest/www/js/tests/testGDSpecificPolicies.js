/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 * 
 * GDSpecificPolicies plugin unit tests.
 */
describe('GDSpecificPolicies plugin:', function() {

	it('Check GDSpecificPolicies plugin installation', function() {
		expect(window.plugins).toBeDefined();
		expect(window.plugins.GDSpecificPolicies).toBeDefined();
  });

	it('Test updatePolicy method: negative case - no parameters', function(done) {

		try {
			window.plugins.GDSpecificPolicies.updatePolicy();
		} catch (e) {
				expect(e).toBeDefined();
				expect(e.message).toBe("TypeError: Failed to execute 'updatePolicy' on 'GDSpecificPolicies': 2 argument required, but only 0 present.");

				done();
		}

	});

});
