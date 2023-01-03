/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * GDSocket plugin functional tests
 */

describe('GDSocket plugin', function() {

    var socket_url = "httpbin.org";
    var socket_port = 80;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('Check GDSocket plugin installation', function() {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(window.plugins.GDSocket).toBeDefined();
    });

    it('Check GDSocket creation', function() {
        var socket = window.plugins.GDSocket.createSocket(socket_url, socket_port);

        expect(socket).toBeDefined();
        expect(socket).not.toBeNull();

        expect(socket.url).toBe(socket_url);
        expect(socket.port).toBe(socket_port);
    });

    it('Check GDSocket connect without response function', function(done) {
        var socket = window.plugins.GDSocket.createSocket(socket_url, socket_port);

        try {
            socket.connect();
            // fails if there is no error
            expect(false).toBe(true);
        } catch (err) {
            expect(err.message).toBe("onSocketResponse callback handler for GDSocket object is null.");
            done();
        }
    });

    it('Check multiple sequential socket connections', function(done) {
        var socket1 = window.plugins.GDSocket.createSocket(socket_url, socket_port, false, "string", false);
        var socket2 = window.plugins.GDSocket.createSocket(socket_url, socket_port, false, "string", false);
        var socket3 = window.plugins.GDSocket.createSocket(socket_url, socket_port, false, "string", false);

        var opened = 0;
        var closed = 0;

        var onSocketResponse = function(obj) {
            expect(obj).toBeDefined();

            var socketResponse = this.parseSocketResponse(obj);

            expect(socketResponse.socketID).toBeDefined();
            expect(socketResponse.responseType).toBeDefined();

            switch (socketResponse.responseType) {
                case "open":
                    opened++;

                    this.send(socketResponse.socketID, "GET /get HTTP/1.1\r\nHost:" + socket_url + ":" + socket_port + "\r\nConnection: close\r\n\r\n");

                    break;
                case "message":
                    var httpRespObj = this.parseHttpResponse(socketResponse.responseData);

                    expect(httpRespObj.statusCode).toBe(200);
                    expect(httpRespObj.status).toBeDefined();
                    expect(httpRespObj.responseBody).toBeDefined();
                    expect(httpRespObj.responseHeaders).toBeDefined();

                    this.close(socketResponse.socketID);

                    break;
                case "error":

                    expect(true).toBe(false);
                    done();
                    break;
                case "close":
                    expect(socketResponse.responseData).toBe("Socket connection closed");
                    closed++;
                    if (closed === 3 && opened === 3) {
                        done();
                    }
                    break;
                default:
                    expect(true).toBe(false);
                    done();
                    break;
            }
        };

        var onSocketError = function(err) {
            expect(true).toBe(false);
            done();
        };

        socket1.onSocketResponse = onSocketResponse.bind(socket1);
        socket1.onSocketError = onSocketError;

        socket2.onSocketResponse = onSocketResponse.bind(socket2);
        socket2.onSocketError = onSocketError;

        socket3.onSocketResponse = onSocketResponse.bind(socket3);
        socket3.onSocketError = onSocketError;

        socket1.connect();
        socket2.connect();
        socket3.connect();

    });

    it('Send HTTP request using GDSocket, GET, text/html - positive case', function(done) {
        var aSocket = window.plugins.GDSocket.createSocket(socket_url, socket_port, false, 'string', false);

        aSocket.onSocketResponse = function(obj) {
            expect(obj).toBeDefined();

            var socketResponse = aSocket.parseSocketResponse(obj);

            expect(socketResponse.socketID).toBeDefined();
            expect(socketResponse.responseType).toBeDefined();

            switch (socketResponse.responseType) {
                case "open":
                    var httpRequest = "GET /get HTTP/1.1\r\n" +
                        "Host: " + socket_url + ":" + socket_port + "\r\n" +
                        "Content-Type: text/html; charset=utf-8\r\n" +
                        "Connection: close\r\n" +
                        "\r\n";

                    aSocket.send(socketResponse.socketID, httpRequest);
                    break;

                case "message":
                    var httpRespObj = aSocket.parseHttpResponse(socketResponse.responseData);
                    expect(httpRespObj.statusCode).toBe(200);
                    expect(httpRespObj.status).toBeDefined();
                    expect(httpRespObj.responseBody).toBeDefined();
                    expect(httpRespObj.responseHeaders).toBeDefined();

                    for (var i = 0; i < httpRespObj.responseHeaders.length; i++) {
                        if (httpRespObj.responseHeaders[i]["Content-Type"]) {
                            expect(httpRespObj.responseHeaders[i]["Content-Type"]).toBe("application/json");
                        }
                    }

                    aSocket.close(socketResponse.socketID);

                    break;

                case "error":
                    expect(true).toBe(false);
                    done();
                    break;

                case "close":
                    expect(socketResponse.responseData).toBe("Socket connection closed");
                    done();
                    break;

                default:
                    expect(true).toBe(false);
                    done();
            }
        };

        // error
        aSocket.onSocketError = function(error) {
            expect(true).toBe(false);
            done();
        };

        // connect!
        aSocket.connect();
    });

    it('Send HTTP request using GDSocket, GET, application/json - positive case', function(done) {
        var socket = window.plugins.GDSocket.createSocket(socket_url, socket_port, false, 'string', false);

        var onSocketResponseFunction = function(obj) {
            expect(obj).toBeDefined();

            var socketResponse = socket.parseSocketResponse(obj);

            expect(socketResponse.socketID).toBeDefined();
            expect(socketResponse.responseType).toBeDefined();

            // Attempt to cleanup by closing the socket.
            switch (socketResponse.responseType) {
                case "open":
                    var httpRequest = "GET /get HTTP/1.1\r\n" +
                        "Host: " + socket_url + ":" + socket_port + "\r\n" +
                        "Connection: close\r\n" +
                        "\r\n";

                    socket.send(socketResponse.socketID, httpRequest);

                    break;
                case "message":
                    var httpRespObj = socket.parseHttpResponse(socketResponse.responseData);
                    expect(httpRespObj.statusCode).toBe(200);
                    expect(httpRespObj.status).toBeDefined();

                    for (var i = 0; i < httpRespObj.responseHeaders.length; i++) {
                        if (httpRespObj.responseHeaders[i]["Content-Type"]) {
                            expect(httpRespObj.responseHeaders[i]["Content-Type"]).toBe("application/json");
                        }
                    }

                    expect(httpRespObj.responseBody).toBeDefined();

                    socket.close(socketResponse.socketID);

                    break;

                case "error":
                    expect(true).toBe(false);
                    done();
                    break;

                case "close":
                    expect(socketResponse.responseData).toBe("Socket connection closed");
                    done();
                    break;

                default:
                    expect(true).toBe(false);
                    done();
            }
        };

        socket.onSocketResponse = onSocketResponseFunction;
        socket.onSocketError = function(error) {
            expect(true).toBe(false);
            done();
        };

        socket.connect();
    });

    it('Send HTTP request using GDSocket, POST, application/json - positive case', function(done) {
        var socket = window.plugins.GDSocket.createSocket(socket_url, socket_port, false, 'string', false);

        var onSocketResponseFunction = function(obj) {
            expect(obj).toBeDefined();

            var socketResponse = socket.parseSocketResponse(obj);

            expect(socketResponse.socketID).toBeDefined();
            expect(socketResponse.responseType).toBeDefined();

            // Attempt to cleanup by closing the socket.
            switch (socketResponse.responseType) {
                case "open":
                    var httpRequest = "POST /post HTTP/1.1\r\n" +
                        "Host: " + socket_url + ":" + socket_port + "\r\n" +
                        "Content-Type: application/json\r\n" +
                        "Content-Length: 0\r\n" +
                        "Connection: close\r\n" +
                        "\r\n";

                    socket.send(socketResponse.socketID, httpRequest);

                    break;
                case "message":

                    var httpRespObj = socket.parseHttpResponse(socketResponse.responseData);

                    expect(httpRespObj.statusCode).toBe(200);
                    expect(httpRespObj.status).toBeDefined();
                    expect(httpRespObj.responseBody).toBeDefined();
                    expect(httpRespObj.responseHeaders).toBeDefined();

                    for (var i = 0; i < httpRespObj.responseHeaders.length; i++) {
                        if (httpRespObj.responseHeaders[i]["Content-Type"]) {
                            expect(httpRespObj.responseHeaders[i]["Content-Type"]).toBe("application/json");
                        }
                    }

                    expect(httpRespObj.responseBody).toBeDefined();

                    socket.close(socketResponse.socketID);

                    break;

                case "error":
                    expect(true).toBe(false);
                    done();
                    break;

                case "close":
                    expect(socketResponse.responseData).toBe("Socket connection closed");
                    done();
                    break;

                default:
                    expect(true).toBe(false);
                    done();
            }
        };

        socket.onSocketResponse = onSocketResponseFunction;
        socket.onSocketError = function(error) {
            expect(true).toBe(false);
            done();
        };

        socket.connect();
    });

    it('Send binary request using GDSocket, positive case', function(done) {
        var socket = window.plugins.GDSocket.createSocket(socket_url, socket_port, false, 'binary', true);
        var allResponse = new Uint8Array(0);

        // create random binary test data
        var testData = new Uint8Array(613);
        for (var i = 0; i < testData.length; i++) {
            testData[i] = Math.round(Math.random()*256);
        }

        var onSocketResponseFunction = function(obj) {
            expect(obj).toBeDefined();

            var socketResponse = socket.parseSocketResponse(obj);

            expect(socketResponse.socketID).toBeDefined();
            expect(socketResponse.responseType).toBeDefined();

            switch (socketResponse.responseType) {
                case "open":
                    var requestHeader = "PUT /put HTTP/1.1\r\n" +
                        "Host: " + socket_url + ":" + socket_port + "\r\n" +
                        "Content-Type: application/octet-stream\r\n" +
                        "Content-Length: " + testData.length + "\r\n" +
                        "Connection: close\r\n" +
                        "\r\n";

                    var httpRequest = new Uint8Array(requestHeader.length + testData.length);
                    httpRequest.set(new TextEncoder("utf-8").encode(requestHeader), 0);
                    httpRequest.set(testData, requestHeader.length);

                    socket.send(socketResponse.socketID, httpRequest);
                    break;

                case "message":
                    for (var i = 0; i < socketResponse.responseData.length; i++) {
                        data = socketResponse.responseData[i];

                        var newAllResponse = new Uint8Array(allResponse.length + data.length);
                        newAllResponse.set(allResponse, 0);
                        newAllResponse.set(data, allResponse.length);
                        allResponse = newAllResponse;
                    }
                    break;

                case "error":
                    expect(true).toBe(false);
                    done();
                    break;

                case "close":
                    var httpRespObj = socket.parseHttpResponse(new TextDecoder("utf-8").decode(allResponse));

                    expect(httpRespObj.statusCode).toBe(200);
                    expect(httpRespObj.status).toBeDefined();
                    expect(httpRespObj.responseBody).toBeDefined();
                    expect(httpRespObj.responseHeaders).toBeDefined();

                    socket.close(socketResponse.socketID);
                    expect(socketResponse.responseData).toBe("Socket connection closed");
                    done();
                    break;

                default:
                    expect(true).toBe(false);
                    done();
            }
        };

        socket.onSocketResponse = onSocketResponseFunction;
        socket.onSocketError = function(error) {
            expect(true).toBe(false);
            done();
        };

        socket.connect();
    });

    it('Check GDSocket connect and close', function(done) {
        var socket = window.plugins.GDSocket.createSocket(socket_url, socket_port);

        var onSocketResponseFunction = function(obj) {
            expect(obj).toBeDefined();

            var socketResponse = socket.parseSocketResponse(obj);

            expect(socketResponse.socketID).toBeDefined();
            expect(socketResponse.responseType).toBeDefined();

            // Attempt to cleanup by closing the socket.
            switch (socketResponse.responseType) {
                case "open":
                    socket.close(socketResponse.socketID);
                    break;
                case "message":
                    expect(true).toBe(false);
                    done();
                    break;
                case "error":
                    expect(true).toBe(false);
                    done();
                    break;
                case "close":
                    expect(socketResponse.responseData).toBe("Socket connection closed");
                    done();
                    break;
                default:
                    expect(true).toBe(false);
                    done();
                    break;
            }
        };

        socket.onSocketResponse = onSocketResponseFunction;
        socket.onSocketError = function() {
            expect(true).toBe(false);
            done();
        };

        socket.connect();
    });

    it('Check connect to invalid host', function(done) {
        var url = "NoHost321.arg"; // BAD HOST NAME
        var port = 8101;

        var socket = window.plugins.GDSocket.createSocket(url, port);

        var onSocketResponseFunction = function(obj) {
            expect(obj).toBeDefined();

            var socketResponse = socket.parseSocketResponse(obj);

            expect(socketResponse.socketID).toBeDefined();
            expect(socketResponse.responseType).toBeDefined();

            switch (socketResponse.responseType) {
                case "error":
                    expect(socketResponse.responseData == "Connection timed out" ||
                        socketResponse.responseData == "Host is unresolved: " + url).toBe(true);

                    done();
                    break;
                default:
                    expect(true).toBe(false);
                    done();
                    break;
            }
        };

        socket.onSocketResponse = onSocketResponseFunction;
        socket.onSocketError = function(obj) {
            var socketResponse = socket.parseSocketResponse(obj);

            expect(socketResponse.responseType).toBe("error");
            expect(socketResponse.responseData == "Connection timed out" ||
                        socketResponse.responseData == "Host is unresolved: " + url).toBe(true);

            done();
        };

        socket.connect();
    });
});
