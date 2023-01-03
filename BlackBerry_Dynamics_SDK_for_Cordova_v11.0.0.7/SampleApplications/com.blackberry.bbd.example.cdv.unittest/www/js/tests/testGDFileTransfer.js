/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 * 
 * GDFileTransfer plugin functional tests.
 */
describe('GDFileTransfer plugin', function () {

    var defaultFail = function (error) {
            expect(true).toBe(false);
        },
        gdFileSystem;

    beforeEach(function (done) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            gdFileSystem = fileSystem;
            done();
        }, null);
    });

    afterEach(function () {
        gdFileSystem = null;
    });

    it('Check FileTransfer plugin installation', function () {
        expect(window).toBeDefined();
        expect(FileTransfer).toBeDefined();
    });

    it('Method FileTransfer.upload - valid URL', function (done) {
        var ft = new FileTransfer(),
            options = new FileUploadOptions(),
            filePath = "aaaa.txt",
            fileOptions = {create: true, exclusive: false},
            uploadUrl = "http://httpbin.org/post";
        options.fileKey = "file";
        options.fileName = "data.json";
        options.mimeType = "text/json";

        ft.onprogress = function(result) {
            expect(result).toBeDefined();
        };

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, fileOptions, function (file) {
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                file.createWriter(function (writer) {
                    moveToNextFunction(null, writer, file);
                }, defaultFail);
            },
            function(writer, file, moveToNextFunction){
                writer.seek(writer.length);
                writer.onwriteend = function() {
                    moveToNextFunction(null, file);
                }
                writer.write('File writer wrote this text');

            },
            function(textFile, moveToNextFunction){
                ft.upload(textFile.nativeURL, uploadUrl, function (response) {
                    moveToNextFunction(null);
                }, defaultFail, options, true);
            }
        ], function () {
            done();
        });
    });

    it('Method FileTransfer.upload - valid URL and custom headers', function (done) {
        var ft = new FileTransfer(),
        options = new FileUploadOptions(),
        filePath = "aaaa.txt",
        fileOptions = {create: true, exclusive: false},
        uploadUrl = "http://httpbin.org/post";
        options.fileKey = "file";
        options.fileName = "data.json";
        options.mimeType = "text/json";
        options.headers = {"TestHeader1":"TestValue1",
                            "TestHeader2":"TestValue2"};

        ft.onprogress = function(result) {
            expect(result).toBeDefined();
        };

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, fileOptions, function (file) {
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                file.createWriter(function (writer) {
                    moveToNextFunction(null, writer, file);
                }, defaultFail);
            },
            function(writer, file, moveToNextFunction){
                writer.seek(writer.length);
                writer.onwriteend = function() {
                    moveToNextFunction(null, file);
                }
                writer.write('File writer wrote this text');

            },
            function(textFile, moveToNextFunction){
                ft.upload(textFile.nativeURL, uploadUrl, function (response) {
                    var repsData = JSON.parse(response.response);
                    var respHeadersData = repsData.headers;
                    expect(respHeadersData.Testheader1).toBeDefined();
                    expect(respHeadersData.Testheader2).toBeDefined();
                    expect(respHeadersData.Testheader1).toBe("TestValue1");
                    expect(respHeadersData.Testheader2).toBe("TestValue2");
                    moveToNextFunction(null);
                }, defaultFail, options, true);
            }
        ], function () {
            done();
        });
    });

    it('Method FileTransfer.upload - valid URL and custom upload params', function (done) {
        var ft = new FileTransfer(),
            options = new FileUploadOptions(),
            filePath = "aaaa.txt",
            fileOptions = {create: true, exclusive: false},
            uploadUrl = "http://httpbin.org/post";
        options.fileKey = "testFileKey";
        options.fileName = "data.json";
        options.mimeType = "text/json";

        ft.onprogress = function(result) {
            expect(result).toBeDefined();
        };

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, fileOptions, function (file) {
                    expect(file.isFile).toBe(true);
                    expect(file.isDirectory).toBe(false);
                    expect(file.fullPath).toBe('/' + filePath);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                file.createWriter(function (writer) {
                    moveToNextFunction(null, writer, file);
                }, defaultFail);
            },
            function(writer, file, moveToNextFunction){
                writer.seek(writer.length);
                writer.onwriteend = function() {
                    moveToNextFunction(null, file);
                }
                writer.write('File writer wrote this text');

            },
            function(textFile, moveToNextFunction){
                ft.upload(textFile.nativeURL, uploadUrl, function (response) {
                    var repsData = JSON.parse(response.response);
                    var respHeadersData = repsData.headers;
                    expect(repsData.files[options.fileKey]).toBeDefined();
                    expect(respHeadersData).toBeDefined();
                    expect(respHeadersData['Content-Type']).toBeDefined();
                    moveToNextFunction(null);
                }, defaultFail, options, true);
            }
        ], function () {
            done();
        });
    });

    it('Method FileTransfer.upload - invalid URL', function (done) {
        var ft = new FileTransfer(),
            options = new FileUploadOptions(),
            filePath = "aaaa.txt",
            fileOptions = {create: true, exclusive: false},
            uploadUrl = "some/not/valid/url";
        options.fileKey = "file";
        options.fileName = "data.json";
        options.mimeType = "text/json";

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, fileOptions, function (file) {
                    expect(file.isFile).toBe(true);
                    expect(file.isDirectory).toBe(false);
                    expect(file.fullPath).toBe('/' + filePath);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                ft.upload(file.nativeURL, uploadUrl, defaultFail, function(){
                    moveToNextFunction(null);
                }, options, true);
            }
        ], function () {
            done();
        });
    });

    it('Method FileTransfer.upload - empty URL', function (done) {
        var ft = new FileTransfer(),
            options = new FileUploadOptions(),
            filePath = "aaaa.txt",
            fileOptions = {create: true, exclusive: false},
            uploadUrl = "";
        options.fileKey = "file";
        options.fileName = "data.json";
        options.mimeType = "text/json";

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, fileOptions, function (file) {
                    expect(file.isFile).toBe(true);
                    expect(file.isDirectory).toBe(false);
                    expect(file.fullPath).toBe('/' + filePath);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                ft.upload(file.nativeURL, uploadUrl, defaultFail, function(){
                        moveToNextFunction(null);
                }, options, true);
            }
        ], function () {
            done();
        });
    });

    it('Method FileTransfer.download - valid URL', function (done) {
        var fileTransfer = new FileTransfer(),
            url = "http://www.textfiles.com/programming/24hrs.txt",
            filePath = "data.txt",
            options = {create: true, exclusive: false};

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, options, function (file) {
                    expect(file.isFile).toBe(true);
                    expect(file.isDirectory).toBe(false);
                    expect(file.fullPath).toBe('/' + filePath);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                fileTransfer.download(url, file.nativeURL, function (result) {
                    moveToNextFunction(null, result);
                }, defaultFail);
            },
            function (fileEntry, moveToNextFunction) {
                fileEntry.file(function (file) {
                    expect(file.localURL.indexOf('/' + filePath) >= 0).toBe(true);
                    expect(file.size).not.toBe(0);
                    fileEntry.remove();
                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function () {
            done();
        });
    });

    it('Method FileTransfer.download - invalid URL', function (done) {
        var fileTransfer = new FileTransfer(),
            url = "some/not/valid/url",
            filePath = "data.txt",
            options = {create: true, exclusive: false};

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, options, function (file) {
                    expect(file.isFile).toBe(true);
                    expect(file.isDirectory).toBe(false);
                    expect(file.fullPath).toBe('/' + filePath);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                fileTransfer.download(url, file.nativeURL, defaultFail, function () {
                    file.remove();
                    moveToNextFunction(null);
                });
            }
        ], function () {
            done();
        });
    });

    it('Method FileTransfer.download - empty URL', function (done) {
        var fileTransfer = new FileTransfer(),
            url = "",
            filePath = "data.txt",
            options = {create: true, exclusive: false};

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, options, function (file) {
                    expect(file.isFile).toBe(true);
                    expect(file.isDirectory).toBe(false);
                    expect(file.fullPath).toBe('/' + filePath);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                fileTransfer.download(url, file.nativeURL, defaultFail, function () {
                    file.remove();
                    moveToNextFunction(null);
                });
            }
        ], function () {
            done();
        });
    });

    it('Method FileTransfer.upload - valid URL and image/png mimeType. Includes Write image to file as Blob, read Blob file and upload', function (done) {
        expect(gdFileSystem).toBeDefined();
        var options = {create: true, exclusive: false},
            contentType = 'image/png',
            b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

        async.waterfall([
            function(moveToNextFunction){
                gdFileSystem.root.getFile("/red_circle.png", options, function(file){
                    expect(file.isDirectory).toBe(false);
                    expect(file.isFile).toBe(true);
                    expect(file.fullPath).toBe('/red_circle.png');
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function(imageFile, moveToNextFunction){
                imageFile.createWriter(function (writer) {
                        moveToNextFunction(null, writer, imageFile);
                }, defaultFail);
            },
            function(writer, imageFile, moveToNextFunction){
                function b64toBlob(b64Data, contentType, sliceSize) {
                    contentType = contentType || '';
                    sliceSize = sliceSize || 512;

                    var byteCharacters = atob(b64Data);
                    var byteArrays = [];

                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        var slice = byteCharacters.slice(offset, offset + sliceSize);

                        var byteNumbers = new Array(slice.length);
                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }

                    var blob = new Blob(byteArrays, {type: contentType});
                    return blob;
                }
                var blob = b64toBlob(b64Data, contentType);

                writer.seek(writer.length);
                writer.onwriteend = function() {
                    moveToNextFunction(null, imageFile);
                }
                writer.write(blob);

            },
            function(imageFile, moveToNextFunction){
                imageFile.file(function (file) {
                moveToNextFunction(null, file, imageFile);
                }, defaultFail);
            },
            function(file, imageFile, moveToNextFunction){
                expect(file).toBeDefined();
                expect(file).not.toBeNull();
                expect(imageFile.name).toBe('red_circle.png');

                var reader = new FileReader();
                expect(reader).toBeDefined();
                expect(reader.readAsDataURL).toBeDefined();
                reader.onloadend = function (evt) {
                expect(evt.target.result).toBeDefined();
                expect(evt.target.result).toBe('data:image/png;base64,' + b64Data);

                // remove image if there is no FileTransfer plugin installed
                try { !FileTransfer; } catch(err) { imageFile.remove(); }
                //upload
                var fileTransfer = new FileTransfer(),
                    options = new FileUploadOptions(),
                    filePath = file.localURL,
                    fileOptions = file.fileOptions,
                    uploadUrl = "http://httpbin.org/post";
                options.fileKey = "testFileKey";
                options.fileName = file.name;//"red_dot.png";
                options.mimeType = file.type;//"image/png";

                fileTransfer.upload(filePath, uploadUrl,
                    function (response) {
                        expect(response.response).toBeDefined();
                        var respData = JSON.parse(response.response);
                        var respFilesData = respData.files;
                        expect(respFilesData[options.fileKey]).toBeDefined();

                        imageFile.remove();
                        moveToNextFunction(null);
                    }, function() {
                        imageFile.remove();
                        expect(true).toBe(false);
                    }, options, true);
                };
                reader.onerror = function (evt) {
                    expect(true).toBe(false);
                };
                reader.readAsDataURL(file);

            }
        ], function(){
            done();
        });
    });

    it('Method FileTransfer.upload - valid URL with custom headers and upload params', function (done) {
        var ft = new FileTransfer(),
            options = new FileUploadOptions(),
            filePath = "aaaa.txt",
            fileOptions = {create: true, exclusive: false},
            uploadUrl = "http://httpbin.org/post";
        options.fileKey = "testFileKey";
        options.fileName = "data.json";
        options.mimeType = "text/json";
        options.headers = {"Test-Header1":"TestValue1",
                            "Test-Header2":"TestValue2"};
        options.params = {"Test-Param1":"TestValue1",
                            "Test-Param2":"TestValue2"};

        ft.onprogress = function(result) {
            expect(result).toBeDefined();
        };

        async.waterfall([
            function (moveToNextFunction) {
                gdFileSystem.root.getFile(filePath, fileOptions, function (file) {
                    expect(file.isDirectory).toBe(false);
                    expect(file.isFile).toBe(true);
                    expect(file.fullPath).toBe('/' + filePath);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function (file, moveToNextFunction) {
                file.createWriter(function (writer) {
                    moveToNextFunction(null, writer, file);
                }, defaultFail);
            },
            function(writer, file, moveToNextFunction){
                writer.seek(writer.length);
                writer.onwriteend = function() {
                    moveToNextFunction(null, file);
                }
                writer.write('File writer wrote this text');

            },
            function(textFile, moveToNextFunction){
                ft.upload(textFile.nativeURL, uploadUrl, function (response) {
                    var repsData = JSON.parse(response.response);
                    var respHeadersData = repsData.headers;
                    expect(respHeadersData['Test-Header1']).toBeDefined();
                    expect(respHeadersData['Test-Header2']).toBeDefined();
                    expect(respHeadersData['Test-Header1']).toBe("TestValue1");
                    expect(respHeadersData['Test-Header2']).toBe("TestValue2");
                    var respFormData = repsData.form;
                    expect(respFormData['Test-Param1']).toBeDefined();
                    expect(respFormData['Test-Param2']).toBeDefined();
                    expect(respFormData['Test-Param1']).toBe("TestValue1");
                    expect(respFormData['Test-Param2']).toBe("TestValue2");
                    moveToNextFunction(null);
                }, defaultFail, options, true);
            }
        ], function () {
            done();
        });
    });

});
