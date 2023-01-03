/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * BBWebView unit tests: XMLHttpRequest, fetch API.
 */

describe('BBWebView API', function() {
    var originalTimeout;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    describe('BBWebView API: XMLHttpRequest', function() {

        it('Check XMLHttpRequest is available', function() {
            expect(XMLHttpRequest).toBeDefined();

            var xhr = new XMLHttpRequest();
            expect(xhr instanceof XMLHttpRequest).toBe(true);
        });

        describe('XMLHttpRequest getResponseHeader', function() {

            it('XMLHttpRequest getResponseHeader: negative case - no parameter', function(done) {
                var method = 'GET';
                var url = 'http://httpbin.org/get';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        expect(function() { xhr.getResponseHeader(); }).toThrow();

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest getResponseHeader: positive case', function(done) {
                var method = 'GET';
                var url = 'http://httpbin.org/get';
                var headerName = 'Content-Type';
                var expectedHeaderValue = 'application/json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        var headerValue = xhr.getResponseHeader(headerName);

                        expect(headerValue).toBeDefined();
                        expect(headerValue.includes(expectedHeaderValue)).toBe(true);

                        done();
                    }
                };

                xhr.send();
            });

        });

        describe('XMLHttpRequest getAllResponseHeaders', function() {

            it('XMLHttpRequest getAllResponseHeaders: positive case', function(done) {
                var method = 'GET';
                var url = 'http://httpbin.org/get';
                var expectedDefaultHeaderName1 = 'Content-Type';
                var expectedDefaultHeaderName2 = 'Content-Length';
                var responseType = 'text';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        var headersValue = xhr.getAllResponseHeaders();

                        expect(headersValue).toBeDefined();
                        expect(typeof headersValue).toBe('string');
                        expect(headersValue).toContain(expectedDefaultHeaderName1.toLowerCase());
                        expect(headersValue).toContain(expectedDefaultHeaderName2.toLowerCase());

                        done();
                    }
                };

                xhr.send();
            });

        });

        describe('XMLHttpRequest send', function() {

            it('XMLHttpRequest send: GET async, on default port', function(done) {
                var method = 'GET';
                var url = 'http://httpbin.org:80/get';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: GET async, on secured port', function(done) {
                var method = 'GET';
                var url = 'https://httpbin.org:443/get';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: POST async, on secured port', function(done) {
                var method = 'POST';
                var url = 'https://httpbin.org:443/post';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: GET async, without parameters', function(done) {
                var method = 'GET';
                var url = 'http://httpbin.org/get';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: GET async, with null as parameter', function(done) {
                var method = 'GET';
                var url = 'http://httpbin.org/get';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send(null);
            });

            it('XMLHttpRequest send: POST async', function(done) {
                var method = 'POST';
                var url = 'https://httpbin.org/post';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: PUT async', function(done) {
                var method = 'PUT';
                var url = 'https://httpbin.org/put';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: PATCH async', function(done) {
                var method = 'PATCH';
                var url = 'https://httpbin.org/patch';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: PATCH async with string data as parameter, Content-Type: text/plain and response type JSON', function(done) {
                var method = 'PATCH';
                var url = 'https://httpbin.org/patch';
                var contentTypeHeader = 'content-type';
                var contentTypeValue = 'text/plain';
                var dataString = 'test string';
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);
                        expect(typeof xhr.response).toBe('object');
                        expect(xhr.response.data).toBe(dataString);

                        done();
                    }
                };

                xhr.setRequestHeader(contentTypeHeader, contentTypeValue);
                xhr.send(dataString);
            });

            it('XMLHttpRequest send: PATCH async with blob data as parameter and response type JSON', function(done) {
                var method = 'PATCH';
                var url = 'https://httpbin.org/patch';
                var dataString = 'test string';
                var blob = new Blob([dataString], {
                    type: 'text/plain'
                });
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);
                        expect(typeof xhr.response).toBe('object');
                        expect(xhr.responseType).toBe(responseType);

                        done();
                    }
                };

                xhr.send(blob);
            });

            it('XMLHttpRequest send: PATCH async with arraybuffer as parameter and response type JSON', function(done) {
                var method = 'PATCH';
                var url = 'https://httpbin.org/patch';
                var arrayBuffer = new ArrayBuffer(1024);
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);
                        expect(typeof xhr.response).toBe('object');
                        expect(xhr.responseType).toBe(responseType);

                        done();
                    }
                };

                xhr.send(arrayBuffer);
            });

            it('XMLHttpRequest send: DELETE async', function(done) {
                var method = 'DELETE';
                var url = 'http://httpbin.org/delete';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url, true);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: HEAD async', function(done) {
                var method = 'HEAD';
                var url = 'http://httpbingo.org/head';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.getAllResponseHeaders()).toBeDefined();
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response).toBe('');
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.responseText).toBe('');
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: OPTIONS async', function(done) {
                var method = 'OPTIONS';
                var url = 'http://httpbin.org/';
                var expectedAllowHeader = 'Allow';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url, true);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        var responseHeadersString = xhr.getAllResponseHeaders();
                        // DEVNOTE: Ajax will expose CORS-safelisted response header only
                        var allowHeaderValue = xhr.getResponseHeader(expectedAllowHeader);
                        expect(allowHeaderValue === null).toBeTruthy();
                        expect(responseHeadersString).toBeDefined();
                        expect(typeof responseHeadersString).toBe('string');
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response).toBe('');
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.responseText).toBe('');
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: GET async, with domstring as parameter', function(done) {
                var method = 'GET';
                var url = 'https://httpbin.org/get';
                var param1 = 'somevariable';
                var value1 = 'someValue';
                var param2 = 'anothervariable';
                var value2 = 'anotherValue';
                var domstring = `${param1}=${value1}&${param2}=${value2}`;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, `${url}?${domstring}`);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response.args).toBeDefined();
                        expect(xhr.response.args[param1]).toBe(value1);
                        expect(xhr.response.args[param2]).toBe(value2);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest send: POST async, with domstring as body parameter, Content-Type: application/x-www-form-urlencoded', function(done) {
                var method = 'POST';
                var url = 'https://httpbin.org/post';
                var param1 = 'somevariable';
                var value1 = 'someValue';
                var param2 = 'anothervariable';
                var value2 = 'anotherValue';
                var params = `${param1}=${value1}&${param2}=${value2}`;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response.form).toBeDefined();
                        expect(xhr.response.form[param1]).toBe(value1);
                        expect(xhr.response.form[param2]).toBe(value2);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(params);
            });

            it('XMLHttpRequest send: POST async, with domstring as parameter, Content-Type: text/plain', function(done) {
                var method = 'POST';
                var url = 'https://httpbin.org/post';
                var params = `somevariable=someValue\nanothervariable=anotherValue`;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response.data).toBeDefined();
                        expect(xhr.response.data).toBe(params);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.setRequestHeader('Content-Type', 'text/plain');
                xhr.send(params);
            });

            it('XMLHttpRequest send: POST async, with FormData, Content-Type: multipart/form-data', function(done) {
                var method = 'POST';
                var url = 'https://httpbin.org/post';
                var param1 = 'somevariable';
                var value1 = 'someValue';
                var param2 = 'anothervariable';
                var value2 = 'anotherValue';
                var responseType = 'json';

                var formData = new FormData();
                formData.append(param1, value1);
                formData.append(param2, value2);

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response.headers['Content-Type']).toContain('multipart/form-data');
                        expect(xhr.response.form[param1]).toBe(value1);
                        expect(xhr.response.form[param2]).toBe(value2);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send(formData);
            });

        });

        describe('XMLHttpRequest responseType', function() {

            it('XMLHttpRequest responseType: empty string, responseXML', function(done) {
                var method = 'GET';
                var url = 'https://www.w3schools.com/xml/note.xml';
                var contentTypeHeaderName = 'Content-Type';
                var expectedContentTypeHeaderValue = 'text/xml';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(typeof xhr.response).toBe('string');
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.responseXML).toBeDefined();
                        expect(xhr.responseXML instanceof Document).toBe(true);
                        expect(xhr.responseXML.contentType).toBe(expectedContentTypeHeaderValue);
                        expect(xhr.responseXML.readyState).toBe('complete');
                        expect(xhr.responseXML.documentURI).toBe(url);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.getResponseHeader(contentTypeHeaderName)).toBe(expectedContentTypeHeaderValue);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest responseType: responseXML', function(done) {
                var method = 'GET';
                var url = 'https://www.w3schools.com/xml/note.xml';
                var responseType = 'text';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.responseType = responseType;

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(typeof xhr.response).toBe('string');
                        expect(xhr.responseText).toBeDefined();
                        expect(xhr.responseText).toContain('<?xml');
                        expect(function() { xhr.responseXML; }).toThrow();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest responseType: json', function(done) {
                var method = 'GET';
                var url = 'http://httpbin.org/get?one=two&key=value';
                var responseResultHeader1 = 'key';
                var responseResultValue1 = 'value';
                var responseResultHeader2 = 'one';
                var responseResultValue2 = 'two';
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.responseType = responseType;

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(typeof xhr.response).toBe('object');
                        expect(xhr.response.args[responseResultHeader1]).toBe(responseResultValue1);
                        expect(xhr.response.args[responseResultHeader2]).toBe(responseResultValue2);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest responseType: document', function(done) {
                var method = 'GET';
                var url = 'https://www.w3schools.com/xml/note.xml';
                var responseType = 'document';
                var contentTypeHeaderName = 'Content-Type';
                var expectedContentTypeHeaderValue = 'text/xml';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.responseType = responseType;

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response instanceof Document).toBe(true);
                        expect(xhr.responseXML).toBeDefined();
                        expect(xhr.responseXML instanceof Document).toBe(true);
                        expect(xhr.responseXML.contentType).toBe(expectedContentTypeHeaderValue);
                        expect(xhr.responseXML.readyState).toBe('complete');
                        expect(xhr.responseXML.documentURI).toBe(url);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.getResponseHeader(contentTypeHeaderName)).toBe(expectedContentTypeHeaderValue);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest responseType: document: html', function(done) {
                var method = 'GET';
                var url = 'https://httpbin.org/html';
                var responseType = 'document';
                var contentTypeHeaderName = 'Content-Type';
                var expectedContentTypeHeaderValue = 'text/html';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.responseType = responseType;

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response instanceof Document).toBe(true);
                        expect(xhr.responseXML).toBeDefined();
                        expect(xhr.responseXML instanceof Document).toBe(true);
                        expect(xhr.responseXML.contentType).toBe(expectedContentTypeHeaderValue);
                        expect(xhr.responseXML.readyState).toBe('interactive');
                        expect(xhr.responseXML.documentURI).toBe(url);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.getResponseHeader(contentTypeHeaderName)).toContain(expectedContentTypeHeaderValue);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest responseType: blob', function(done) {
                var method = 'GET';
                var url = 'https://via.placeholder.com/720';
                var responseType = 'blob';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.responseType = responseType;

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        var expectedSize = parseInt(xhr.getResponseHeader('Content-Length'), 10);
                        var expectedType = xhr.getResponseHeader('Content-Type');

                        expect(xhr.response).toBeDefined();
                        expect(xhr.response instanceof Blob).toBe(true);
                        expect(xhr.response.size).toBe(expectedSize);
                        expect(xhr.response.type).toBe(expectedType);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest responseType: arraybuffer', function(done) {
                var method = 'GET';
                var url = 'https://via.placeholder.com/720';
                var responseType = 'arraybuffer';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.responseType = responseType;

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        var expectedSize = parseInt(xhr.getResponseHeader('Content-Length'), 10);

                        expect(xhr.response).toBeDefined();
                        expect(xhr.response instanceof ArrayBuffer).toBe(true);
                        expect(xhr.response.byteLength).toBe(expectedSize);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

        });

        describe('XMLHttpRequest responseURL attribute', function() {

            it('Should be present on the XMLHttpRequest object', function(done) {
                var method = 'GET';
                var url = 'https://httpbingo.org/get';
                var expectedStatus = 200;

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.responseURL).toBeDefined();
                        expect(xhr.responseURL).toBe(url);

                        done();
                    }
                };

                xhr.send();
            });

            it('Should be equal to the redirection url', function(done) {
                var method = 'GET';
                var url = 'https://httpbingo.org/redirect-to?url=';
                var redirectionUrl = 'https://www.google.com/';
                var expectedStatus = 200;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, `${url}${redirectionUrl}`);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.responseURL).toBe(redirectionUrl);

                        done();
                    }
                };

                xhr.send();
            });

            it('Should be equal to the last server URL in the redirection chain', function(done) {
                var method = 'GET';
                var url = 'https://httpbingo.org/redirect/4';
                var redirectionUrl = 'https://httpbingo.org/get';
                var expectedStatus = 200;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.responseURL).toBe(redirectionUrl);

                        done();
                    }
                };

                xhr.send();
            });

            it('Should be equal to the last server URL in the redirection chain - internal resource', function(done) {
                var method = 'GET';
                var url = 'http://gd-lviv22.gd.sw.rim.net:9879/simpleredirect?code=301';
                var redirectionUrl = 'http://gd-lviv22.gd.sw.rim.net:9879/code301.html?required=1';
                var expectedStatus = 200;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.responseURL).toBe(redirectionUrl);

                        done();
                    }
                };

                xhr.send();
            });

            it('Should be equal to the last server URL in the redirection chain - absolute location', function(done) {
                var method = 'GET';
                var url = 'http://httpbingo.org/redirect-to?url=http%3A%2F%2Fhttpbingo.org/get&status_code=301';
                var redirectionUrl = 'http://httpbingo.org/get';
                var expectedStatus = 200;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.responseURL).toBe(redirectionUrl);

                        done();
                    }
                };

                xhr.send();

            });

            it('Should be equal to the last server URL in the redirection chain - with relative location', function(done) {
                var method = 'GET';
                var url = 'http://httpbingo.org/redirect-to?url=/get&status_code=301';
                var redirectionUrl = 'http://httpbingo.org/get';
                var expectedStatus = 200;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        expect(xhr.status).toBe(expectedStatus);
                        expect(xhr.responseURL).toBe(redirectionUrl);

                        done();
                    }
                };

                xhr.send();

            });

        });

        describe('XMLHttpRequest abort', function() {
            var UNSENT = 0;
            var OPENED = 1;
            var HEADERS_RECEIVED = 2;
            var LOADING = 3;
            var DONE = 4;

            it('XMLHttpRequest abort: after calling SEND method', function(done) {
                var method = 'GET';
                var url = 'http://httpbin.org/get?one=two&key=value';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(UNSENT);

                xhr.open(method, url);
                expect(xhr.readyState).toBe(OPENED);
                expect(xhr.abort).toBeDefined();
                expect(xhr.responseHeaders).not.toBeDefined();

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === HEADERS_RECEIVED) {
                        var responseHeadersString = xhr.getAllResponseHeaders().trim();
                        expect(responseHeadersString).toBeDefined();
                        expect(typeof responseHeadersString).toBe('string');
                        expect(responseHeadersString.length).toBeGreaterThan(0);

                        xhr.abort();

                        var responseHeadersStringAfterAbort = xhr.getAllResponseHeaders().trim();
                        expect(responseHeadersStringAfterAbort).toBeDefined();
                        expect(responseHeadersStringAfterAbort).toBe('');
                        expect(xhr.readyState).toBe(UNSENT);

                        done();
                    }
                }

                xhr.send();
            });

        });

        describe('XMLHttpRequest authentification types', function() {

            it('XMLHttpRequest Basic auth: GET, positive case - valid credentials, withCredentials=true', function(done) {
                var method = 'GET';
                var username = 'username';
                var password = 'password';
                var url = `https://httpbin.org/basic-auth/${username}/${password}`;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response.user).toBe(username);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            it('XMLHttpRequest Basic auth: GET, negative case - invalid credentials, withCredentials=true', function(done) {
                var method = 'GET';
                var username = 'username';
                var password = 'password';
                var url = 'https://httpbin.org/basic-auth/' + username + '/' + password;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.setRequestHeader('Authorization', 'Basic ' + username + ':' + password);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 401;

                    if (xhr.readyState === 4) {
                        expect(xhr.withCredentials).toBe(false);
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response).toBeNull();
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();

            });

            // TODO: enable this test after authentication is implemented
            xit('XMLHttpRequest Basic auth: GET, positive case - valid credentials set in open method, withCredentials=true', function(done) {
                var method = 'GET';
                var username = 'username';
                var password = 'password';
                var url = 'https://httpbin.org/basic-auth/'+ username + '/' + password;
                var responseType = 'json';

                var xhr = new XMLHttpRequest();
                expect(xhr.readyState).toBe(0);

                xhr.open(method, url, true, username, password);
                xhr.responseType = responseType;
                expect(xhr.readyState).toBe(1);

                xhr.onreadystatechange = function() {
                    var expectedStatus = 200;

                    if (xhr.readyState === 4) {
                        expect(xhr.withCredentials).toBe(false);
                        expect(xhr.response).toBeDefined();
                        expect(xhr.response.user).toBe(username);
                        expect(xhr.status).toBeDefined();
                        expect(xhr.status).toBe(expectedStatus);

                        done();
                    }
                };

                xhr.send();
            });

            // TODO: enable this test after authentication is implemented
            xit('XMLHttpRequest Digest auth: GET, positive case - valid credentials', function(done) {
                var method = 'GET';
                var url = 'http://gmaiis01.gma.sw.rim.net:8003/';
                var username = 'goodadmin';
                var password = 'password';

                var xhr = new XMLHttpRequest();
                xhr.open(method, url);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        var digestResponseHeader = xhr.getResponseHeader('Www-Authenticate');

                        expect(xhr.status).toBe(401);
                        expect(digestResponseHeader).toContain('Digest');

                        var digest = new Digest(username, password, method);
                        var digestRequestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

                        xhr = new XMLHttpRequest();
                        xhr.open(method, url);

                        xhr.setRequestHeader('Authorization', digestRequestHeader);

                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                expect(xhr.status).toBe(200);

                                done();
                            }
                        };

                        xhr.send(null);
                    }
                }

                xhr.send(null);
            });

            // TODO: enable this test after authentication is implemented
            xit('XMLHttpRequest Digest auth: GET, negative case - invalid credentials', function(done) {
                var method = 'GET';
                var url = 'http://gmaiis01.gma.sw.rim.net:8003/';
                var username = 'wrong_username';
                var password = 'wrong_password';

                var xhr = new XMLHttpRequest();
                xhr.open(method, url);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        var digestResponseHeader = xhr.getResponseHeader('Www-Authenticate');

                        expect(xhr.status).toBe(401);
                        expect(digestResponseHeader).toContain('Digest');

                        var digest = new Digest(username, password, method);
                        var digestRequestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

                        xhr = new XMLHttpRequest();
                        xhr.open(method, url);

                        xhr.setRequestHeader('Authorization', digestRequestHeader);

                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                expect(xhr.status).toBe(401);

                                done();
                            }
                        };

                        xhr.send(null);
                    }
                }

                xhr.send(null);
            });

            // TODO: enable this test after authentication is implemented
            xit('XMLHttpRequest NTLM auth: GET, positive case - valid credentials', function(done) {
                var url = 'http://gmaiis01.gma.sw.rim.net:8005';
                var host = 'gmaiis01.gma.sw.rim.net:8005';
                var username = 'goodadmin';
                var password = 'password';
                var domain = 'gma';
                var method = 'GET';

                var xhr = new XMLHttpRequest();
                xhr.open(method, url);
                xhr.setRequestHeader('pragma', 'no-cache');
                xhr.setRequestHeader('cache-control', 'no-cache');

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        var ntlmResponseHeader = xhr.getResponseHeader('Www-Authenticate');

                        expect(xhr.status).toBe(401);
                        expect(ntlmResponseHeader).toContain('NTLM');

                        // Send NTLM message 1
                        Ntlm.setCredentials(domain, username, password);
                        var msg1 = Ntlm.createMessage1(host);

                        xhr = new XMLHttpRequest();

                        xhr.open(method, url);
                        xhr.setRequestHeader('Authorization', 'NTLM ' + msg1.toBase64());
                        xhr.setRequestHeader('pragma', 'no-cache');
                        xhr.setRequestHeader('cache-control', 'no-cache');

                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                // Handle NTLM message 2 (received response from NTLM server)
                                var authResponseHeader = xhr.getResponseHeader('Www-Authenticate');
                                var challenge = Ntlm.getChallenge(authResponseHeader);

                                expect(xhr.status).toBe(401);
                                expect(authResponseHeader).toContain('NTLM');

                                // Send NTLM message 3
                                var msg3 = Ntlm.createMessage3(challenge, host);

                                xhr = new XMLHttpRequest();

                                xhr.open(method, url);
                                xhr.setRequestHeader('Authorization', 'NTLM ' + msg3.toBase64());
                                xhr.setRequestHeader('pragma', 'no-cache');
                                xhr.setRequestHeader('cache-control', 'no-cache');

                                xhr.onreadystatechange = function() {
                                    if (xhr.readyState === 4) {
                                        expect(xhr.status).toBe(200);

                                        done();
                                    }
                                };

                                xhr.send(null);
                            }
                        };

                        xhr.send(null);
                    }
                }

                // Auth request
                xhr.send(null);
            });

        });

    });

    describe('BBWebView API: fetch', function() {

        it('Check fetch is available', function() {
            expect(fetch).toBeDefined();
        });

        describe('Fetch headers', function() {

            it('Fetch: GET, set custom header in Headers', async function() {
                var url = 'https://httpbin.org/headers';
                var customHeaderName = 'Custom-Header';
                var customHeaderValue = 'headerValue';

                var response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        [customHeaderName]: customHeaderValue
                    }
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson.headers[customHeaderName]).toBe(customHeaderValue);
            });

            it('Fetch: GET, set ordinary header in Headers', async function() {
                var url = 'https://httpbin.org/headers';
                var headerName = 'Content-Type';
                var headerValue = 'application/json; charset=utf-8';

                var response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        [headerName]: headerValue
                    }
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson.headers[headerName]).toBe(headerValue);
            });

            it('Fetch: GET, set ordinary and custom headers directly in fetch', async function() {
                var url = 'https://httpbin.org/headers';
                var headerName = 'Content-Type';
                var headerValue = 'application/json; charset=utf-8';
                var customHeaderName = 'Custom-Header';
                var customHeaderValue = 'headerValue';

                var response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        [headerName]: headerValue,
                        [customHeaderName]: customHeaderValue
                    }
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson.headers[headerName]).toBe(headerValue);
                expect(responseJson.headers[customHeaderName]).toBe(customHeaderValue);
            });

            it('Fetch: GET, get headers', async function() {
                var url = 'https://httpbin.org/headers';
                var expectedHeaderName = 'Content-Type';
                var expectedHeaderValue = 'application/json';

                var response = await fetch(url, {
                    method: 'GET',
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);
                expect(response.headers.get(expectedHeaderName)).toBe(expectedHeaderValue);
                expect(parseInt(response.headers.get('Content-Length'), 10)).toBeGreaterThan(0);
            });

        });

        describe('Fetch response status codes', function() {
            var url = 'https://httpbin.org';

            it('Fetch: GET, code 200: OK', async function() {
                var response = await fetch(url + '/status/200', {
                    method: 'GET'
                });

                expect(response.headers.get('Content-Type')).toBe('text/html');
                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);
            });

            it('Fetch: GET, code 201: Created', async function() {
                var response = await fetch(url + '/status/201', {
                    method: 'GET',
                });

                expect(response.status).toBe(201);
                expect(response.ok).toBe(true);
            });

            it('Fetch: POST, code 201: Created', async function() {
                var response = await fetch(url + '/status/201', {
                    method: 'POST',
                    body: null
                });

                expect(response.status).toBe(201);
                expect(response.ok).toBe(true);
            });

            it('Fetch: DELETE, code 202: Accepted', async function() {
                var response = await fetch(url + '/status/202', {
                    method: 'DELETE',
                });

                expect(response.status).toBe(202);
                expect(response.ok).toBe(true);
            });

            it('Fetch: DELETE, code 204: No Content', async function() {
                var response = await fetch(url + '/status/204', {
                    method: 'DELETE',
                });

                expect(response.status).toBe(204);
                expect(response.ok).toBe(true);
            });

            it('Fetch: GET, should redirect to the redirection url, code 301: Moved Permanently', async function() {
                var redirectionUrl = 'https://httpbingo.org/get';

                var response = await fetch('https://httpbingo.org/status/301', {
                    method: 'GET',
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);
                expect(response.url).toBe(redirectionUrl);
            });

            it('Fetch: GET, code 401: Unauthorized', async function() {
                var response = await fetch(url + '/status/401', {
                    method: 'GET',
                });

                expect(response.status).toBe(401);
                expect(response.ok).toBe(false);
            });

            it('Fetch: GET, code 403: Forbidden', async function() {
                var response = await fetch(url + '/status/403', {
                    method: 'GET',
                });

                expect(response.status).toBe(403);
                expect(response.ok).toBe(false);
            });

            it('Fetch: GET, code 404: Not Found', async function() {
                var response = await fetch(url + '/status/404', {
                    method: 'GET',
                });

                expect(response.status).toBe(404);
                expect(response.ok).toBe(false);
            });

            it('Fetch: DELETE, code 404: Not Found', async function() {
                var response = await fetch(url + '/status/404', {
                    method: 'DELETE',
                });

                expect(response.status).toBe(404);
                expect(response.ok).toBe(false);
            });

            it('Fetch: GET, code 407: Proxy Authentication Required', async function() {
                var expectedErrorMessage = 'Failed to fetch';
                try {
                    var response = await fetch(url + '/status/407', {
                        method: 'GET',
                    });
                    expect(response.status).toBe(407);
                    expect(response.ok).toBe(false);
                } catch (error) {
                    expect(error.message).toBe(expectedErrorMessage);
                }
            });

            it('Fetch: GET, code 500: Internal Server Error', async function() {
                var response = await fetch(url + '/status/500', {
                    method: 'GET'
                });

                expect(response.status).toBe(500);
                expect(response.ok).toBe(false);
            });

            it('Fetch: GET, code 501: Not Implemented', async function() {
                var response = await fetch(url + '/status/501', {
                    method: 'GET',
                });

                expect(response.status).toBe(501);
                expect(response.ok).toBe(false);
            });

            it('Fetch: GET, code 503: Service Unavailable', async function() {
                var response = await fetch(url + '/status/503', {
                    method: 'GET',
                });

                expect(response.status).toBe(503);
                expect(response.ok).toBe(false);
            });

        });

        describe('Fetch send request', function() {

            it('Fetch: GET, with domstring as parameter', async function() {
                var method = 'GET';
                var url = 'https://httpbin.org/get';
                var param1 = 'somevariable';
                var value1 = 'someValue';
                var param2 = 'anothervariable';
                var value2 = 'anotherValue';
                var domstring = `${param1}=${value1}&${param2}=${value2}`;

                var response = await fetch(`${url}?${domstring}`, {
                    method,
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson).toBeDefined();
                expect(responseJson.args).toBeDefined();
                expect(responseJson.args[param1]).toBe(value1);
                expect(responseJson.args[param2]).toBe(value2);
            });

            it('Fetch: POST, with domstring as body parameter, Content-Type: application/x-www-form-urlencoded', async function() {
                var method = 'POST';
                var url = 'https://httpbin.org/post';
                var param1 = 'somevariable';
                var value1 = 'someValue';
                var param2 = 'anothervariable';
                var value2 = 'anotherValue';
                var params = `${param1}=${value1}&${param2}=${value2}`;

                var response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson).toBeDefined();
                expect(responseJson.form).toBeDefined();
                expect(responseJson.form[param1]).toBe(value1);
                expect(responseJson.form[param2]).toBe(value2);
            });

            it('Fetch: POST, with domstring as parameter, Content-Type: text/plain', async function() {
                var method = 'POST';
                var url = 'https://httpbin.org/post';
                var params = `somevariable=someValue\nanothervariable=anotherValue`;

                var response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: params
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson).toBeDefined();
                expect(responseJson.data).toBeDefined();
                expect(responseJson.data).toBe(params);
            });

            it('Fetch: POST, with JSON as parameter, Content-Type: application/json', async function() {
                var method = 'POST';
                var url = 'https://httpbin.org/post';
                var jsonObject = {
                    param1: 'somevariable',
                    value1: 'someValue',
                    param2: 'anothervariable',
                    value2: 'anotherValue'
                };

                var response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(jsonObject)
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();
                var responseDataJsonObject = JSON.parse(responseJson.data);

                expect(responseJson).toBeDefined();
                expect(responseJson.headers['Content-Type']).toBeDefined();
                expect(responseJson.headers['Content-Type']).toContain('application/json');
                expect(responseJson.data).toBeDefined();
                expect(jsonObject).toEqual(responseDataJsonObject);
            });

            it('Fetch: POST, with FormData, Content-Type: multipart/form-data', async function() {
                var method = 'POST';
                var url = 'https://httpbin.org/post';
                var param1 = 'somevariable';
                var value1 = 'someValue';
                var param2 = 'anothervariable';
                var value2 = 'anotherValue';

                var formData = new FormData();
                formData.append(param1, value1);
                formData.append(param2, value2);

                var response = await fetch(url, {
                    method,
                    body: formData
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson).toBeDefined();
                expect(responseJson.headers['Content-Type']).toBeDefined();
                expect(responseJson.headers['Content-Type']).toContain('multipart/form-data');
                expect(responseJson.form).toBeDefined();
                expect(responseJson.form[param1]).toBe(value1);
                expect(responseJson.form[param2]).toBe(value2);
            });

            it('Fetch: GET, with blob data, Accept: image/jpeg', async function() {
                var url = 'https://httpbin.org';
                var acceptHeaderValue = 'image/jpeg';

                var response = await fetch(url + '/image', {
                    method: 'GET',
                    headers: {
                        'Accept': acceptHeaderValue
                    }
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                // DEVNOTE: commented as 'content-length' is missing in fetch response
                // var responseContentLength = parseInt(response.headers.get('content-length'), 10);
                var responseContentType = response.headers.get('content-type');

                // expect(responseContentLength).toBeGreaterThan(0);
                expect(responseContentType).toBe(acceptHeaderValue);

                var imageBlob = await response.blob();

                expect(imageBlob.size).toBeGreaterThan(0);
                expect(imageBlob.type).toBe(responseContentType);
            });

            it('Fetch: GET, with blob data, Accept: image/svg+xml', async function() {
                var acceptHeaderValue = 'image/svg+xml';
                var url = 'https://httpbin.org';

                var response = await fetch(url + '/image', {
                    method: 'GET',
                    headers: {
                        'Accept': acceptHeaderValue
                    }
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                // DEVNOTE: commented as 'content-length' is missing in fetch response
                // var responseContentLength = parseInt(response.headers.get('content-length'), 10);
                var responseContentType = response.headers.get('content-type');

                // expect(responseContentLength).toBeGreaterThan(0);
                expect(responseContentType).toBe(acceptHeaderValue);

                var imageBlob = await response.blob();

                expect(imageBlob.size).toBeGreaterThan(0);
                expect(imageBlob.type).toBe(responseContentType);
            });

            it('Fetch: GET, with blob data, Accept: image/webp', async function() {
                var acceptHeaderValue = 'image/webp';
                var url = 'https://httpbin.org';

                var response = await fetch(url + '/image', {
                    method: 'GET',
                    headers: {
                        'Accept': acceptHeaderValue
                    }
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                // DEVNOTE: commented as 'content-length' is missing in fetch response
                // var responseContentLength = parseInt(response.headers.get('content-length'), 10);
                var responseContentType = response.headers.get('content-type');

                // expect(responseContentLength).toBeGreaterThan(0);
                expect(responseContentType).toBe(acceptHeaderValue);

                var imageBlob = await response.blob();

                expect(imageBlob.size).toBeGreaterThan(0);
                expect(imageBlob.type).toBe(responseContentType);
            });

            it('Fetch: PATCH, with blob data, Content-Type: application/octet-stream', async function() {
                var method = 'PATCH';
                var url = 'http://httpbin.org/patch';
                var dataString = 'test string';
                var blob = new Blob([dataString], {
                    type: 'text/plain'
                });

                var response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    },
                    body: blob
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson.headers['Content-Type']).toBeDefined();
                // DEVNOTE: Ajax will prioritize type of blob data, instead of content-type in request headers
                expect(responseJson.headers['Content-Type']).toContain('text/plain');
                expect(responseJson.data).toBeDefined();
                expect(responseJson.data).toBe(dataString);
            });

            it('Fetch: PUT, with arraybuffer', async function() {
                var method = 'PUT';
                var url = 'https://httpbin.org/put';
                var arrayBuffer = new ArrayBuffer(16);
                var view = new Uint32Array(arrayBuffer);
                view[0] = 123456;

                var response = await fetch(url, {
                    method,
                    body: view
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson).toBeDefined();
                expect(responseJson.data.length).toBeGreaterThan(0);
            });

            it('Fetch: redirect, check "redirected" and last server URL in the redirection chain - internal resource', async function() {
                var method = 'GET';
                var url = 'http://gd-lviv22.gd.sw.rim.net:9879/simpleredirect?code=301';
                var redirectionUrl = 'http://gd-lviv22.gd.sw.rim.net:9879/code301.html?required=1';
                var expectedStatus = 200;

                var response = await fetch(url, {
                    method
                });

                expect(response.status).toBe(expectedStatus);
                expect(response.ok).toBe(true);
                expect(response.redirected).toBe(true);
                expect(response.url).toBe(redirectionUrl);
            });

            it('Fetch: automatic redirect, GET, code 301: Moved Permanently, with absolute location', async function() {
                var method = 'GET';
                var url = 'http://httpbingo.org/redirect-to?url=http%3A%2F%2Fhttpbingo.org/get&status_code=301';
                var redirectionUrl = 'http://httpbingo.org/get'

                var response = await fetch(url, {
                    method
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);
                expect(response.redirected).toBe(true);
                expect(response.url).toBe(redirectionUrl);
            });

            it('Fetch: automatic redirect, GET, code 301: Moved Permanently, with relative location', async function() {
                var method = 'GET';
                var url = 'http://httpbingo.org/redirect-to?url=/get&status_code=301';
                var redirectionUrl = 'http://httpbingo.org/get'

                var response = await fetch(url, {
                    method
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);
                expect(response.redirected).toBe(true);
                expect(response.url).toBe(redirectionUrl);
            });

        });

        describe('Fetch response type', function() {

            it('Fetch: response type: json', async function() {
                var method = 'GET';
                var url = 'http://httpbin.org/get?one=two&key=value';
                var responseResultHeader1 = 'key';
                var responseResultValue1 = 'value';
                var responseResultHeader2 = 'one';
                var responseResultValue2 = 'two';

                var response = await fetch(url, {
                    method
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson).toBeDefined();
                expect(typeof responseJson).toBe('object');
                expect(responseJson.args[responseResultHeader1]).toBe(responseResultValue1);
                expect(responseJson.args[responseResultHeader2]).toBe(responseResultValue2);
            });

            it('Fetch: response type: text', async function() {
                var method = 'GET';
                var url = 'https://www.w3schools.com/xml/note.xml';

                var response = await fetch(url, {
                    method
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseText = await response.text();

                expect(responseText).toBeDefined();
                expect(typeof responseText).toBe('string');
                expect(responseText).toContain('<?xml');
            });

            it('Fetch: response type: blob', async function() {
                var method = 'GET';
                var url = 'https://via.placeholder.com/720';

                var response = await fetch(url, {
                    method
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseBlob = await response.blob();

                // DEVNOTE: commented as 'content-length' is missing in fetch response
                // var expectedSize = parseInt(response.headers.get('Content-Length'), 10);
                var expectedType = response.headers.get('Content-Type');

                expect(responseBlob).toBeDefined();
                expect(responseBlob instanceof Blob).toBe(true);
                expect(responseBlob.size).toBeGreaterThan(0);
                expect(responseBlob.type).toBe(expectedType);
            });

            it('Fetch: response type: arraybuffer', async function() {
                var method = 'GET';
                var url = 'https://via.placeholder.com/720';

                var response = await fetch(url, {
                    method
                });

                var responseArrayBuffer =  await response.arrayBuffer();

                expect(responseArrayBuffer).toBeDefined();
                expect(responseArrayBuffer instanceof ArrayBuffer).toBe(true);
                expect(responseArrayBuffer.byteLength).toBeDefined();
                expect(responseArrayBuffer.byteLength).toBeGreaterThan(0);
            });

        });

        describe('Fetch authentification types', function() {

            it('Fetch Basic auth: GET, positive case - valid credentials', async function() {
                var username = 'user';
                var password = 'password';
                var base64BasicCredentials = 'dXNlcjpwYXNzd29yZA==';
                var url = `https://httpbin.org/basic-auth/${username}/${password}`;

                var response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${base64BasicCredentials}`
                    }
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);

                var responseJson = await response.json();

                expect(responseJson.authenticated).toBe(true);
                expect(responseJson.user).toBe(username);
            });

            it('Fetch Basic auth: GET, negative case - invalid credentials', async function() {
                var username = 'user';
                var password = 'password';
                var url = `https://httpbin.org/basic-auth/${username}/${password}`;

                var response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${username}:${password}`
                    }
                });

                expect(response.status).toBe(401);
                expect(response.ok).toBe(false);

                var responseText = await response.text();

                expect(responseText).toBe('');
            });

            // TODO: enable this test after authentication is implemented
            xit('Fetch Digest auth: GET, positive case - valid credentials', async function() {
                var requestMethod = 'GET';
                var url = 'http://gmaiis01.gma.sw.rim.net:8003/';
                var username = 'goodadmin';
                var password = 'password';

                var responseNotAuthorized = await fetch(url, { method: requestMethod });
                var digestResponseHeader = responseNotAuthorized.headers.get('Www-Authenticate');

                expect(responseNotAuthorized.status).toBe(401);
                expect(responseNotAuthorized.ok).toBe(false);
                expect(digestResponseHeader).toContain('Digest');

                var digest = new Digest(username, password, requestMethod);
                var digestRequestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

                var response = await fetch(url, {
                    method: requestMethod,
                    headers: {
                        'Authorization': digestRequestHeader
                    }
                });

                expect(response.status).toBe(200);
                expect(response.ok).toBe(true);
            });

            // TODO: enable this test after authentication is implemented
            xit('Fetch Digest auth: GET, negative case - invalid credentials', async function() {
                var requestMethod = 'GET';
                var url = 'http://gmaiis01.gma.sw.rim.net:8003/';
                var username = 'wrong_username';
                var password = 'wrong_password';

                var responseNotAuthorized = await fetch(url, { method: requestMethod });
                var digestResponseHeader = responseNotAuthorized.headers.get('Www-Authenticate');

                expect(responseNotAuthorized.status).toBe(401);
                expect(responseNotAuthorized.ok).toBe(false);
                expect(digestResponseHeader).toContain('Digest');

                var digest = new Digest(username, password, requestMethod);
                var digestRequestHeader = digest.generateDigestHeader(digestResponseHeader, '/');

                var response = await fetch(url, {
                    method: requestMethod,
                    headers: {
                        'Authorization': digestRequestHeader
                    }
                });

                expect(response.status).toBe(401);
                expect(response.ok).toBe(false);
            });

            // TODO: enable this test after authentication is implemented
            xit('Fetch NTLM auth: GET, positive case - valid credentials', async function() {
                var url = 'http://gd-lviv04.gd.sw.rim.net:8085/';
                var host = 'gd-lviv04.gd.sw.rim.net:8085';
                var username = 'gdadmin';
                var password = 'gdadmin';
                var domain = 'gd';
                var requestMethod = 'GET';
                var requestHeaders = {
                    'pragma': 'no-cache',
                    'cache-control': 'no-cache',
                };

                var responseNotAuthorized = await fetch(url, { method: requestMethod });
                var headerNotAuthorized = responseNotAuthorized.headers.get('Www-Authenticate');

                expect(responseNotAuthorized.status).toBe(401);
                expect(responseNotAuthorized.ok).toBe(false);
                expect(headerNotAuthorized).toContain('NTLM');

                // Send NTLM message 1
                Ntlm.setCredentials(domain, username, password);
                var msg1 = Ntlm.createMessage1(host);
                var ntlmResponseMessage1 = await fetch(url, {
                    method: requestMethod,
                    headers: {
                        'Authorization': 'NTLM ' + msg1.toBase64(),
                        ...requestHeaders
                    }
                });
                var ntlmResponseHeader = ntlmResponseMessage1.headers.get('Www-Authenticate');

                expect(ntlmResponseMessage1.status).toBe(401);
                expect(ntlmResponseMessage1.ok).toBe(false);
                expect(ntlmResponseHeader).toContain('NTLM');

                // Handle NTLM message 2 (received response from NTLM server)
                var challenge = Ntlm.getChallenge(ntlmResponseHeader);

                // Send NTLM message 3
                var msg3 = Ntlm.createMessage3(challenge, host);
                var ntlmResponseMessage3 = await fetch(url, {
                    method: requestMethod,
                    headers: {
                        'Authorization': 'NTLM ' + msg3.toBase64(),
                        ...requestHeaders
                    }
                });

                expect(ntlmResponseMessage3.status).toBe(200);
                expect(ntlmResponseMessage3.ok).toBe(true);
            });

        });

    });

});
