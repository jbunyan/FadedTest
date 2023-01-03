/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 * 
 * XMLHttpRequest plugin compatibility with jQuery Ajax unit tests.
 */
describe('XMLHttpRequest plugin with jQuery library:', function() {
    var DATA_TYPES = {
            json: 'json',
            text: 'text'
        },
        METHODS = {
            get: 'GET',
            post: 'POST'
        },
        BASE_URL = new URL('http://httpbin.org/get');

    describe('Ajax "GET" request', function() {
        BASE_URL.pathname = 'get'

        var url = BASE_URL.href,
            requestSettings = {
                url: url,
                type: METHODS.get
            },
            defaultResponseExpectations = function(response) {
                expect(response).toBeDefined();
                expect(response.args).toBeDefined();
                expect(response.headers).toBeDefined();
            };
        // reset to default setup
        beforeEach(function() {
            BASE_URL.pathname = 'get';

            requestSettings = {
                url: url,
                type: METHODS.get
            }
        });

        it('with :url and :method only should be executed', function(done) {
            requestSettings.success = function(result) {
                // self object expectation
                expect(this.async).toBeTruthy();
                expect(this.dataType).toBe(DATA_TYPES.json);
                expect(typeof this.success).toBe('function');
                expect(this.type).toBe(METHODS.get);
                expect(this.url).toBe(url);

                // default response body expectations
                defaultResponseExpectations(result);

                done();
            }

            requestSettings.dataType = DATA_TYPES.json;

            $.ajax(requestSettings)
        });

        it('with :url, :method and :async parameters should have correct context', function(done) {
            requestSettings.success = function(result) {
                // self object expectation
                expect(this.async).toBeFalsy();
                expect(this.dataType).toBe(DATA_TYPES.json);
                expect(typeof this.success).toBe('function');
                expect(this.type).toBe(METHODS.get);
                expect(this.url).toBe(url);

                // default response body expectations
                defaultResponseExpectations(result);

                done();
            }

            requestSettings.dataType = DATA_TYPES.json;
            requestSettings.async = false;

            $.ajax(requestSettings)
        });

        // TODO: enable this test after authentication is implemented
        xit('with :url, :method, :async, :user and :password parameters should have correct context', function(done) {
            var userName = 'user_name',
                password = 'password';

            BASE_URL.pathname = 'basic-auth/' + userName + '/' + password;

            var url = BASE_URL.href;

            requestSettings.success = function(result) {
                // self object expectation
                expect(this.async).toBeTruthy();
                expect(this.dataType).toBe(DATA_TYPES.json);
                expect(typeof this.success).toBe('function');
                expect(this.type).toBe(METHODS.get);
                expect(this.url).toBe(url);

                expect(result).toBeDefined();
                expect(result.authenticated).toBeTruthy();
                expect(result.user).toBe(userName);

                done();
            }

            requestSettings.dataType = DATA_TYPES.json;
            requestSettings.async = true;
            requestSettings.username = userName;
            requestSettings.password = password;
            requestSettings.url = BASE_URL.href;

            $.ajax(requestSettings)
        });

        // TODO: enable this test after authentication is implemented
        xit('with :url, :method, :user and :password parameters without :async passed should have correct context', function(done) {
            var userName = 'user_name',
                password = 'password';

            BASE_URL.pathname = 'basic-auth/' + userName + '/' + password;

            var url = BASE_URL.href;

            requestSettings.success = function(result) {
                // self object expectation
                expect(this.async).toBeTruthy();
                expect(this.dataType).toBe(DATA_TYPES.json);
                expect(typeof this.success).toBe('function');
                expect(this.type).toBe(METHODS.get);
                expect(this.url).toBe(url);

                expect(result).toBeDefined();
                expect(result.authenticated).toBeTruthy();
                expect(result.user).toBe(userName);

                done();
            }

            requestSettings.dataType = DATA_TYPES.json;
            requestSettings.username = userName;
            requestSettings.password = password;
            requestSettings.url = BASE_URL.href;

            $.ajax(requestSettings)
        });
    });

    describe('Ajax "POST" request', function() {
        BASE_URL.pathname = 'post'

        var url = BASE_URL.href,
            requestSettings = {
                url: url,
                type: METHODS.post
            },
            defaultRequestBody = {
                boolean: true,
                string: 'str',
                number: 1
            },
            defaultResponseExpectations = function(response) {
                expect(response).toBeDefined();
                expect(response.args).toBeDefined();
                expect(response.headers).toBeDefined();
            };
        // reset to default setup
        beforeEach(function() {
            BASE_URL.pathname = 'post';

            url = BASE_URL.href;

            requestSettings = {
                url: url,
                type: METHODS.post
            }
        });

        it('with :url and :method only and "JSON" request body should be executed and response body should be valid', function(done) {
            requestSettings.success = function(result) {
                // self object expectation
                expect(this.async).toBeTruthy();
                expect(this.dataType).toBe(DATA_TYPES.json);
                expect(typeof this.success).toBe('function');
                expect(this.type).toBe(METHODS.post);
                expect(this.url).toBe(url);

                // default response body expectations
                defaultResponseExpectations(result);

                var requestBodyFromResponse = result.form,
                    numberStrValue = parseInt(requestBodyFromResponse.number);

                expect(requestBodyFromResponse.boolean).toBe(defaultRequestBody.boolean.toString());
                expect(numberStrValue).toBe(defaultRequestBody.number);
                expect(requestBodyFromResponse.string).toBe(defaultRequestBody.string);

                done();
            }

            requestSettings.dataType = DATA_TYPES.json;
            requestSettings.data = defaultRequestBody;

            $.ajax(requestSettings)
        });

        it('with :url and :method only and "text" request body should be executed and response body should be valid', function(done) {
            requestSettings.success = function(result) {
                // self object expectation
                expect(this.async).toBeTruthy();
                expect(this.dataType).toBe(DATA_TYPES.text);
                expect(typeof this.success).toBe('function');
                expect(this.type).toBe(METHODS.post);
                expect(this.url).toBe(url);

                var responseBody = JSON.parse(result);
                    requestBodyFromResponse = responseBody.form,
                    numberStrValue = parseInt(requestBodyFromResponse.number);

                // default response body expectations
                defaultResponseExpectations(responseBody);

                expect(requestBodyFromResponse.boolean).toBe(defaultRequestBody.boolean.toString());
                expect(numberStrValue).toBe(defaultRequestBody.number);
                expect(requestBodyFromResponse.string).toBe(defaultRequestBody.string);

                done();
            }

            requestSettings.dataType = DATA_TYPES.text;
            requestSettings.data = defaultRequestBody;

            $.ajax(requestSettings)
        });
    });
});
