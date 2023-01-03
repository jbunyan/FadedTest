/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 * 
 * GDStorage plugin unit tests. Directory Entry functionality
 */
describe('GDStorage plugin - directory & file entry', function () {
    
    var defaultFail = function (error) {
            expect(true).toBe(false);
        };

    it('Check localFileSystem plugin installation', function () {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(requestFileSystem).toBeDefined();
        expect(resolveLocalFileSystemURI).toBeDefined();
    });

    describe('FileSystem metadata', function () {

        it('Check fileSystem metadata on root', function (done) {
            async.waterfall([
                function(moveToNextFunction){
                    requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                        moveToNextFunction(null, fileSystem);
                    }, defaultFail);
                },
                function(fileSystem, moveToNextFunction){
                    fileSystem.root.getMetadata(function(result){
                        expect(true).toBe(true);
                        moveToNextFunction(null);
                    }, defaultFail);

                }
            ], function(){
                done();
            });
        });
    });

    describe('FileSystem getDirectory', function () {
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

        it('Check getDirectory method', function (done) {
            expect(gdFileSystem).toBeDefined();
            var success = function (result) {
                    expect(result.isDirectory).toBe(true);
                    expect(result.isFile).toBe(false);
                    expect(result.fullPath).toBeDefined();
                    expect(result.fullPath).toBe('/some_directory/');
                    done();
                },
                options = {create: true, exclusive: false};

            gdFileSystem.root.getDirectory("some_directory", options, success, defaultFail);
        });

        it('Check getDirectory - check create false', function (done) {
            expect(gdFileSystem).toBeDefined();
            var success = function (result) {
                    expect(true).toBe(false);
                    done();
                },
                fail = function (err) {
                    expect(true).toBe(true);
                    done();
                },
                options = {create: false, exclusive: false};

            gdFileSystem.root.getDirectory("some_directory_shouldn't_create", options, success, fail);
        });

        it('Check getDirectory - check create true', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};
            
            async.series([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("some_directory_should_create", options, function(){
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction){
                    options = {create: false, exclusive: false};
                    gdFileSystem.root.getDirectory("some_directory_should_create", options, function(){
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });
    });

    describe('FileSystem getFile', function () {
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

        it('Check getFile method', function (done) {
            expect(gdFileSystem).toBeDefined();
            var success = function (result) {
                    expect(result.isDirectory).toBe(false);
                    expect(result.isFile).toBe(true);
                    expect(result.fullPath).toBeDefined();
                    expect(result.fullPath).toBe('/some_file');

                    done();
                },
                options = {create: true, exclusive: false};

            gdFileSystem.root.getFile("some_file", options, success, defaultFail);
        });

        it('Check getFile - check create false', function (done) {
            expect(gdFileSystem).toBeDefined();
            var success = function (result) {
                    expect(true).toBe(false);
                },
                fail = function (err) {
                    expect(true).toBe(true);
                    done();
                },
                options = {create: false, exclusive: false};

            /**
             * This test should fail.
             */
            gdFileSystem.root.getFile("some_file_shouldn't_create", options, success, fail);
        });

        it('Check getFile - check empty file name', function (done) {
            expect(gdFileSystem).toBeDefined();
            var errorCallBack = function(error) {
                if (cordova.platformId === 'ios') {
                    expect(error.code).toBe(8); // code 8 = Syntax error
                } else {
                    expect(error.code).toBe(11); // code 11 = Type mismatch
                }
                done();
            },
            success = function (err) {
                /* this test should fail */
                expect(true).toBe(false);
                done();
            },

            options = {create: true, exclusive: false};

            gdFileSystem.root.getFile("", options, success, errorCallBack);
        });

        it('Check getFile - check duble slash', function (done) {
            expect(gdFileSystem).toBeDefined();
            var errorCallBack = function(error) {
                if (cordova.platformId === 'ios') {
                    expect(error.code).toBe(8); // code 8 = Syntax error
                } else {
                    expect(error.code).toBe(11); // code 11 = Type mismatch
                }
                done();
            },
            success = function (err) {
                /* this test should fail */
                expect(true).toBe(false);
                done();
            },

            options = {create: true, exclusive: false};

            gdFileSystem.root.getFile("//", options, success, errorCallBack);
        });

        it ('Chech getFile - check remove slash from file name', function (done){
            expect(gdFileSystem).toBeDefined();
            var succesCallBack = function (result) {
                expect(result.isDirectory).toBe(false);
                expect(result.isFile).toBe(true);
                expect(result.fullPath).toBeDefined();
                expect(result.fullPath).toBe('/some_file');

                done();
            },
            
            options = {create: true, exclusive: false};

            gdFileSystem.root.getFile("///some_file", options, succesCallBack, defaultFail);
        });

        it('Check getFile - check create true', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.series([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("some_file_should_create", options, function(){
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction){
                    options = {create: false, exclusive: false};
                    gdFileSystem.root.getFile("some_file_should_create", options, function(){
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('Check getFile - check create true, exclusive true', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.series([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("some_file_should_create_exclusive", options, function(){
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction){
                    options = {create: true, exclusive: true};
                    gdFileSystem.root.getFile("some_file_should_create_exclusive", options, defaultFail, function(){
                        moveToNextFunction(null);
                    });
                }
            ], function(){
                done();
            });
        });
    });

    describe('FileSystem remove', function () {
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

        it('Check remove file', function (done) {
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("test.txt", options, function (file) {
                        expect(file.isDirectory).toBe(false);
                        expect(file.isFile).toBe(true);
                        expect(file.fullPath).toBeDefined();
                        expect(file.fullPath).toBe('/test.txt');

                        moveToNextFunction(null, file);
                    }, defaultFail);
                },
                function(file, moveToNextFunction){
                    file.file(function () {
                        moveToNextFunction(null, file);
                    }, defaultFail);
                },
                function(file, moveToNextFunction){
                    file.remove(function () {
                        moveToNextFunction(null, file);
                    }, defaultFail);
                },
                function(file, moveToNextFunction){
                    file.file(defaultFail, function () {
                        moveToNextFunction(null, file);
                    });
                },
            ], function(){
                done();
            });
        });

        it('Check remove directory', function (done) {
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("test_directory_to_remove", options, function (directory) {
                        expect(directory.isDirectory).toBe(true);
                        expect(directory.isFile).toBe(false);
                        expect(directory.fullPath).toBeDefined();
                        expect(directory.fullPath).toBe('/test_directory_to_remove/');

                        moveToNextFunction(null, directory);
                    }, defaultFail);
                },
                function(directory, moveToNextFunction){
                    directory.getMetadata(function () {
                        moveToNextFunction(null, directory);
                    }, defaultFail);
                },
                function(directory, moveToNextFunction){
                    directory.remove(function () {
                        moveToNextFunction(null, directory);
                    }, defaultFail);
                },
                function(directory, moveToNextFunction){
                    directory.getMetadata(defaultFail, function () {
                        moveToNextFunction(null, directory);
                    });
                },
            ], function(){
                done();
            });
        });

        it('Check remove not empty root directory', function (done) {
            var options = {create: true, exclusive: false};
            
            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("test.txt", options, function (file) {
                        moveToNextFunction(null, file);
                    }, defaultFail);
                },
                function(file, moveToNextFunction){
                    file.file(function () {
                        moveToNextFunction(null, file);
                    }, defaultFail);
                },
                function(file, moveToNextFunction){
                    gdFileSystem.root.remove(defaultFail, function () {
                        expect(true).toBe(true);
                        moveToNextFunction(null, file);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('Check remove not empty directory', function (done) {
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("test_directory_to_remove", options, function (directory) {
                        moveToNextFunction(null, directory);
                    }, defaultFail);
                },
                function(directory, moveToNextFunction){
                    directory.getFile("test_file", options, function (file) {
                        moveToNextFunction(null, directory, file);
                    }, defaultFail);
                },
                function(directory, file, moveToNextFunction){
                    file.file(function(){
                        moveToNextFunction(null, directory, file);
                    }, defaultFail);
                },
                function(directory, file, moveToNextFunction){
                    directory.remove(defaultFail, function(){
                        moveToNextFunction(null, directory, file);
                    });
                },
                function(directory, file, moveToNextFunction){
                    file.remove(function(){
                        moveToNextFunction(null, directory, file);
                    }, defaultFail);
                },
                function(directory, file, moveToNextFunction){
                    directory.remove(function(){
                        expect(true).toBe(true);
                        moveToNextFunction(null, directory, file);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });
    });

    describe('FileSystem getFileMetadata', function () {
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

        it('Check metadata on created txt file', function (done) {
            var options = {create: true, exclusive: false};
            
            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("test.txt", options, function (file) {
                        moveToNextFunction(null, file);
                    }, defaultFail);
                },
                function(file, moveToNextFunction){
                    file.file(function (file) {
                        expect(true).toBe(true);
                        expect(file.localURL.indexOf('test.txt') > -1).toBe(true);
                        expect(file.localURL).toBeDefined();
                        expect(file.name).toBe("test.txt");
                        expect(file.lastModifiedDate).toBeDefined();
                        expect(file.size).toBe(0);
                        expect(file.type).toBe("text/plain");
                        moveToNextFunction(null, file);
                        }, defaultFail);
                },
            ], function(){
                done();
            });
        });

        it('Check metadata on created file', function (done) {
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("test.aaa", options, function (file) {
                        moveToNextFunction(null, file);
                    }, defaultFail);
                },
                function(file, moveToNextFunction){
                    file.file(function (file) {
                        expect(true).toBe(true);
                        expect(file.name).toBe("test.aaa");
                        expect(file.localURL).toBeDefined();
                        expect(file.localURL.indexOf('test.aaa') > -1).toBe(true);
                        expect(file.lastModifiedDate).toBeDefined();
                        expect(file.size).toBe(0);
                        if (cordova.platformId === 'ios') {
                            expect(file.type).toBe('application/octet-stream');
                        } else {
                            expect(file.type).toBeNull();
                        }
                        moveToNextFunction(null, file);
                        }, defaultFail);
                },
            ], function(){
                done();
            });
        });
    });

    describe('FileSystem moveTo', function () {
        var gdFileSystem;

        beforeEach(function (done) {
            requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                gdFileSystem = fileSystem;
                done();
            }, null);
        });

        afterEach(function (done) {
            async.map([
                'some_directory',
                'some_test_directory',
                'first_directory',
                'second_directory'
            ], function(dir, next) {
                gdFileSystem.root.getDirectory(dir, {create: false}, function (directory) {
                    directory.removeRecursively(function() {
                        next(null);
                    }, function(err) { next(err); });
                    
                }, function(err) { next(err); });
            }, function(err, results) {
                gdFileSystem = null;
                done();
            });            
        });

        it('Move file to another folder', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false}, old = {};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("some_file.txt", options, function (file) {
                        expect(file.isDirectory).toBe(false);
                        expect(file.isFile).toBe(true);
                        expect(file.fullPath).toBe('/some_file.txt');
                        old.path = file.fullPath;
                        old.size = file.size;
                        old.type = file.type;
                        old.name = file.name;
                        old.lastModifiedDate = file.lastModifiedDate;
                        moveToNextFunction(null, file, old);
                    }, defaultFail);
                },
                function(file, old, moveToNextFunction){
                    gdFileSystem.root.getDirectory("some_directory", options, function (directory) {
                        expect(directory.isDirectory).toBe(true);
                        expect(directory.isFile).toBe(false);
                        expect(directory.fullPath).toBe('/some_directory/');
                        moveToNextFunction(null, file, old, directory);
                        }, defaultFail);
                },
                function(file, old, directory, moveToNextFunction){
                    file.moveTo(directory, "some_file.txt", function (result) {
                        expect(result.isFile).toBe(true);
                        expect(result.isDirectory).toBe(false);
                        expect(old.path).not.toBe(result.fullPath);
                        expect(result.fullPath).toBe('/some_directory/some_file.txt');
                        expect(old.size).toBe(result.size);
                        expect(old.type).toBe(result.type);
                        expect(old.name).toBe(result.name);
                        expect(old.lastModifiedDate).toBe(result.lastModifiedDate);
                        moveToNextFunction(null, directory);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('Move directory to another directory', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("some_test_directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, result);
                        }, defaultFail);
                },
                function(firstDirectory, moveToNextFunction){
                    gdFileSystem.root.getDirectory("some_other_directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, firstDirectory, result);
                    }, defaultFail);
                },
                function(firstDirectory, secondDirectory, moveToNextFunction){
                    firstDirectory.moveTo(secondDirectory, "some_test_directory", function (result) {
                        expect(result.isFile).toBe(false);
                        expect(result.isDirectory).toBe(true);
                        expect(result.fullPath).not.toBe(firstDirectory.fullPath);
                        expect(result.fullPath).toBe('/some_other_directory/some_test_directory/');
                        moveToNextFunction(null, secondDirectory);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('Move directory to itself', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("some_test_directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, result);
                        }, defaultFail);
                },
                function(firstDirectory, moveToNextFunction){
                    gdFileSystem.root.getDirectory("some_test_directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, firstDirectory, result);
                    }, defaultFail);
                },
                function(firstDirectory, secondDirectory, moveToNextFunction){
                    firstDirectory.moveTo(secondDirectory, "some_test_directory", defaultFail,  function (result) {
                        moveToNextFunction(null);
                    });
                }
            ], function(){
                done();
            });
        });

        it('Move directory non empty directory', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("first_directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, result);
                        }, defaultFail);
                },
                function(firstDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("first_directory/first.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, firstDirectory);
                        }, defaultFail);
                },
                function(firstDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("first_directory/second.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, firstDirectory);
                        }, defaultFail);
                },
                function(firstDirectory, moveToNextFunction){
                    gdFileSystem.root.getDirectory("second_directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, firstDirectory, result);
                    }, defaultFail);
                },
                function(firstDirectory, secondDirectory, moveToNextFunction){
                    firstDirectory.moveTo(secondDirectory, "some_test_directory", function(directory) {
                        var reader = directory.createReader();
                        reader.readEntries(function(entries) {
                            var sortByName = function(left, right) {
                                if(left.name < right.name) { return -1; }
                                if(left.name > right.name) { return 1; }
                                return 0;
                            },
                            sortedEntries = entries.sort(sortByName);

                            expect(sortedEntries[0].name).toBe('first.txt');
                            expect(sortedEntries[1].name).toBe('second.txt');

                            moveToNextFunction(null);
                        });
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });
    });

    describe('FileSystem copyTo', function () {
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

        it('Copy file to another folder', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false},
                sourcePath,
                sourceSize,
                sourceType,
                sourceName,
                oldLastModifiedDate;
            
            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getFile("some_file.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        sourcePath = result.fullPath;
                        sourceSize = result.size;
                        sourceType = result.type;
                        sourceName = result.name;
                        oldLastModifiedDate = result.lastModifiedDate;
                        moveToNextFunction(null, result);
                        }, defaultFail);
                },
                function(file, moveToNextFunction){
                    gdFileSystem.root.getDirectory("some_directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, file, result);
                    }, defaultFail);
                },
                function(file, directory, moveToNextFunction){
                    file.copyTo(directory, "some_file.txt", function (result) {
                        expect(result.isFile).toBe(true);
                        expect(result.isDirectory).toBe(false);
                        expect(sourcePath).not.toBe(result.fullPath);
                        expect(result.fullPath).toBe('/some_directory/some_file.txt');
                        expect(sourceSize).toBe(result.size);
                        expect(sourceType).toBe(result.type);
                        expect(sourceName).toBe(result.name);
                        expect(oldLastModifiedDate).toBe(result.lastModifiedDate);
                        moveToNextFunction(null, directory);
                    }, defaultFail);
                },
                function(directory, moveToNextFunction){
                    directory.removeRecursively(function(){
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('Copy directory A to directory B', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("directoryA", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, result);
                    }, defaultFail);
                },
                function(directoryA, moveToNextFunction){
                    gdFileSystem.root.getDirectory("directoryB", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, directoryA, result);
                    }, defaultFail);
                },
                function(directoryA, directoryB, moveToNextFunction){
                    directoryA.copyTo(directoryB, "directoryA", function (result) {
                        expect(result.fullPath).toBeDefined();
                        expect(result.fullPath).toBe('/directoryB/directoryA/')
                        moveToNextFunction(null, directoryA, directoryB);
                    }, defaultFail);
                },
                function(directoryA, directoryB, moveToNextFunction){
                    directoryA.removeRecursively(function(){
                        moveToNextFunction(null, directoryB);
                    }, defaultFail);
                },
                function(directoryB, moveToNextFunction){
                    directoryB.removeRecursively(function(){
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('Copy directory A to file', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};
            
            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("directoryA", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, result);
                    }, defaultFail);
                },
                function(directoryA, moveToNextFunction){
                    gdFileSystem.root.getFile("some_file.txt", options, function (result) {
                            expect(result.isDirectory).toBe(false);
                            expect(result.isFile).toBe(true);
                            moveToNextFunction(null, directoryA, result);
                        }, defaultFail);
                },
                function(directoryA, file, moveToNextFunction){
                    directoryA.copyTo(file, "directoryA", defaultFail, function () {
                        moveToNextFunction(null);
                    });
                }
            ], function(){
                done();
            });
        });
    });

    describe('FileSystem getParent', function () {
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

        it('Get parent nested directory', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, result);
                    }, defaultFail);
                },
                function(outerDirectory, moveToNextFunction){
                    gdFileSystem.root.getDirectory("directory/nested_directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, outerDirectory, result);
                    }, defaultFail);
                },
                function(outerDirectory, nestedDirectory, moveToNextFunction){
                    nestedDirectory.getParent(function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        expect(result.fullPath).toBe(outerDirectory.fullPath);
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });

        it('Get parent nested file', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("directory", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, result);
                    }, defaultFail);
                },
                function(outerDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("directory/nestedFile.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, outerDirectory, result);
                    }, defaultFail);
                },
                function(outerDirectory, nestedFile, moveToNextFunction){
                    nestedFile.getParent(function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        expect(result.fullPath).toBe(outerDirectory.fullPath);
                        moveToNextFunction(null);
                    }, defaultFail);
                }
            ], function(){
                done();
            });
        });
    });

    describe('FileSystem removeRecursively', function () {
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

        it('Remove Recursively', function (done) {
            expect(gdFileSystem).toBeDefined();
            var options = {create: true, exclusive: false};

            async.waterfall([
                function(moveToNextFunction){
                    gdFileSystem.root.getDirectory("root_dir", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, result);
                    }, defaultFail);
                },
                function(rootDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("root_dir/first.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, rootDirectory);
                    }, defaultFail);
                },
                function(rootDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("root_dir/second.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, rootDirectory);
                    }, defaultFail);
                },
                function(rootDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("root_dir/third.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, rootDirectory);
                    }, defaultFail);
                },
                function(rootDirectory, moveToNextFunction){
                    gdFileSystem.root.getDirectory("root_dir/first_dir", options, function (result) {
                        expect(result.isDirectory).toBe(true);
                        expect(result.isFile).toBe(false);
                        moveToNextFunction(null, rootDirectory);
                    }, defaultFail);
                },
                function(rootDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("root_dir/first_dir/first.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, rootDirectory);
                    }, defaultFail);
                },
                function(rootDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("root_dir/first_dir/second.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, rootDirectory);
                    }, defaultFail);
                },
                function(rootDirectory, moveToNextFunction){
                    gdFileSystem.root.getFile("root_dir/first_dir/third.txt", options, function (result) {
                        expect(result.isDirectory).toBe(false);
                        expect(result.isFile).toBe(true);
                        moveToNextFunction(null, rootDirectory);
                    }, defaultFail);
                },
                function(rootDirectory, moveToNextFunction){
                    rootDirectory.removeRecursively(function(){
                        moveToNextFunction(null);
                    }, defaultFail);
                },
            ], function(){
                done();
            });
        });
    });

});
