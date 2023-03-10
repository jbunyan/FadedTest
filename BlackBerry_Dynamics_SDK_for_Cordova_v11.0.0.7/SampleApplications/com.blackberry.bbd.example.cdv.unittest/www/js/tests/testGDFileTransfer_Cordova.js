/*
*
* Copyright 2022 BlackBerry Ltd.
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*
*/

/* global exports, cordova, FileTransfer, FileTransferError, FileUploadOptions, LocalFileSystem, WinJS */

/* jshint jasmine: true */

"use strict";

describe('FileTransfer API', function () {
    // constants
    var ONE_SECOND = 1000; // in milliseconds
    var GRACE_TIME_DELTA = 600; // in milliseconds
    var DEFAULT_FILESYSTEM_SIZE = 1024 * 50; // filesystem size in bytes
    var UNKNOWN_HOST = "http://foobar.apache.org";
    var DOWNLOAD_TIMEOUT = 60 * ONE_SECOND;
    var LONG_TIMEOUT = 60 * ONE_SECOND;
    var UPLOAD_TIMEOUT = 60 * ONE_SECOND;
    var ABORT_DELAY = 100; // for abort() tests
    var LATIN1_SYMBOLS = '¥§©ÆÖÑøøø¼';
    var DATA_URI_PREFIX = "data:image/png;base64,";
    var DATA_URI_CONTENT = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
    var DATA_URI_CONTENT_LENGTH = 85; // bytes. (This is the raw file size: used https://en.wikipedia.org/wiki/File:Red-dot-5px.png from https://en.wikipedia.org/wiki/Data_URI_scheme)
    var RETRY_COUNT = 100; // retry some flaky tests (yes, THIS many times, due to Heroku server instability)
    var RETRY_INTERVAL = 200;

    // upload test server address
    // NOTE:
    //      more info at https://github.com/apache/cordova-labs/tree/cordova-filetransfer
    // Will get it from the config
    // you can specify it as a 'FILETRANSFER_SERVER_ADDRESS' variable upon test plugin installation
    // or change the default value in plugin.xml
    var SERVER = "";
    var SERVER_WITH_CREDENTIALS = "";

    // flags
    var isWindows = cordova.platformId === "windows8" || cordova.platformId === "windows";
    var isWindowsPhone81 = isWindows && WinJS.Utilities.isPhone;
    var isWP8 = cordova.platformId === "windowsphone";
    var isBrowser = cordova.platformId === "browser";
    var isIE = isBrowser && navigator.userAgent.indexOf("Trident") >= 0;
    var isIos = cordova.platformId === "ios";
    var isIot = cordova.platformId === "android" && navigator.userAgent.indexOf("iot") >= 0;
    var isAndroid = cordova.platformId === "android";
    var isBlackBerryPlugin = true;

    // tests
    describe("FileTransferError", function () {

        it("should exist", function () {
            expect(FileTransferError).toBeDefined();
        });

        it("should be constructable", function () {
            var transferError = new FileTransferError();
            expect(transferError).toBeDefined();
        });

        it("filetransfer.spec.3 should expose proper constants", function () {

            expect(FileTransferError.FILE_NOT_FOUND_ERR).toBeDefined();
            expect(FileTransferError.INVALID_URL_ERR).toBeDefined();
            expect(FileTransferError.CONNECTION_ERR).toBeDefined();
            expect(FileTransferError.ABORT_ERR).toBeDefined();
            expect(FileTransferError.NOT_MODIFIED_ERR).toBeDefined();

            expect(FileTransferError.FILE_NOT_FOUND_ERR).toBe(1);
            expect(FileTransferError.INVALID_URL_ERR).toBe(2);
            expect(FileTransferError.CONNECTION_ERR).toBe(3);
            expect(FileTransferError.ABORT_ERR).toBe(4);
            expect(FileTransferError.NOT_MODIFIED_ERR).toBe(5);
        });
    });

    describe("FileUploadOptions", function () {

        it("should exist", function () {
            expect(FileUploadOptions).toBeDefined();
        });

        it("should be constructable", function () {
            var transferOptions = new FileUploadOptions();
            expect(transferOptions).toBeDefined();
        });
    });

    describe("FileTransfer", function () {
        // custom properties:
        // - this.persistentRoot;
        // - this.tempRoot;

        // named callbacks
        var unexpectedCallbacks = {
            httpFail:          function () {},
            httpWin:           function () {},
            fileSystemFail:    function () {},
            fileSystemWin:     function () {},
            fileOperationFail: function () {},
            fileOperationWin:  function () {},
        };

        var expectedCallbacks = {
            unsupportedOperation: function (response) {
                console.log("spec called unsupported functionality; response:", response);
            },
        };

        // helpers
        var deleteFile = function (fileSystem, name, done) {
            fileSystem.getFile(name, null,
                function (fileEntry) {
                    fileEntry.remove(
                        function () {
                            done();
                        },
                        function () {
                            throw new Error("failed to delete: '" + name + "'");
                        }
                    );
                },
                function () {
                    done();
                }
            );
        };

        var writeFile = function (fileSystem, name, content, success, done) {
            var fileOperationFail = function() {
                unexpectedCallbacks.fileOperationFail();
                done();
            };

            fileSystem.getFile(name, { create: true },
                function (fileEntry) {
                    fileEntry.createWriter(function (writer) {

                        writer.onwrite = function () {
                            success(fileEntry);
                        };

                        writer.onabort = function (evt) {
                            throw new Error("aborted creating test file '" + name + "': " + evt);
                        };

                        writer.error = function (evt) {
                            throw new Error("aborted creating test file '" + name + "': " + evt);
                        };

                        if (cordova.platformId === "browser") {
                            var blob = new Blob([content + "\n"], { type: "text/plain" });
                            writer.write(blob);
                        } else {
                            writer.write(content + "\n");
                        }

                    }, fileOperationFail);
                },
                function () {
                    throw new Error("could not create test file '" + name + "'");
                }
            );
        };

        // according to documentation, wp8 does not support onProgress:
        // https://github.com/apache/cordova-plugin-file-transfer/blob/master/doc/index.md#supported-platforms
        var wp8OnProgressHandler = function () {};

        var defaultOnProgressHandler = function (event) {
            if (event.lengthComputable) {
                expect(event.loaded).toBeGreaterThan(1);
                expect(event.total).toBeGreaterThan(0);
                expect(event.total).not.toBeLessThan(event.loaded);
                expect(event.lengthComputable).toBe(true, "lengthComputable");
            } else {
                // In IE, when lengthComputable === false, event.total somehow is equal to 2^64
                if (isIE) {
                    expect(event.total).toBe(Math.pow(2, 64));
                } else {
                    // iOS returns -1, and other platforms return 0
                    expect(event.total).toBeLessThan(1);
                }
            }
        };

        var getMalformedUrl = function () {
            if (cordova.platformId === "android" || cordova.platformId === "amazon-fireos") {
                // bad protocol causes a MalformedUrlException on Android
                return "httpssss://example.com";
            } else {
                // iOS doesn't care about protocol, space in hostname causes error
                return "httpssss://exa mple.com";
            }
        };

        var setServerAddress = function (address) {
            SERVER = address;
            SERVER_WITH_CREDENTIALS = SERVER.replace('http://', 'http://cordova_user:cordova_password@');
        };

        // NOTE:
        //      there are several beforeEach calls, one per async call; since calling done()
        //      signifies a completed async call, each async call needs its own done(), and
        //      therefore its own beforeEach
        beforeEach(function (done) {
            var specContext = this;

            window.requestFileSystem(LocalFileSystem.PERSISTENT, DEFAULT_FILESYSTEM_SIZE,
                function (fileSystem) {
                    specContext.persistentRoot = fileSystem.root;
                    done();
                },
                function () {
                    throw new Error("Failed to initialize persistent file system.");
                }
            );
        });

        beforeEach(function (done) {
            var specContext = this;

            window.requestFileSystem(LocalFileSystem.TEMPORARY, DEFAULT_FILESYSTEM_SIZE,
                function (fileSystem) {
                    specContext.tempRoot = fileSystem.root;
                    done();
                },
                function () {
                    throw new Error("Failed to initialize temporary file system.");
                }
            );
        });

        // spy on all named callbacks
        beforeEach(function() {

            // ignore the actual implementations of the unexpected callbacks
            for (var callback in unexpectedCallbacks) {
                if (unexpectedCallbacks.hasOwnProperty(callback)) {
                    spyOn(unexpectedCallbacks, callback);
                }
            }

            // but run the implementations of the expected callbacks
            for (callback in expectedCallbacks) { // jshint ignore: line
                if (expectedCallbacks.hasOwnProperty(callback)) {
                    spyOn(expectedCallbacks, callback).and.callThrough();
                }
            }
        });

        // at the end, check that none of the unexpected callbacks got called,
        // and act on the expected callbacks
        afterEach(function() {
            // custom properties:
            // - this.persistentRoot;
            // - this.tempRoot;

            for (var callback in unexpectedCallbacks) {
                if (unexpectedCallbacks.hasOwnProperty(callback)) {
                    expect(unexpectedCallbacks[callback]).not.toHaveBeenCalled();
                }
            }

            if (expectedCallbacks.unsupportedOperation.calls.any()) {
                pending();
            }
        });

        it ("util spec: get file transfer server url", function () {
            try {
                setServerAddress('http://sheltered-retreat-43956.herokuapp.com');
            } catch (ex) {
                console.error('Unable to load file transfer server url: ' + ex);
                console.error('Note: if you are testing this on cordova-ios with cordova-plugin-wkwebview-engine, that may be why you are getting this error. See https://issues.apache.org/jira/browse/CB-10144.');
                fail(ex);
            }
        });

        it("should initialise correctly", function() {
            expect(this.persistentRoot).toBeDefined();
            expect(this.tempRoot).toBeDefined();
        });

        it("should exist", function () {
            expect(FileTransfer).toBeDefined();
        });

        it("filetransfer.spec.1 should be constructable", function () {
            var transfer = new FileTransfer();
            expect(transfer).toBeDefined();
        });

        it("filetransfer.spec.2 should expose proper functions", function () {

            var transfer = new FileTransfer();

            expect(transfer.upload).toBeDefined();
            expect(transfer.download).toBeDefined();

            expect(transfer.upload).toEqual(jasmine.any(Function));
            expect(transfer.download).toEqual(jasmine.any(Function));
        });

        describe("methods", function() {
            // custom properties:
            // - this.transfer
            // - this.root
            // - this.fileName
            // - this.localFilePath

            beforeEach(function() {

                this.transfer = new FileTransfer();

                // assign onprogress handler
                this.transfer.onprogress = isWP8 ? wp8OnProgressHandler : defaultOnProgressHandler;

                // spy on the onprogress handler, but still call through to it
                spyOn(this.transfer, "onprogress").and.callThrough();

                this.root          = this.persistentRoot;
                this.fileName      = "testFile.txt";
                this.localFilePath = this.root.toURL() + this.fileName;
            });

            // NOTE:
            //      if download tests are failing, check the
            //      URL white list for the following URLs:
            //         - 'httpssss://example.com'
            //         - 'apache.org', with subdomains="true"
            //         - 'cordova-filetransfer.jitsu.com'
            describe("download", function () {

                // helpers
                var verifyDownload = function (fileEntry, specContext) {
                    expect(fileEntry.name).toBe(specContext.fileName);
                };

                // delete the downloaded file
                afterEach(function (done) {
                    deleteFile(this.root, this.fileName, done);
                });

                it("ensures that test file does not exist", function (done) {
                    deleteFile(this.root, this.fileName, done);
                });

                it("filetransfer.spec.4 should download a file", function (done) {
                    var fileURL = SERVER + "/robots.txt";
                    var specContext = this;

                    var fileWin = function (blob) {

                        if (specContext.transfer.onprogress.calls.any()) {
                            var lastProgressEvent = specContext.transfer.onprogress.calls.mostRecent().args[0];
                            expect(lastProgressEvent.loaded).not.toBeGreaterThan(blob.size);
                        } else {
                            console.log("no progress events were emitted");
                        }

                        done();
                    };

                    var fileSystemFail = function() {
                        unexpectedCallbacks.fileSystemFail();
                        done();
                    };

                    var downloadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    var downloadWin = function (entry) {

                        verifyDownload(entry, specContext);

                        // verify the FileEntry representing this file
                        entry.file(fileWin, fileSystemFail);
                    };

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, downloadFail);
                }, DOWNLOAD_TIMEOUT * 10); // to give Heroku server some time to wake up

                it("filetransfer.spec.4.1 should download a file using target name with space", function (done) {

                    var fileURL = SERVER + "/robots.txt";
                    this.fileName = "test file.txt";
                    this.localFilePath = this.root.toURL() + this.fileName;

                    var specContext = this;

                    var fileWin = function (blob) {

                        if (specContext.transfer.onprogress.calls.any()) {
                            var lastProgressEvent = specContext.transfer.onprogress.calls.mostRecent().args[0];
                            expect(lastProgressEvent.loaded).not.toBeGreaterThan(blob.size);
                        } else {
                            console.log("no progress events were emitted");
                        }

                        done();
                    };

                    var fileSystemFail = function() {
                        unexpectedCallbacks.fileSystemFail();
                        done();
                    };

                    var downloadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    var downloadWin = function (entry) {

                        verifyDownload(entry, specContext);

                        // verify the FileEntry representing this file
                        entry.file(fileWin, fileSystemFail);
                    };

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, downloadFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.5 should download a file using http basic auth", function (done) {
                    var fileURL = SERVER_WITH_CREDENTIALS + "/download_basic_auth";
                    var specContext = this;

                    var downloadWin = function (entry) {
                        verifyDownload(entry, specContext);
                        done();
                    };

                    var downloadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, downloadFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.6 should get 401 status on http basic auth failure", function (done) {
                    // NOTE:
                    //      using server without credentials
                    var fileURL = SERVER + "/download_basic_auth";

                    var downloadFail = function (error) {
                        expect(error.http_status).toBe(401);
                        expect(error.http_status).not.toBe(404, "Ensure " + fileURL + " is in the white list");
                        done();
                    };

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.download(fileURL, this.localFilePath, downloadWin, downloadFail, null,
                        {
                            headers: {
                                "If-Modified-Since": "Thu, 19 Mar 2015 00:00:00 GMT"
                            }
                        });
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.7 should download a file using file:// (when hosted from file://) or https://", function (done) {
                    // for Windows platform it's ms-appdata:/// by default, not file://
                    if (isWindows) {
                        pending();
                        return;
                    }

                    // DEVNOTE: after migration to GDWebView protocol is matched to "https://" on Android
                    var fileURL = window.location.protocol + "//" + window.location.pathname.replace(/ /g, "%20");
                    var specContext = this;

                    if (!/^file:/.exec(fileURL) && cordova.platformId !== "blackberry10") {
                        if (cordova.platformId === "windowsphone") {
                            expect(fileURL).toMatch(/^x-wmapp0:/);
                        }
                        done();
                        return;
                    }

                    var downloadWin = function (entry) {
                        verifyDownload(entry, specContext);
                        done();
                    };

                    var downloadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, downloadFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.8 should download a file using https://", function (done) {
                    var fileURL = "https://www.apache.org/licenses/";
                    var specContext = this;

                    var downloadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    var fileOperationFail = function() {
                        unexpectedCallbacks.fileOperationFail();
                        done();
                    };

                    var fileSystemFail = function() {
                        unexpectedCallbacks.fileSystemFail();
                        done();
                    };

                    var fileWin = function (file) {

                        var reader = new FileReader();

                        reader.onerror = fileOperationFail;
                        reader.onload  = function () {
                            expect(reader.result).toMatch(/The Apache Software Foundation/);
                            done();
                        };

                        reader.readAsText(file);
                    };

                    var downloadWin = function (entry) {
                        verifyDownload(entry, specContext);
                        entry.file(fileWin, fileSystemFail);
                    };

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, downloadFail);
                }, isWindows ? LONG_TIMEOUT : DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.11 should call the error callback on abort()", function (done) {
                    var fileURL = "https://downloads.apache.org/cordova/platforms/cordova-amazon-fireos-3.6.3.tgz";
                    fileURL = fileURL + "?q=" + (new Date()).getTime();
                    var specContext = this;

                    var downloadWin = function () {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    var downloadFail = function () {
                        done();
                    }

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, downloadFail);
                    setTimeout(function() {
                        specContext.transfer.abort();
                    }, ABORT_DELAY);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.9 should not leave partial file due to abort", function (done) {
                    var fileURL = "https://downloads.apache.org/cordova/platforms/cordova-amazon-fireos-3.6.3.tgz";
                    var specContext = this;

                    var fileSystemWin = function() {
                        unexpectedCallbacks.fileSystemWin();
                        done();
                    };

                    var fileSystemFail = function() {
                        done();
                    };

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    var downloadFail = function (error) {

                        var result = (error.code === FileTransferError.ABORT_ERR || error.code === FileTransferError.CONNECTION_ERR)? true: false;
                        if (!result) {
                            fail("Expected " + error.code + " to be " + FileTransferError.ABORT_ERR + " or " + FileTransferError.CONNECTION_ERR);
                        }
                        expect(specContext.transfer.onprogress).toHaveBeenCalled();

                        // check that there is no file
                        specContext.root.getFile(specContext.fileName, null, fileSystemWin, fileSystemFail);
                    };

                    // abort at the first onprogress event
                    specContext.transfer.onprogress = function (event) {
                        if (event.loaded > 0) {
                            specContext.transfer.abort();
                        }
                    };

                    spyOn(specContext.transfer, "onprogress").and.callThrough();

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, downloadFail);
                }, isWindows ? LONG_TIMEOUT : DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.10 should be stopped by abort()", function (done) {
                    var fileURL = "https://downloads.apache.org/cordova/platforms/cordova-amazon-fireos-3.6.3.tgz";
                    fileURL = fileURL + "?q=" + (new Date()).getTime();
                    var specContext = this;

                    expect(specContext.transfer.abort).not.toThrow(); // should be a no-op.

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    var downloadFail = function (error) {

                        expect(error.code).toBe(FileTransferError.ABORT_ERR);

                        // delay calling done() to wait for the bogus abort()
                        setTimeout(done, GRACE_TIME_DELTA * 2);
                    };

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, downloadFail);
                    setTimeout(function() {
                        specContext.transfer.abort();
                    }, ABORT_DELAY);

                    // call abort() again, after a time greater than the grace period
                    setTimeout(function () {
                        expect(specContext.transfer.abort).not.toThrow();
                    }, GRACE_TIME_DELTA);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.12 should get http status on failure", function (done) {
                    var fileURL = SERVER + "/404";

                    var downloadFail = function (error) {

                        expect(error.http_status).not.toBe(401, "Ensure " + fileURL + " is in the white list");
                        expect(error.http_status).toBe(404);

                        // wp8 does not make difference between 404 and unknown host
                        if (isWP8) {
                            expect(error.code).toBe(FileTransferError.CONNECTION_ERR);
                        } else {
                            expect(error.code).toBe(FileTransferError.FILE_NOT_FOUND_ERR);
                        }

                        done();
                    };

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.download(fileURL, this.localFilePath, downloadWin, downloadFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.13 should get http body on failure", function (done) {
                    var fileURL = SERVER + "/404";

                    var downloadFail = function (error) {

                        expect(error.http_status).not.toBe(401, "Ensure " + fileURL + " is in the white list");
                        expect(error.http_status).toBe(404);

                        expect(error.body).toBeDefined();
                        expect(error.body).toMatch("You requested a 404");

                        done();
                    };

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.download(fileURL, this.localFilePath, downloadWin, downloadFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.14 should handle malformed urls", function (done) {
                    var fileURL = getMalformedUrl();

                    var downloadFail = function (error) {

                        // Note: Android needs the bad protocol to be added to the access list
                        // <access origin=".*"/> won't match because ^https?:// is prepended to the regex
                        // The bad protocol must begin with http to avoid automatic prefix
                        expect(error.http_status).not.toBe(401, "Ensure " + fileURL + " is in the white list");
                        expect(error.code).toBe(FileTransferError.INVALID_URL_ERR);

                        done();
                    };

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.download(fileURL, this.localFilePath, downloadWin, downloadFail);
                });

                it("filetransfer.spec.15 should handle unknown host", function (done) {
                    var fileURL = UNKNOWN_HOST;

                    var downloadFail = function (error) {
                        expect(error.code).toBe(FileTransferError.CONNECTION_ERR);
                        done();
                    };

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    // turn off the onprogress handler
                    this.transfer.onprogress = function () {};

                    this.transfer.download(fileURL, this.localFilePath, downloadWin, downloadFail);
                }, isWindows ? LONG_TIMEOUT : DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.16 should handle bad file path", function (done) {
                    var fileURL = SERVER;

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    var downloadFail = function() {
                        done();
                    };

                    this.transfer.download(fileURL, "c:\\54321", downloadWin, downloadFail);
                });

                it("filetransfer.spec.17 progress should work with gzip encoding", function (done) {

                    // lengthComputable false on bb10 when downloading gzip
                    if (cordova.platformId === "blackberry10") {
                        pending();
                        return;
                    }

                    var fileURL = "http://www.apache.org/";
                    var specContext = this;

                    var downloadWin = function (entry) {
                        verifyDownload(entry, specContext);
                        done();
                    };

                    var downloadFail = function () {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin,downloadFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.30 downloaded file entries should have a toNativeURL method", function (done) {
                    if (cordova.platformId === "browser") {
                        pending();
                        return;
                    }

                    var fileURL = SERVER + "/robots.txt";

                    var downloadWin = function (entry) {

                        expect(entry.toNativeURL).toBeDefined();
                        expect(entry.toNativeURL).toEqual(jasmine.any(Function));

                        var nativeURL = entry.toNativeURL();

                        expect(nativeURL).toBeTruthy();
                        expect(nativeURL).toEqual(jasmine.any(String));

                        if (isWindows) {
                            expect(nativeURL.substring(0, 14)).toBe("ms-appdata:///");
                        } else if (isWP8) {
                            expect(nativeURL.substring(0, 1)).toBe("/");
                        } else if (isAndroid && isBlackBerryPlugin) {
                            expect(nativeURL.substring(0, 10)).toBe("cdvfile://");
                        } else {
                            expect(nativeURL.substring(0, 7)).toBe("file://");
                        }

                        done();
                    };

                    var downloadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    this.transfer.download(fileURL, this.localFilePath, downloadWin, downloadFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.28 (compatibility) should be able to download a file using local paths", function (done) {
                    var fileURL = SERVER + "/robots.txt";
                    var specContext = this;

                    var unsupported = function (response) {
                        expectedCallbacks.unsupportedOperation(response);
                        done();
                    };

                    var downloadWin = function (entry) {
                        verifyDownload(entry, specContext);
                        done();
                    };

                    var internalFilePath;
                    if (specContext.root.toInternalURL) {
                        internalFilePath = specContext.root.toInternalURL() + specContext.fileName;
                    } else {
                        internalFilePath = specContext.localFilePath;
                    }

                    var downloadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    // This is an undocumented interface to File which exists only for testing
                    // backwards compatibilty. By obtaining the raw filesystem path of the download
                    // location, we can pass that to transfer.download() to make sure that previously-stored
                    // paths are still valid.
                    cordova.exec(function (localPath) {
                        specContext.transfer.download(fileURL, localPath, downloadWin, downloadFail);
                    }, unsupported, "BBDFile", "_getLocalFilesystemPath", [internalFilePath]);
                });

                it("filetransfer.spec.33 should properly handle 304", function (done) {
                    if (isWP8) {
                        pending();
                        return;
                    }

                    if (isBlackBerryPlugin && isIos) {
                        pending();
                        return;
                    }

                    var downloadFail = function (error) {
                        expect(error.http_status).toBe(304);
                        expect(error.code).toBe(FileTransferError.NOT_MODIFIED_ERR);
                        done();
                    };

                    var downloadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.download(SERVER + '/304', this.localFilePath, downloadWin, downloadFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.35 304 should not result in the deletion of a cached file", function (done) {
                    if (isWP8) {
                        pending();
                        return;
                    }

                    if (isBlackBerryPlugin && isIos) {
                        pending();
                        return;
                    }

                    var specContext = this;

                    var fileOperationFail = function() {
                        unexpectedCallbacks.fileOperationFail();
                        done();
                    };

                    var fileSystemFail = function() {
                        unexpectedCallbacks.fileSystemFail();
                        done();
                    };

                    var httpWin =  function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    var downloadFail = function (error) {
                        expect(error.http_status).toBe(304);
                        expect(error.code).toBe(FileTransferError.NOT_MODIFIED_ERR);

                        specContext.persistentRoot.getFile(specContext.fileName, { create: false },
                            function (entry) {
                                var fileWin = function (file) {
                                    var reader = new FileReader();

                                    reader.onerror = fileOperationFail;
                                    reader.onloadend  = function () {

                                        expect(reader.result).toBeTruthy();
                                        if (reader.result !== null) {
                                            expect(reader.result.length).toBeGreaterThan(0);
                                        }

                                        done();
                                    };

                                    reader.readAsBinaryString(file);
                                };

                                entry.file(fileWin, fileSystemFail);
                            },
                            function (err) {
                                expect("Could not open test file '" + specContext.fileName + "': " + JSON.stringify(err)).not.toBeDefined();
                                done();
                            }
                        );
                    };

                    writeFile(specContext.root, specContext.fileName, 'Temp data', function () {
                        specContext.transfer.download(SERVER + '/304', specContext.localFilePath, httpWin, downloadFail);
                    }, fileOperationFail);
                }, DOWNLOAD_TIMEOUT);

                it("filetransfer.spec.36 should handle non-UTF8 encoded download response", function (done) {
                    // Only iOS is supported: https://issues.apache.org/jira/browse/CB-9840
                    if (!isIos) {
                        pending();
                    }

                    var fileURL = SERVER + '/download_non_utf';
                    var specContext = this;

                    var fileOperationFail = function() {
                        unexpectedCallbacks.fileOperationFail();
                        done();
                    };

                    var fileSystemFail = function() {
                        unexpectedCallbacks.fileSystemFail();
                        done();
                    };

                    var httpFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    var fileWin = function (blob) {

                        if (specContext.transfer.onprogress.calls.any()) {
                            var lastProgressEvent = specContext.transfer.onprogress.calls.mostRecent().args[0];
                            expect(lastProgressEvent.loaded).not.toBeGreaterThan(blob.size);
                        } else {
                            console.log("no progress events were emitted");
                        }

                        expect(blob.size).toBeGreaterThan(0);

                        var reader = new FileReader();

                        reader.onerror = fileOperationFail;
                        reader.onloadend  = function () {
                            expect(reader.result.indexOf(LATIN1_SYMBOLS)).not.toBe(-1);
                            done();
                        };

                        reader.readAsBinaryString(blob);
                    };

                    var downloadWin = function (entry) {

                        verifyDownload(entry, specContext);

                        // verify the FileEntry representing this file
                        entry.file(fileWin, fileSystemFail);
                    };

                    specContext.transfer.download(fileURL, specContext.localFilePath, downloadWin, httpFail);
                }, UPLOAD_TIMEOUT);
            });

            describe("upload", function() {
                // custom properties:
                // - this.uploadParams
                // - this.uploadOptions
                // - this.fileName
                // - this.fileContents
                // - this.localFilePath

                // helpers
                var verifyUpload = function (uploadResult, specContext) {

                    expect(uploadResult.bytesSent).toBeGreaterThan(0);
                    expect(uploadResult.responseCode).toBe(200);

                    var obj = null;
                    try {
                        obj = JSON.parse(uploadResult.response);
                        expect(obj.fields).toBeDefined();
                        expect(obj.fields.value1).toBe("test");
                        expect(obj.fields.value2).toBe("param");
                    } catch (e) {
                        expect(obj).not.toBeNull("returned data from server should be valid json");
                    }

                    expect(specContext.transfer.onprogress).toHaveBeenCalled();
                };

                beforeEach(function(done) {
                    var specContext = this;

                    specContext.fileName               = "fileToUpload.txt";
                    specContext.fileContents           = "upload test file";

                    specContext.uploadParams           = {};
                    specContext.uploadParams.value1    = "test";
                    specContext.uploadParams.value2    = "param";

                    specContext.uploadOptions          = new FileUploadOptions();
                    specContext.uploadOptions.fileKey  = "file";
                    specContext.uploadOptions.fileName = specContext.fileName;
                    specContext.uploadOptions.mimeType = "text/plain";
                    specContext.uploadOptions.params   = specContext.uploadParams;

                    var fileWin = function (entry) {
                        specContext.localFilePath = entry.toURL();
                        done();
                    };

                    var fileFail = function () {
                        done();
                    }

                    // create a file to upload
                    writeFile(specContext.root, specContext.fileName, specContext.fileContents, fileWin, fileFail);
                });

                // delete the uploaded file
                afterEach(function (done) {
                    deleteFile(this.root, this.fileName, done);
                });

                it("filetransfer.spec.18 should be able to upload a file", function (done) {
                    var fileURL = SERVER + "/upload";
                    var specContext = this;

                    var uploadWin = function (uploadResult) {

                        verifyUpload(uploadResult, specContext);

                        if (cordova.platformId === "ios") {
                            expect(uploadResult.headers).toBeDefined("Expected headers to be defined.");
                            expect(uploadResult.headers["Content-Type"]).toBeDefined("Expected content-type header to be defined.");
                        }

                        done();
                    };

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    // NOTE: removing uploadOptions cause Android to timeout
                    specContext.transfer.upload(specContext.localFilePath, fileURL, uploadWin, uploadFail, specContext.uploadOptions);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.19 should be able to upload a file with http basic auth", function (done) {
                    var fileURL = SERVER_WITH_CREDENTIALS + "/upload_basic_auth";
                    var specContext = this;

                    var uploadWin = function (uploadResult) {
                        verifyUpload(uploadResult, specContext);
                        done();
                    };

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    // NOTE: removing uploadOptions cause Android to timeout
                    specContext.transfer.upload(specContext.localFilePath, fileURL, uploadWin, uploadFail, specContext.uploadOptions);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.21 should be stopped by abort()", function (done) {
                    var fileURL = SERVER + "/upload";
                    var specContext = this;

                    var uploadFail = function (e) {
                        expect(e.code).toBe(FileTransferError.ABORT_ERR);

                        // delay calling done() to wait for the bogus abort()
                        setTimeout(done, GRACE_TIME_DELTA * 2);
                    };

                    var uploadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    var fileWin = function () {

                        expect(specContext.transfer.abort).not.toThrow();

                        // NOTE: removing uploadOptions cause Android to timeout
                        specContext.transfer.upload(specContext.localFilePath, fileURL, uploadWin, uploadFail, specContext.uploadOptions);
                        setTimeout(function() {
                            specContext.transfer.abort();
                        }, ABORT_DELAY);

                        setTimeout(function () {
                            expect(specContext.transfer.abort).not.toThrow();
                        }, GRACE_TIME_DELTA);
                    };

                    var fileFail = function () {
                        done();
                    }

                    // windows store and ios are too fast, win is called before we have a chance to abort
                    // so let's get them busy - while not providing an extra load to the slow Android emulators
                    var arrayLength = ((isWindows && !isWindowsPhone81) || isIos) ? 3000000 : isIot ? 150000 : 200000;
                    writeFile(specContext.root, specContext.fileName, new Array(arrayLength).join("aborttest!"), fileWin, fileFail);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.22 should get http status and body on failure", function (done) {
                    var fileURL = SERVER + "/403";
                    var retryCount = 0;
                    var self = this;

                    var uploadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    var uploadFail = function (error) {
                        if (error.http_status === 503 && ++retryCount <= RETRY_COUNT) {
                            // Heroku often gives this error, retry in 1 second
                            console.log('retrying... ' + retryCount);
                            setTimeout(function () {
                                self.transfer.upload(self.localFilePath, fileURL, uploadWin, uploadFail, self.uploadOptions);
                            }, RETRY_INTERVAL);
                        } else {
                            expect(error.http_status).toBe(403);
                            expect(error.http_status).not.toBe(401, "Ensure " + fileURL + " is in the white list");
                            done();
                        }
                    };

                    self.transfer.upload(this.localFilePath, fileURL, uploadWin, uploadFail, this.uploadOptions);
                }, UPLOAD_TIMEOUT * 11);

                it("filetransfer.spec.24 should handle malformed urls", function (done) {
                    var fileURL = getMalformedUrl();

                    var uploadFail = function (error) {
                        expect(error.code).toBe(FileTransferError.INVALID_URL_ERR);
                        expect(error.http_status).not.toBe(401, "Ensure " + fileURL + " is in the white list");
                        done();
                    };

                    var uploadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.upload(this.localFilePath, fileURL, uploadWin, uploadFail, {});
                });

                it("filetransfer.spec.25 should handle unknown host", function (done) {
                    var fileURL = UNKNOWN_HOST;

                    var uploadFail = function (error) {
                        expect(error.code).toBe(FileTransferError.CONNECTION_ERR);
                        expect(error.http_status).not.toBe(401, "Ensure " + fileURL + " is in the white list");
                        done();
                    };

                    var uploadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.upload(this.localFilePath, fileURL, uploadWin, uploadFail, {});
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.25 should handle missing file", function (done) {
                    var fileURL = SERVER + "/upload";

                    var uploadFail = function (error) {
                        expect(error.code).toBe(FileTransferError.FILE_NOT_FOUND_ERR);
                        expect(error.http_status).not.toBe(401, "Ensure " + fileURL + " is in the white list");
                        done();
                    };

                    var uploadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.upload("does_not_exist.txt", fileURL, uploadWin, uploadFail);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.26 should handle bad file path", function (done) {
                    var fileURL = SERVER + "/upload";

                    var uploadFail = function (error) {
                        expect(error.http_status).not.toBe(401, "Ensure " + fileURL + " is in the white list");
                        done();
                    };

                    var uploadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    this.transfer.upload("c:\\54321", fileURL, uploadWin, uploadFail);
                });

                it("filetransfer.spec.27 should be able to set custom headers", function (done) {
                    var fileURL = SERVER + '/upload_echo_headers';
                    var retryCount = 0;
                    var self = this;

                    var uploadWin = function (uploadResult) {

                        expect(uploadResult.bytesSent).toBeGreaterThan(0);
                        expect(uploadResult.responseCode).toBe(200);
                        expect(uploadResult.response).toBeDefined();

                        var responseHtml = decodeURIComponent(uploadResult.response);

                        expect(responseHtml).toMatch(/CustomHeader1[\s\S]*CustomValue1/i);
                        expect(responseHtml).toMatch(/CustomHeader2[\s\S]*CustomValue2[\s\S]*CustomValue3/i, "Should allow array values");

                        done();
                    };

                    var uploadFail = function() {
                        if (++retryCount >= RETRY_COUNT) {
                            unexpectedCallbacks.httpFail();
                            done();
                        } else {
                            console.log('retrying... ' + retryCount);
                            setTimeout(function () {
                                // NOTE: removing uploadOptions will cause Android to timeout
                                self.transfer.upload(self.localFilePath, fileURL, uploadWin, uploadFail, self.uploadOptions);
                            }, RETRY_INTERVAL);
                        }
                    };

                    this.uploadOptions.headers = {
                        "CustomHeader1": "CustomValue1",
                        "CustomHeader2": ["CustomValue2", "CustomValue3"],
                    };

                    // http://whatheaders.com does not support Transfer-Encoding: chunked
                    this.uploadOptions.chunkedMode = false;

                    // NOTE: removing uploadOptions cause Android to timeout
                    this.transfer.upload(this.localFilePath, fileURL, uploadWin, uploadFail, this.uploadOptions);
                }, UPLOAD_TIMEOUT * 11);

                it("filetransfer.spec.29 (compatibility) should be able to upload a file using local paths", function (done) {
                    var fileURL = SERVER + "/upload";
                    var specContext = this;

                    var unsupported = function (response) {
                        expectedCallbacks.unsupportedOperation(response);
                        done();
                    };

                    var uploadWin = function (uploadResult) {
                        verifyUpload(uploadResult, specContext);
                        done();
                    };

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    var internalFilePath;
                    if (specContext.root.toInternalURL) {
                        internalFilePath = specContext.root.toInternalURL() + specContext.fileName;
                    } else {
                        internalFilePath = specContext.localFilePath;
                    }

                    // This is an undocumented interface to File which exists only for testing
                    // backwards compatibilty. By obtaining the raw filesystem path of the download
                    // location, we can pass that to transfer.download() to make sure that previously-stored
                    // paths are still valid.
                    cordova.exec(function (localPath) {
                        specContext.transfer.upload(localPath, fileURL, uploadWin, uploadFail, specContext.uploadOptions);
                    }, unsupported, "BBDFile", "_getLocalFilesystemPath", [internalFilePath]);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.31 should be able to upload a file using PUT method", function (done) {
                    var fileURL = SERVER + "/upload";
                    var specContext = this;

                    var uploadWin = function (uploadResult) {

                        verifyUpload(uploadResult, specContext);

                        if (cordova.platformId === "ios") {
                            expect(uploadResult.headers).toBeDefined("Expected headers to be defined.");
                            expect(uploadResult.headers["Content-Type"]).toBeDefined("Expected content-type header to be defined.");
                        }

                        done();
                    };

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    specContext.uploadOptions.httpMethod = "PUT";

                    // NOTE: removing uploadOptions cause Android to timeout
                    specContext.transfer.upload(specContext.localFilePath, fileURL, uploadWin, uploadFail, specContext.uploadOptions);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.32 should be able to upload a file (non-multipart)", function (done) {
                    var fileURL = SERVER + "/upload";
                    var specContext = this;

                    var uploadWin = function (uploadResult) {

                        expect(uploadResult.bytesSent).toBeGreaterThan(0);
                        expect(uploadResult.responseCode).toBe(200);
                        expect(uploadResult.response).toBeDefined();
                        if (uploadResult.response) {
                            expect(uploadResult.response).toEqual(specContext.fileContents + "\n");
                        }
                        expect(specContext.transfer.onprogress).toHaveBeenCalled();

                        if (cordova.platformId === "ios") {
                            expect(uploadResult.headers).toBeDefined("Expected headers to be defined.");
                            expect(uploadResult.headers["Content-Type"]).toBeDefined("Expected content-type header to be defined.");
                        }

                        done();
                    };

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    // Content-Type header disables multipart
                    specContext.uploadOptions.headers = {
                        "Content-Type": "text/plain"
                    };

                    // NOTE: removing uploadOptions cause Android to timeout
                    specContext.transfer.upload(specContext.localFilePath, fileURL, uploadWin, uploadFail, specContext.uploadOptions);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.34 should not delete a file on upload error", function (done) {

                    var fileURL = SERVER + "/upload";
                    var specContext = this;

                    var uploadFail = function (e) {
                        expect(e.code).toBe(FileTransferError.ABORT_ERR);

                        // check that the file is there
                        specContext.root.getFile(specContext.fileName, null, function(entry) {
                            expect(entry).toBeDefined();
                            // delay calling done() to wait for the bogus abort()
                            setTimeout(done, GRACE_TIME_DELTA * 2);
                        }, function(err) {
                            expect(err).not.toBeDefined(err && err.code);
                            done();
                        });
                    };

                    var uploadWin = function() {
                        unexpectedCallbacks.httpWin();
                        done();
                    };

                    var fileWin = function () {

                        expect(specContext.transfer.abort).not.toThrow();

                        // abort at the first onprogress event
                        specContext.transfer.onprogress = function (event) {
                            if (event.loaded > 0) {
                                specContext.transfer.abort();
                            }
                        };

                        // NOTE: removing uploadOptions cause Android to timeout
                        specContext.transfer.upload(specContext.localFilePath, fileURL, uploadWin, uploadFail, specContext.uploadOptions);
                    };

                    var fileFail = function () {
                        done();
                    }

                    writeFile(specContext.root, specContext.fileName, new Array(100000).join("aborttest!"), fileWin, fileFail);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.37 should handle non-UTF8 encoded upload response", function (done) {
                    // Only iOS is supported: https://issues.apache.org/jira/browse/CB-9840
                    if (!isIos) {
                        pending();
                    }

                    var fileURL = SERVER + '/upload_non_utf';
                    var specContext = this;

                    var uploadWin = function (uploadResult) {

                        verifyUpload(uploadResult, specContext);

                        var obj = null;
                        try {
                            obj = JSON.parse(uploadResult.response);
                            expect(obj.latin1Symbols).toBe(LATIN1_SYMBOLS);
                        } catch (e) {
                            expect(obj).not.toBeNull("returned data from server should be valid json");
                        }

                        if (cordova.platformId === 'ios') {
                            expect(uploadResult.headers).toBeDefined('Expected headers to be defined.');
                            expect(uploadResult.headers['Content-Type']).toBeDefined('Expected content-type header to be defined.');
                        }

                        done();
                    };

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    // NOTE: removing uploadOptions cause Android to timeout
                    specContext.transfer.upload(specContext.localFilePath, fileURL, uploadWin, uploadFail, specContext.uploadOptions);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.38 should be able to upload a file using data: source uri", function (done) {
                    var fileURL = SERVER + "/upload";
                    var specContext = this;

                    var uploadWin = function (uploadResult) {

                        verifyUpload(uploadResult,specContext);

                        var obj = null;
                        try {
                            obj = JSON.parse(uploadResult.response);
                            expect(obj.files.file.size).toBe(DATA_URI_CONTENT_LENGTH);
                        } catch (e) {
                            expect(obj).not.toBeNull("returned data from server should be valid json");
                        }

                        if (cordova.platformId === "ios") {
                            expect(uploadResult.headers).toBeDefined("Expected headers to be defined.");
                            expect(uploadResult.headers["Content-Type"]).toBeDefined("Expected content-type header to be defined.");
                        }

                        done();
                    };

                    var dataUri = DATA_URI_PREFIX + DATA_URI_CONTENT;
                    // NOTE: removing uploadOptions cause Android to timeout
                    specContext.transfer.upload(dataUri, fileURL, uploadWin, function (err) {
                        console.error('err: ' + JSON.stringify(err));
                        expect(err).not.toBeDefined();
                        done();
                    }, specContext.uploadOptions);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.39 should be able to upload a file using data: source uri (non-multipart)", function (done) {
                    var fileURL = SERVER + "/upload";

                    var uploadWin = function (uploadResult) {

                        expect(uploadResult.responseCode).toBe(200);
                        expect(uploadResult.bytesSent).toBeGreaterThan(0);

                        if (cordova.platformId === "ios") {
                            expect(uploadResult.headers).toBeDefined("Expected headers to be defined.");
                            expect(uploadResult.headers["Content-Type"]).toBeDefined("Expected content-type header to be defined.");
                        }

                        done();
                    };

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    // Content-Type header disables multipart
                    this.uploadOptions.headers = {
                        "Content-Type": "image/png"
                    };

                    var dataUri = DATA_URI_PREFIX + DATA_URI_CONTENT;
                    // NOTE: removing uploadOptions cause Android to timeout
                    this.transfer.upload(dataUri, fileURL, uploadWin, uploadFail, this.uploadOptions);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.40 should not fail to upload a file using data: source uri when the data is empty", function (done) {
                    var fileURL = SERVER + "/upload";

                    var dataUri = DATA_URI_PREFIX;

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    var uploadSuccess = function() {
                        done();
                    }

                    // NOTE: removing uploadOptions cause Android to timeout
                    this.transfer.upload(dataUri, fileURL, uploadSuccess, uploadFail, this.uploadOptions);
                }, UPLOAD_TIMEOUT);

                it("filetransfer.spec.41 should not fail to upload a file using data: source uri when the data is empty (non-multipart)", function (done) {
                    if (isIos) {
                        // iOS does not support uploads of an empty file with __chunkedMode=true__ and `multipartMode=false`:
                        // request body will be empty in this case instead of 0\n\n.
                        pending();
                    }
                    var fileURL = SERVER + "/upload";

                    // Content-Type header disables multipart
                    this.uploadOptions.headers = {
                        "Content-Type": "image/png"
                    };

                    // turn off the onprogress handler
                    this.transfer.onprogress = function () { };

                    var dataUri = DATA_URI_PREFIX;

                    var uploadFail = function() {
                        unexpectedCallbacks.httpFail();
                        done();
                    };

                    var uploadSuccess = function() {
                        done();
                    }

                    // NOTE: removing uploadOptions cause Android to timeout
                    this.transfer.upload(dataUri, fileURL, uploadSuccess, uploadFail, this.uploadOptions);
                }, UPLOAD_TIMEOUT);

                describe("chunkedMode handling", function() {
                    var testChunkedModeWin = function (uploadResult, specContext) {
                        var multipartModeEnabled = !(specContext.uploadOptions.headers && specContext.uploadOptions.headers["Content-Type"]);
                        var obj = null;
                        try {
                            obj = JSON.parse(uploadResult.response);

                            if (specContext.uploadOptions.chunkedMode) {
                                if (!isIos) {
                                    expect(obj["content-length"]).not.toBeDefined("Expected Content-Length not to be defined");
                                }
                                expect(obj["transfer-encoding"].toLowerCase()).toEqual("chunked");
                            } else {
                                expect(obj["content-length"]).toBeDefined("Expected Content-Length to be defined");
                                expect(obj["transfer-encoding"].toLowerCase()).not.toEqual("chunked");
                            }

                            if (multipartModeEnabled) {
                                expect(obj["content-type"].indexOf("multipart/form-data")).not.toBe(-1);
                            } else {
                                expect(obj["content-type"].indexOf("multipart/form-data")).toBe(-1);
                            }
                        } catch (e) {
                            expect(obj).not.toBeNull("returned data from server should be valid json");
                        }
                    };

                    var testChunkedModeBase = function(chunkedMode, multipart, done) {
                        var retryCount = 0;
                        var fileURL = SERVER + "/upload_echo_headers";
                        var specContext = this;

                        specContext.uploadOptions.chunkedMode = chunkedMode;
                        if (!multipart) {
                            // Content-Type header disables multipart
                            specContext.uploadOptions.headers = {
                                "Content-Type": "text/plain"
                            };
                        }

                        var uploadFail = function() {
                            if (++retryCount >= RETRY_COUNT) {
                                unexpectedCallbacks.httpFail();
                                done();
                            } else {
                                console.log('retrying... ' + retryCount);
                                setTimeout(function () {
                                    // NOTE: removing uploadOptions will cause Android to timeout
                                    specContext.transfer.upload(specContext.localFilePath, fileURL, function (uploadResult) {
                                        testChunkedModeWin(uploadResult, specContext);
                                        done();
                                    }, uploadFail, specContext.uploadOptions);
                                }, RETRY_INTERVAL);
                            }
                        };

                        // turn off the onprogress handler
                        this.transfer.onprogress = function () {};

                        // NOTE: removing uploadOptions cause Android to timeout
                        specContext.transfer.upload(specContext.localFilePath, fileURL, function (uploadResult) {
                            testChunkedModeWin(uploadResult, specContext);
                            done();
                        }, uploadFail, specContext.uploadOptions);
                    };

                    it("filetransfer.spec.42 chunkedMode=false, multipart=false", function (done) {

                        testChunkedModeBase.call(this, false, false, done);
                    }, UPLOAD_TIMEOUT * 11);

                    it("filetransfer.spec.43 chunkedMode=true, multipart=false", function (done) {

                        if (isWindows) {
                            pending();
                        }
                        testChunkedModeBase.call(this, true, false, done);
                    }, UPLOAD_TIMEOUT * 11);

                    it("filetransfer.spec.44 chunkedMode=false, multipart=true", function (done) {

                        testChunkedModeBase.call(this, false, true, done);
                    }, UPLOAD_TIMEOUT * 11);

                    it("filetransfer.spec.45 chunkedMode=true, multipart=true", function (done) {

                        if (isWindows) {
                            pending();
                        }
                        testChunkedModeBase.call(this, true, true, done);
                    }, UPLOAD_TIMEOUT * 11);
                });
            });
        });
    });
});
