/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 *
 * GDStorage plugin unit tests. Local File System functionality
 */
describe('GDStorage plugin - local file system', function() {

    it('Check localFileSystem plugin installation', function() {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(requestFileSystem).toBeDefined();
        expect(resolveLocalFileSystemURI).toBeDefined();
    });

    describe('localFileSystem requestFileSystem', function() {

        it('Check localFileSystem invalid type: out of range', function(done) {
            var success = function(fileSystem) {
                expect(false).toBe(true);
                done();
            };

            var fail = function(err) {
                /**
                 * DESNOTE ovovch: should fail here, because we want to catch invalid type error.
                 */
                expect(true).toBe(true);
                done();
            }

             requestFileSystem(12, 0, success, fail);
        });

        it('Check localFileSystem invalid type: negative value', function(done) {
            var success = function(fileSystem) {
                expect(false).toBe(true);
                done();
            };

            var fail = function(err) {
                /**
                 * DESNOTE ovovch: should fail here, because we want to catch invalid type error.
                 */
                expect(true).toBe(true);
                done();
            }

            requestFileSystem(-1, 0, success, fail);
        });

        describe('localFileSystem temporary storage', function() {

            it('Check localFileSystem get secured localFileSystem', function(done) {
                var success = function(fileSystem) {
                    expect(fileSystem.name).toBe("temporary");
                    expect(fileSystem.root).not.toBe(null);
                    expect(fileSystem.root.name).not.toBe(null);
                    expect(fileSystem.root.isFile).not.toBe(null);
                    expect(fileSystem.root.isDirectory).not.toBe(null);
                    expect(fileSystem.root.fullPath).not.toBe(null);
                    done();
                };

                var fail = function(err) {
                    expect(true).toBe(false);
                    done();
                }

                requestFileSystem(LocalFileSystem.TEMPORARY, 0, success, fail);
            });

            it('Check localFileSystem get secured localFileSystem out of space', function(done) {
                var success = function(fileSystem) {
                    expect(false).toBe(true);
                    done();
                };

                var fail = function(err) {
                    /**
                     * DESNOTE ovovch: should fail here, because we want to catch of out of space error.
                     */
                    expect(true).toBe(true);
                    done();
                }

                requestFileSystem(LocalFileSystem.TEMPORARY, 1000000000000000, success, fail);
            });

            it('Check localFileSystem get secured localFileSystem invalid size', function(done) {
                var success = function(fileSystem) {
                    expect(false).toBe(true);
                    done();
                };

                var fail = function(err) {
                    /**
                     * DESNOTE ovovch: should fail here, because we want to catch of out of space error.
                     */
                    expect(true).toBe(true);
                    done();
                }

                requestFileSystem(LocalFileSystem.TEMPORARY, -1, success, fail);
            });
        });

        describe('localFileSystem persistent storage', function() {

            it('Check localFileSystem get secured localFileSystem', function(done) {
                var success = function(fileSystem) {
                    expect(fileSystem.name).toBe("persistent");
                    expect(fileSystem.root).not.toBe(null);
                    expect(fileSystem.root.name).not.toBe(null);
                    expect(fileSystem.root.isFile).not.toBe(null);
                    expect(fileSystem.root.isDirectory).not.toBe(null);
                    expect(fileSystem.root.fullPath).not.toBe(null);
                    done();
                };

                var fail = function(err) {
                    expect(true).toBe(false);
                    done();
                }

                requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
            });

            it('Check localFileSystem get secured localFileSystem out of space', function(done) {
                var success = function(fileSystem) {
                    expect(false).toBe(true);
                    done();
                };

                var fail = function(err) {
                    /**
                     * DESNOTE ovovch: should fail here, because we want to catch of out of space error.
                     */
                    expect(true).toBe(true);
                    done();
                }

                requestFileSystem(LocalFileSystem.PERSISTENT, 1000000000000000, success, fail);
            });

            it('Check localFileSystem get secured localFileSystem invalid size', function(done) {
                var success = function(fileSystem) {
                    expect(false).toBe(true);
                    done();
                };

                var fail = function(err) {
                    /**
                     * DESNOTE ovovch: should fail here, because we want to catch of out of space error.
                     */
                    expect(true).toBe(true);
                    done();
                }

                requestFileSystem(LocalFileSystem.PERSISTENT, -1, success, fail);
            });
        });
    });

    describe('localFileSystem resolveLocalFileSystemURI', function() {
        it('Check localFileSystem not existing file', function(done) {
            var success = function(fileSystem) {
                expect(false).toBe(true);
                done();
            };

            var fail = function(err) {
                expect(err.code).toBeDefined();
                expect(err.code).not.toBe(null);
                done();
            }

            resolveLocalFileSystemURI("file:///not_existing_random_file_name.txt", success, fail);
        });

        it('Check resolving directory - negative case', function(done) {
            var uri = "img";
            var INVALID_MODIFICATION_ERR = 5;

            var successCallback = function(directoryEnrty) {
                expect(false).toBe(true);
                done();
            };

            var errorCallback = function(err) {
                expect(err).toBeDefined();
                expect(err.code).toBe(INVALID_MODIFICATION_ERR);
                done();
            }

            resolveLocalFileSystemURI(uri, successCallback, errorCallback);
        });

        it('Check resolving directory, nested - negative case', function(done) {
            var uri = "data/sql";
              var INVALID_MODIFICATION_ERR = 5;

            var successCallback = function(directoryEnrty) {
                expect(false).toBe(true);
                done();
            };

            var errorCallback = function(err) {
                expect(err).toBeDefined();
                expect(err.code).toBe(INVALID_MODIFICATION_ERR);
                done();
            }

            resolveLocalFileSystemURI(uri, successCallback, errorCallback);
        });

       it('Check existing file - img/logo.png', function(done) {

            var cdvfileApplicationDirectoryFsRootName;
                if (cordova.platformId === 'android') {
                    cdvfileApplicationDirectoryFsRootName = 'assets';
                } else if (cordova.platformId === 'ios') {
                    cdvfileApplicationDirectoryFsRootName = 'bundle';
                }
            var uri = 'cdvfile://localhost/' + cdvfileApplicationDirectoryFsRootName + '/www/img/logo.png';

            var successCallback = function(fileEntry) {
                expect(fileEntry.isFile).toBe(true);
                expect(fileEntry.isDirectory).toBe(false);
                expect(fileEntry.name).toBe("logo.png");
                expect(fileEntry.fullPath).toBe("/www/img/logo.png");
                expect(fileEntry.filesystem).not.toBe(null);
                expect(fileEntry.filesystem.name).toBe(cdvfileApplicationDirectoryFsRootName);
                expect(fileEntry.filesystem.root.fullPath).toBe("/");
                expect(fileEntry.filesystem.root.name).toBe("/");
                expect(fileEntry.filesystem.root.isFile).toBe(false);
                expect(fileEntry.filesystem.root.isDirectory).toBe(true);

                var success = function(file) {
                    expect(file.localURL).toBe(uri);
                    expect(file.name).toBe("logo.png");
                    expect(file.type).toBe("image/png");
                    if (cordova.platformId === 'ios') {
                        expect(file.lastModifiedDate).toBeDefined();
                        expect(file.lastModifiedDate).not.toBe(null);
                    }
                    expect(file.size).toBeDefined();
                    expect(file.size).not.toBe(null);

                    done();
                };

                var error = function(err) {
                    expect(true).toBe(false);
                };

                fileEntry.file(success, error);
            };

            var errorCallback = function(err) {
                expect(true).toBe(false);
            };

            resolveLocalFileSystemURI(uri, successCallback, errorCallback);
        });

        it('Check existing file - img/logo.png, full path', function(done) {
            var uri = cordova.file.applicationDirectory + "www/img/logo.png";

            // The uri look like this:
            // on iOS simulator - file:///Users/<user>/Library/Developer/CoreSimulator/Devices/
            // 22E183B1-7868-42A4-8AEE-0E3DF32CE750/data/Containers/Bundle/Application/
            // 0D8D1D86-C1A8-4CD6-A79F-086A0BCCD591/UnitTest.app/www/img/logo.png
            //
            // on iOS device - file:///var/containers/Bundle/Application/
            // FCC69EF9-6FFD-4BC5-87FC-C1A65763C2DE/<appName>.app/www/img/logo.png
            //
            // on Android - file:///android_asset/www/img/logo.png

            var successCallback = function(fileEntry) {
                expect(fileEntry.isFile).toBe(true);
                expect(fileEntry.isDirectory).toBe(false);
                expect(fileEntry.name).toBe("logo.png");
                expect(fileEntry.fullPath).toContain("/www/img/logo.png");
                expect(fileEntry.filesystem).not.toBe(null);
                if(cordova.platformId !== 'ios') {
                    // NOTE: In this case we don't need to check file system name because,
                    // iOS simulator and device return different file system name
                    expect(fileEntry.filesystem.name).toBe('assets');
                }
                expect(fileEntry.filesystem.root.fullPath).toBe("/");
                expect(fileEntry.filesystem.root.name).toBe("/");
                expect(fileEntry.filesystem.root.isFile).toBe(false);
                expect(fileEntry.filesystem.root.isDirectory).toBe(true);

                var success = function(file) {
                    expect(file.localURL.indexOf(fileEntry.fullPath) > -1).toBe(true);
                    expect(file.name).toBe("logo.png");
                    expect(file.type).toBe("image/png");
                    if (cordova.platformId === 'ios') {
                        expect(file.lastModifiedDate).toBeDefined();
                        expect(file.lastModifiedDate).not.toBe(null);
                    }
                    expect(file.size).toBeDefined();
                    expect(file.size).not.toBe(null);

                    done();
                };

                var error = function(err) {
                    expect(true).toBe(false);
                };

                fileEntry.file(success, error);
            };

            var errorCallback = function(err) {
                expect(true).toBe(false);
            };

            resolveLocalFileSystemURI(uri, successCallback, errorCallback);
        });

        it('Check existing file, nested - data/sql/testDB.sqlite', function(done) {

            var cdvfileApplicationDirectoryFsRootName;
                if (cordova.platformId === 'android') {
                    cdvfileApplicationDirectoryFsRootName = 'assets';
                } else if (cordova.platformId === 'ios') {
                    cdvfileApplicationDirectoryFsRootName = 'bundle';
                }

            var uri = 'cdvfile://localhost/' + cdvfileApplicationDirectoryFsRootName + '/www/data/sql/testDB.sqlite';

            var successCallback = function(fileEntry) {
                expect(fileEntry.isFile).toBe(true);
                expect(fileEntry.isDirectory).toBe(false);
                expect(fileEntry.name).toBe("testDB.sqlite");
                expect(fileEntry.fullPath).toBe("/www/data/sql/testDB.sqlite");
                expect(fileEntry.filesystem).not.toBe(null);
                expect(fileEntry.filesystem.name).toBe(cdvfileApplicationDirectoryFsRootName);
                expect(fileEntry.filesystem.root.fullPath).toBe("/");
                expect(fileEntry.filesystem.root.name).toBe("/");
                expect(fileEntry.filesystem.root.isFile).toBe(false);
                expect(fileEntry.filesystem.root.isDirectory).toBe(true);

                var success = function(file) {
                    expect(file.localURL).toBe(uri);
                    expect(file.name).toBe("testDB.sqlite");
                    expect(file.type).toBeDefined();
                    if (cordova.platformId === 'ios') {
                        expect(file.lastModifiedDate).toBeDefined();
                        expect(file.lastModifiedDate).not.toBe(null);
                    }
                    expect(file.size).toBeDefined();
                    expect(file.size).not.toBe(null);

                    done();
                };

                var error = function(err) {
                    expect(true).toBe(false);
                };

                fileEntry.file(success, error);
            };

            var errorCallback = function(err) {
                expect(true).toBe(false);
            };

            resolveLocalFileSystemURI(uri, successCallback, errorCallback);
        });

        it('Check existing file, nested - data/sql/testDB.sqlite, full path', function(done) {
            var uri = cordova.file.applicationDirectory + "www/data/sql/testDB.sqlite";

            // The uri look like this:
            //
            // on iOS simulator - file:///Users/<user>/Library/Developer/CoreSimulator/Devices/
            // 22E183B1-7868-42A4-8AEE-0E3DF32CE750/data/Containers/Bundle/Application/
            // 0D8D1D86-C1A8-4CD6-A79F-086A0BCCD591/UnitTest.app/www/data/sql/testDB.sqlite
            //
            // on iOS device - file:///var/containers/Bundle/Application/
            // FCC69EF9-6FFD-4BC5-87FC-C1A65763C2DE/<appName>.app/www/data/sql/testDB.sqlite
            //


            var successCallback = function(fileEntry) {
                expect(fileEntry.isFile).toBe(true);
                expect(fileEntry.isDirectory).toBe(false);
                expect(fileEntry.name).toBe("testDB.sqlite");
                expect(fileEntry.fullPath).toContain("/www/data/sql/testDB.sqlite");
                expect(fileEntry.filesystem).not.toBe(null);
                if(cordova.platformId !== 'ios') {
                    // NOTE: In this case we don't need to check file system name because,
                    // iOS simulator and device return different file system name
                    expect(fileEntry.filesystem.name).toBe('assets');
                }
                expect(fileEntry.filesystem.root.fullPath).toBe("/");
                expect(fileEntry.filesystem.root.name).toBe("/");
                expect(fileEntry.filesystem.root.isFile).toBe(false);
                expect(fileEntry.filesystem.root.isDirectory).toBe(true);

                var success = function(file) {
                    expect(file.localURL.indexOf(fileEntry.fullPath) > -1).toBe(true);
                    expect(file.name).toBe("testDB.sqlite");
                    expect(file.type).toBeDefined();
                    if (cordova.platformId === 'ios') {
                        expect(file.lastModifiedDate).toBeDefined();
                        expect(file.lastModifiedDate).not.toBe(null);
                    }
                    expect(file.size).toBeDefined();
                    expect(file.size).not.toBe(null);

                    done();
                };

                var error = function(err) {
                    expect(true).toBe(false);
                };

                fileEntry.file(success, error);
            };

            var errorCallback = function(err) {
                expect(true).toBe(false);
            };

            resolveLocalFileSystemURI(uri, successCallback, errorCallback);
        });

        it('Check existing file, not nested - file in www', function(done) {

            var cdvfileApplicationDirectoryFsRootName;
                if (cordova.platformId === 'android') {
                    cdvfileApplicationDirectoryFsRootName = 'assets';
                } else if (cordova.platformId === 'ios') {
                    cdvfileApplicationDirectoryFsRootName = 'bundle';
                }
            var basename = "config.xml";
            var filepath = "/" + basename;
            if (cordova.platformId === 'android') {
                basename = "cordova.js";
                filepath = "/www/" + basename;
            }
            var uri = 'cdvfile://localhost/' + cdvfileApplicationDirectoryFsRootName + filepath

            var successCallback = function(fileEntry) {
                expect(fileEntry.isFile).toBe(true);
                expect(fileEntry.isDirectory).toBe(false);
                expect(fileEntry.name).toBe(basename);
                expect(fileEntry.fullPath).toBe(filepath);
                expect(fileEntry.filesystem).not.toBe(null);
                expect(fileEntry.filesystem.name).toBe(cdvfileApplicationDirectoryFsRootName);
                expect(fileEntry.filesystem.root.fullPath).toBe("/");
                expect(fileEntry.filesystem.root.name).toBe("/");
                expect(fileEntry.filesystem.root.isFile).toBe(false);
                expect(fileEntry.filesystem.root.isDirectory).toBe(true);

                var success = function(file) {
                    expect(file.localURL).toBe(uri);
                    expect(file.name).toBe(basename);
                    expect(file.type).toBeDefined();
                    if (cordova.platformId === 'ios') {
                        expect(file.lastModifiedDate).toBeDefined();
                        expect(file.lastModifiedDate).not.toBe(null);
                    }
                    expect(file.size).toBeDefined();
                    expect(file.size).not.toBe(null);

                    done();
                };

                var error = function(err) {
                    expect(true).toBe(false);
                };

                fileEntry.file(success, error);
            };

            var errorCallback = function(err) {
                expect(true).toBe(false);
            };

            resolveLocalFileSystemURI(uri, successCallback, errorCallback);
        });

        it('Check existing file, not nested - file in www, full path', function(done) {
            var uri = cordova.file.applicationDirectory + "www/cordova.js";

            // The uri look like this:
            //
            // on iOS simulator - file:///Users/<user>/Library/Developer/CoreSimulator/Devices/
            // 22E183B1-7868-42A4-8AEE-0E3DF32CE750/data/Containers/Bundle/Application/
            // 0D8D1D86-C1A8-4CD6-A79F-086A0BCCD591/UnitTest.app/www/cordova.js
            //
            // on iOS device - file:///var/containers/Bundle/Application/
            // FCC69EF9-6FFD-4BC5-87FC-C1A65763C2DE/<appName>.app/www/cordova.js
            //
            // on Android - file:///android_asset/www/cordova.js

            var successCallback = function(fileEntry) {
                expect(fileEntry.isFile).toBe(true);
                expect(fileEntry.isDirectory).toBe(false);
                expect(fileEntry.name).toBe("cordova.js");
                expect(fileEntry.fullPath).toContain("/www/cordova.js");
                expect(fileEntry.filesystem).not.toBe(null);
                if(cordova.platformId !== 'ios') {
                    // NOTE: In this case we don't need to check file system name because,
                    // iOS simulator and device return different file system name
                    expect(fileEntry.filesystem.name).toBe('assets');
                }
                expect(fileEntry.filesystem.root.fullPath).toBe("/");
                expect(fileEntry.filesystem.root.name).toBe("/");
                expect(fileEntry.filesystem.root.isFile).toBe(false);
                expect(fileEntry.filesystem.root.isDirectory).toBe(true);

                var success = function(file) {
                    expect(file.localURL.indexOf(fileEntry.fullPath) > -1).toBe(true);
                    expect(file.name).toBe("cordova.js");
                    expect(file.type).toBeDefined();
                    if (cordova.platformId === 'ios') {
                        expect(file.lastModifiedDate).toBeDefined();
                        expect(file.lastModifiedDate).not.toBe(null);
                    }
                    expect(file.size).toBeDefined();
                    expect(file.size).not.toBe(null);

                    done();
                };

                var error = function(err) {
                    expect(true).toBe(false);
                };

                fileEntry.file(success, error);
            };

            var errorCallback = function(err) {
                expect(true).toBe(false);
            };

            resolveLocalFileSystemURI(uri, successCallback, errorCallback);
        });

    });

});
