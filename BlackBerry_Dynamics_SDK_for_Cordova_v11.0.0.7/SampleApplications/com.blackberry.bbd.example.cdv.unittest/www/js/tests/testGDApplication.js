/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * GDApplication plugin unit tests.
 */
describe('GDApplication plugin:', function() {

	it('Check GDApplication plugin installation', function() {
		expect(window).toBeDefined();
		expect(window.plugins).toBeDefined();
		expect(window.plugins.GDApplication).toBeDefined();
	});

	describe('GDApplication version:', function() {
		it('getVersion result is defined and not null', function(done) {
			var successCallback = function(result) {
				expect(result).toBeDefined();
				expect(result).not.toBeNull();

				done();
			};

			var errorCallback = function(error) {
				//DESNOTE ovovch:this is positive case, we shouldn't get here.
				expect(true).toBe(false);

				console.log("error retreiving application version: " + error);

				done();
			};

			window.plugins.GDApplication.getVersion(successCallback, errorCallback);

			// var errorMessage = "no response from GDApplication plugin getVersion method";
		});
	});

	describe('GDApplication getApplicationConfig', function() {
		var pluginResult = null;

		beforeEach(function(done) {
			pluginResult = null;

			var successCallback = function(result) {
				pluginResult = result;
				done();
			};

			var errorCallback = function(error) {
				//DESNOTE ovovch:this is positive case, we shouldn't get here.
				expect(true).toBe(false);

				console.log("error retreiving application config: " + error);

				done();
			};

			window.plugins.GDApplication.getApplicationConfig(successCallback, errorCallback);
		});

		it('GDApplication getApplicationConfig is defined and not null', function() {
			expect(pluginResult).toBeDefined();
			expect(pluginResult).not.toBeNull();
		});

		it('GDApplication getApplicationConfig valid json', function() {
			try {
				JSON.parse(pluginResult);
				expect(true).toBe(true);
			} catch (e) {
				expect(false).toBe(true);

				console.log("error parsing application config: " + e);
			}
		});


		it('GDApplication getApplicationConfig check json for required tags', function() {
			try {
				var json = JSON.parse(pluginResult);

				var appServer = json["appServers"];
				var userId = json["userId"];

				expect(userId).toBeDefined();
				expect(userId).not.toBeNull();
			} catch (e) {
				expect(false).toBe(true);

				console.log("error parsing application config: " + e);
			}
		});

		it('GDApplication getApplicationConfig check json for unexpected tags', function() {
			try {
				var json = JSON.parse(pluginResult);

				var someRandomValue = json["_someRandomValue_which_we_expect_does_not_exist"];

				expect(someRandomValue).not.toBeDefined();
			} catch (e) {
				expect(false).toBe(true);

				console.log("error parsing application config: " + e);
			}
		});
	});

	describe('GDApplication getCordovaSdkVersion:', function() {
		it('GDApplication getCordovaSdkVersion is defined string', function() {
			var cordovaSdkVersion = window.plugins.GDApplication.getCordovaSdkVersion();

			expect(cordovaSdkVersion).toBeDefined();
			expect(typeof cordovaSdkVersion).toBe('string');
		});

		it('GDApplication getCordovaSdkVersion meets version pattern', function() {
			var versionRegExp = /\d+(\.\d+){3}$/;

			var cordovaSdkVersion = window.plugins.GDApplication.getCordovaSdkVersion();
			var isVersionIncluded = versionRegExp.test(cordovaSdkVersion);

			expect(isVersionIncluded).toBe(true);
		});
	});

});
