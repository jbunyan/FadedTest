/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 * 
 * GDStorage plugin unit tests. File and Directory readers
 */

var defaultFail = function (error) {
        expect(true).toBe(false);
    };

describe('GDStorage plugin - directory & file readers', function () {

    it('Check readers plugin installation', function () {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(requestFileSystem).toBeDefined();
        expect(resolveLocalFileSystemURI).toBeDefined();
        expect(DirectoryReader).toBeDefined();
        expect(FileReader).toBeDefined();
    });

    describe('DirectoryReader', function () {
        var gdFileSystem;

        beforeEach(function (done) {
            requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                gdFileSystem = fileSystem;
                done();
            }, null);
        });

        afterEach(function () {
            gdFileSystem = null;
        });

        it('DirectoryReader empty folder', function (done) {
            var path = "/directory_reader_test",
                directory,
                options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory(path, options, function (result) {
                        moveToNextFunction(null, result);
                    }, defaultFail);
                },
                function(directory, moveToNextFunction){
                    var directoryReader = directory.createReader();
                    directoryReader.readEntries(function (result) {
                        expect(result).toBeDefined();
                        expect(result).not.toBeNull();

                        expect(result.length).toBe(0);

                        directory.remove();
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('DirectoryReader positive case 1 folder content', function (done) {
            var path = "/directory_reader_test",
                directory,
                options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory(path, options, function (result) {
                        moveToNextFunction(null, result);
                    }, defaultFail);
                },
                function(directory, moveToNextFunction){
                    directory.getDirectory("sub_folder1", options, function (result) {
                        moveToNextFunction(null, directory, result);
                    }, defaultFail);
                },
                function(directory, sub_folder1, moveToNextFunction){
                    var directoryReader = directory.createReader();
                    directoryReader.readEntries(function (result) {
                        expect(result).toBeDefined();
                        expect(result).not.toBeNull();

                        expect(result.length).toBe(1);

                        sub_folder1.remove();
                        directory.remove();
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('DirectoryReader positive case 3 folders content', function (done) {
            var path = "/directory_reader_test",
                directory,
                options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory(path, options, function (result) {
                        moveToNextFunction(null, result);
                    }, defaultFail);
                },
                function(directory, moveToNextFunction){
                    directory.getDirectory("sub_folder1", options, function (result) {
                        moveToNextFunction(null, directory, result);
                    }, defaultFail);
                },
                function(directory, sub_folder1, moveToNextFunction){
                    directory.getDirectory("sub_folder2", options, function (result) {
                        moveToNextFunction(null, directory, sub_folder1, result);
                    }, defaultFail);
                },
                function(directory, sub_folder1, sub_folder2, moveToNextFunction){
                    directory.getDirectory("sub_folder3", options, function (result) {
                        moveToNextFunction(null, directory, sub_folder1, sub_folder2, result);
                    }, defaultFail);
                },
                function(directory, sub_folder1, sub_folder2, sub_folder3, moveToNextFunction){
                    var directoryReader = directory.createReader();
                    directoryReader.readEntries(function (result) {
                        expect(result).toBeDefined();
                        expect(result).not.toBeNull();
                        expect(result.length).toBe(3);
                        sub_folder1.remove();
                        sub_folder2.remove();
                        sub_folder3.remove();
                        directory.remove();
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });
    });

    function arrayBuf2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    describe('FileReader', function () {
        var gdFileSystem;

        beforeEach(function (done) {
            requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                gdFileSystem = fileSystem;
                done();
            }, null);
        });

        afterEach(function () {
            gdFileSystem = null;
        });

        it('Check File Reader readAsText', function (done) {
            expect(gdFileSystem).toBeDefined();

            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("/some_file.txt", options, function(fileEntry){
                        expect(fileEntry.isDirectory).toBe(false);
                        expect(fileEntry.isFile).toBe(true);
                        moveToNextFunction(null, fileEntry);
                    }, defaultFail);
                },
                function(fileEntry, moveToNextFunction){
                    fileEntry.createWriter(function (writer) {
                        moveToNextFunction(null, writer, fileEntry);
                    }, defaultFail);
                },
                function(writer, fileEntry, moveToNextFunction){
                    writer.seek(writer.length);
                    writer.onwriteend = function() {
                        moveToNextFunction(null, fileEntry);
                    }
                    writer.write('File writer wrote this text');
                },
                function(fileEntry, moveToNextFunction){
                    fileEntry.file(function (file) {
                        expect(file).toBeDefined();
                        expect(file).not.toBeNull();
                        moveToNextFunction(null, file, fileEntry);
                    }, defaultFail);
                },
                function(file, fileEntry, moveToNextFunction){
                    var reader = new FileReader();
                    expect(reader).toBeDefined();
                    expect(reader.readAsText).toBeDefined();
                    reader.onloadend = function (evt) {
                        expect(evt.target.result).toBe("File writer wrote this text");
                        fileEntry.remove();
                        moveToNextFunction(null);
                    };
                    reader.onerror = function (evt) {
                        expect(true).toBe(false);
                    };
                    reader.readAsText(file);
                }
            ], function(){
                done();
            });
        });

        it('Check File Reader readAsDataURL', function (done) {
            expect(gdFileSystem).toBeDefined();

            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("/some_file.txt", options, function(fileEntry){
                        expect(fileEntry.isDirectory).toBe(false);
                        expect(fileEntry.isFile).toBe(true);
                        moveToNextFunction(null, fileEntry);
                    }, defaultFail);
                },
                function(fileEntry, moveToNextFunction){
                    fileEntry.createWriter(function (writer) {
                        moveToNextFunction(null, writer, fileEntry);
                    }, defaultFail);
                },
                function(writer, fileEntry, moveToNextFunction){
                    writer.seek(writer.length);
                    writer.onwriteend = function() {
                        moveToNextFunction(null, fileEntry);
                    }
                    writer.write('File writer wrote this text');
                },
                function(fileEntry, moveToNextFunction){
                    fileEntry.file(function (file) {
                        expect(file).toBeDefined();
                        expect(file).not.toBeNull();
                        moveToNextFunction(null, file, fileEntry);
                    }, defaultFail);
                },
                function(file, fileEntry, moveToNextFunction){
                    var reader = new FileReader();
                    expect(reader).toBeDefined();
                    expect(reader.readAsDataURL).toBeDefined();
                    reader.onloadend = function (evt) {
                        expect(evt.target.result).not.toBe(null);
                        expect(evt.target.result).toBeDefined();
                        fileEntry.remove();
                        moveToNextFunction(null);
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

        it('Check File Reader readAsArrayBuffer', function (done) {
            expect(gdFileSystem).toBeDefined();

            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("/some_file.txt", options, function(fileEntry){
                        expect(fileEntry.isDirectory).toBe(false);
                        expect(fileEntry.isFile).toBe(true);
                        moveToNextFunction(null, fileEntry);
                    }, defaultFail);
                },
                function(fileEntry, moveToNextFunction){
                    fileEntry.createWriter(function (writer) {
                        moveToNextFunction(null, writer, fileEntry);
                    }, defaultFail);
                },
                function(writer, fileEntry, moveToNextFunction){
                    writer.seek(writer.length);
                    writer.onwriteend = function() {
                        moveToNextFunction(null, fileEntry);
                    }
                    writer.write('File writer wrote this text');
                },
                function(fileEntry, moveToNextFunction){
                    fileEntry.file(function (file) {
                        expect(file).toBeDefined();
                        expect(file).not.toBeNull();
                        moveToNextFunction(null, file, fileEntry);
                    }, defaultFail);
                },
                function(file, fileEntry, moveToNextFunction){
                    var reader = new FileReader();
                    expect(reader).toBeDefined();
                    expect(reader.readAsArrayBuffer).toBeDefined();
                    reader.onloadend = function (evt) {
                        expect(evt.target.result).not.toBe(null);
                        expect(evt.target.result).toBeDefined();
                        fileEntry.remove();
                        moveToNextFunction(null);
                    };
                    reader.onerror = function (evt) {
                        expect(true).toBe(false);
                    };
                    reader.readAsArrayBuffer(file);
                }
            ], function(){
                done();
            });
        });

        it('Check File Reader readAsBinaryString', function (done) {
            expect(gdFileSystem).toBeDefined();

            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("/some_file.txt", options, function(fileEntry){
                        expect(fileEntry.isDirectory).toBe(false);
                        expect(fileEntry.isFile).toBe(true);
                        moveToNextFunction(null, fileEntry);
                    }, defaultFail);
                },
                function(fileEntry, moveToNextFunction){
                    fileEntry.createWriter(function (writer) {
                        moveToNextFunction(null, writer, fileEntry);
                    }, defaultFail);
                },
                function(writer, fileEntry, moveToNextFunction){
                    writer.seek(writer.length);
                    writer.onwriteend = function() {
                        moveToNextFunction(null, fileEntry);
                    }
                    writer.write('File writer wrote this text');
                },
                function(fileEntry, moveToNextFunction){
                    fileEntry.file(function (file) {
                        expect(file).toBeDefined();
                        expect(file).not.toBeNull();
                        moveToNextFunction(null, file, fileEntry);
                    }, defaultFail);
                },
                function(file, fileEntry, moveToNextFunction){
                    var reader = new FileReader();
                    expect(reader).toBeDefined();
                    expect(reader.readAsBinaryString).toBeDefined();
                    reader.onloadend = function (evt) {
                        expect(evt.target.result).not.toBe(null);
                        expect(evt.target.result).toBeDefined();
                        expect(evt.target.result).toBe("File writer wrote this text");
                        fileEntry.remove();
                        moveToNextFunction(null);
                    };
                    reader.onerror = function (evt) {
                        expect(true).toBe(false);
                    };
                    reader.readAsBinaryString(file);
                }
            ], function(){
                done();
            });
        });

    });
});

/*
 * GDStorage plugin functional tests. File writer
 */
describe('GDStorage plugin - File writer', function () {
    it('Check writer plugin installation', function () {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(FileWriter).toBeDefined();
    });

    beforeEach(function (done) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            gdFileSystem = fileSystem;
            done();
        }, null);
    });

    afterEach(function () {
        gdFileSystem = null;
    });

    it('File writer : write image to file as Blob', function (done) {
        expect(gdFileSystem).toBeDefined();
        var options = {create: true, exclusive: false},
            contentType = 'image/png',
            b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

        async.waterfall([
            function(moveToNextFunction){
                gdFileSystem.root.getFile("/logo.png", options, function(file){
                    expect(file.isDirectory).toBe(false);
                    expect(file.isFile).toBe(true);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function(textFile, moveToNextFunction){
                textFile.createWriter(function (writer) {
                    moveToNextFunction(null, writer, textFile);
                }, defaultFail);
            },
            function(writer, textFile, moveToNextFunction){
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
                    moveToNextFunction(null, textFile);
                }
                writer.write(blob);

            },
            function(textFile, moveToNextFunction){
                    textFile.file(function (file) {
                    moveToNextFunction(null, file, textFile);
                    }, defaultFail);
            },
            function(file, textFile, moveToNextFunction){
                    expect(file).toBeDefined();
                    expect(file).not.toBeNull();
                    var reader = new FileReader();
                    expect(reader).toBeDefined();
                    expect(reader.readAsDataURL).toBeDefined();
                    reader.onloadend = function (evt) {
                    expect(evt.target.result).toBeDefined();
                    expect(evt.target.result).toBe('data:image/png;base64,' + b64Data);
                    textFile.remove();
                    moveToNextFunction(null, textFile);
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

    it('File writer : write ArrayBuffer to file', function (done) {
        expect(gdFileSystem).toBeDefined();
        var options = {create: true, exclusive: false};

        async.waterfall([
            function(moveToNextFunction){
                gdFileSystem.root.getFile("/some_file.txt", options, function(file){
                    expect(file.isDirectory).toBe(false);
                    expect(file.isFile).toBe(true);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function(textFile, moveToNextFunction){
                textFile.createWriter(function (writer) {
                    moveToNextFunction(null, writer, textFile);
                }, defaultFail);
            },
            function(writer, textFile, moveToNextFunction){
                var arrayBuf = new ArrayBuffer(5),
                    dataView = new Int8Array(arrayBuf);

                for (i=0; i < 5; i++) {
                    dataView[i] = i;
                }

                writer.seek(writer.length);
                writer.onwriteend = function() {
                    moveToNextFunction(null, textFile);
                }
                writer.write(arrayBuf);

            },
            function(textFile, moveToNextFunction){
                textFile.file(function (file) {
                moveToNextFunction(null, file, textFile);
                }, defaultFail);
            },
            function(file, textFile, moveToNextFunction){
                expect(file).toBeDefined();
                expect(file).not.toBeNull();
                var reader = new FileReader();
                expect(reader).toBeDefined();
                expect(reader.readAsDataURL).toBeDefined();
                reader.onloadend = function (evt) {
                expect(evt.target.result).toBeDefined();
                textFile.remove();
                moveToNextFunction(null, textFile);
                };
                reader.onerror = function (evt) {
                    expect(true).toBe(false);
                };
                reader.readAsArrayBuffer(file);
            }
        ], function(){
            done();
        });
    });

    it('File writer one string text', function (done) {
        expect(gdFileSystem).toBeDefined();
        var options = {create: true, exclusive: false};

        async.waterfall([
            function(moveToNextFunction){
                gdFileSystem.root.getFile("/some_file.txt", options, function(file){
                    expect(file.isDirectory).toBe(false);
                    expect(file.isFile).toBe(true);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function(textFile, moveToNextFunction){
                textFile.createWriter(function (writer) {
                    moveToNextFunction(null, writer, textFile);
                }, defaultFail);
            },
            function(writer, textFile, moveToNextFunction){
                writer.seek(writer.length);
                writer.onwriteend = function() {
                    moveToNextFunction(null, textFile);
                }
                writer.write('File writer wrote this text');

            },
            function(textFile, moveToNextFunction){
                textFile.file(function (file) {
                    moveToNextFunction(null, file, textFile);
                }, defaultFail);
            },
            function(file, textFile, moveToNextFunction){
                expect(file).toBeDefined();
                expect(file).not.toBeNull();
                var reader = new FileReader();
                expect(reader).toBeDefined();
                expect(reader.readAsText).toBeDefined();
                reader.onloadend = function (evt) {
                    expect(evt.target.result).toBe('File writer wrote this text');
                    textFile.remove();
                    moveToNextFunction(null, textFile);
                };
                reader.onerror = function (evt) {
                    expect(true).toBe(false);
                };
                reader.readAsText(file);
            }
        ], function(){
            done();
        });
    });

    it('File writer several strings text', function (done) {
        expect(gdFileSystem).toBeDefined();
        var options = {create: true, exclusive: false};

        async.waterfall([
            function(moveToNextFunction){
                gdFileSystem.root.getFile("/some_file.txt", options, function(file){
                    expect(file.isDirectory).toBe(false);
                    expect(file.isFile).toBe(true);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function(textFile, moveToNextFunction){
                textFile.createWriter(function (writer) {
                    moveToNextFunction(null, writer, textFile);
                }, defaultFail);
            },
            function(writer, textFile, moveToNextFunction){
                writer.seek(writer.length);

                writer.onwriteend = function() {
                    moveToNextFunction(null, writer, textFile);
                }
                writer.write('First Text, ');
            },
            function(writer, textFile, moveToNextFunction){
                writer.seek(writer.length);

                writer.onwriteend = function() {
                    moveToNextFunction(null, textFile);
                }
                writer.write('Second Text');
            },
            function(textFile, moveToNextFunction){
                textFile.file(function (file) {
                moveToNextFunction(null, file, textFile);
                }, defaultFail);
            },
            function(file, textFile, moveToNextFunction){
                expect(file).toBeDefined();
                expect(file).not.toBeNull();

                var reader = new FileReader();

                expect(reader).toBeDefined();
                expect(reader.readAsText).toBeDefined();

                reader.onloadend = function (evt) {
                    expect(evt.target.result).toBe('First Text, Second Text');
                    textFile.remove();
                    moveToNextFunction(null, textFile);
                };
                reader.onerror = function (evt) {
                    expect(true).toBe(false);
                };
                reader.readAsText(file);
            }
        ], function(){
            done();
        });
    });

    it('File writer text to existing file', function (done) {
        expect(gdFileSystem).toBeDefined();
        var options = {create: true, exclusive: false};

        async.waterfall([
            function(moveToNextFunction){
                gdFileSystem.root.getFile("/some_file.txt", options, function(file){
                    expect(file.isDirectory).toBe(false);
                    expect(file.isFile).toBe(true);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function(textFile, moveToNextFunction){
                textFile.createWriter(function (writer) {
                    moveToNextFunction(null, writer, textFile);
                }, defaultFail);
            },
            function(writer, textFile, moveToNextFunction){
                writer.seek(writer.length);
                var oldLength = writer.length;
                writer.onwriteend = function() {
                    expect(oldLength).not.toBe(writer.length);
                    //** configuration fix, this test does not clean-up after itself
                    //** so we will remove file so that truncate test could create a new and empty file
                    textFile.remove();
                    moveToNextFunction(null);
                 }
                writer.write('File writer wrote this text');
            }
        ], function(){
            done();
        });
    });

    it('truncate file', function (done) {
        expect(gdFileSystem).toBeDefined();
        var options = {create: true, exclusive: false};

        async.waterfall([
            function(moveToNextFunction){
                gdFileSystem.root.getFile("/some_file.txt", options, function(file){
                    expect(file.isDirectory).toBe(false);
                    expect(file.isFile).toBe(true);
                    moveToNextFunction(null, file);
                }, defaultFail);
            },
            function(textFile, moveToNextFunction){
                textFile.createWriter(function (writer) {
                    moveToNextFunction(null, writer, textFile);
                }, defaultFail);
            },
            function(writer, textFile, moveToNextFunction){
                writer.onerror = function(evt) {
                    expect(true).toBe(false);
                };
                writer.onwriteend = function(evt) {
                    moveToNextFunction(null, writer, textFile);
                }
                writer.write("Test string");
            },
            function(writer, textFile, moveToNextFunction){
                writer.onerror = function(evt) {
                    expect(true).toBe(false);
                };
                writer.onwriteend = function(evt) {
                    moveToNextFunction(null, textFile);
                }
                writer.truncate(4);
            },
            function(textFile, moveToNextFunction){
                textFile.file(function (file) {
                    moveToNextFunction(null, file, textFile);
                }, defaultFail);
            },
            function(file, textFile, moveToNextFunction){
                expect(file).toBeDefined();
                expect(file).not.toBeNull();
                var reader = new FileReader();
                expect(reader).toBeDefined();
                expect(reader.readAsText).toBeDefined();
                reader.onloadend = function (evt) {
                    expect(evt.target.result).toBe('Test');
                    textFile.remove();
                    moveToNextFunction(null, textFile);
                };
                reader.onerror = function (evt) {
                    expect(true).toBe(false);
                };
                reader.readAsText(file);
            }
        ], function(){
            done();
        });
    });

 });
