/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 * 
 * GDStorage plugin unit tests. sql3encimport functionality
 */
describe('GDStorage sql3encimport test', function() {
    var defaultFail = function(error) {
        console.log('Error:', error || 'not specified');
        expect(true).toBe(false);
    };

    it('Check GDStorage sql3encimport installation', function() {
        expect(window).toBeDefined();
        expect(window.plugins).toBeDefined();
        expect(sqlite3enc_import).toBeDefined();
    });

    var gdFileSystem;

    beforeEach(function(done) {
        requestFileSystem(LocalFileSystem.APPKINETICS, 0, function(fileSystem) {
            gdFileSystem = fileSystem;
            done();
        }, null);
    });

    afterEach(function() {
        gdFileSystem = null;
    });

    it('Import SQL database', function(done) {
        async.waterfall([
            function(moveToNextFunction) {

                window.plugins.GDAppKineticsPlugin.copyFilesToSecureFileSystem(function(result) {
                    var options = {create: false, exclusive: false};

                    gdFileSystem.root.getFile("/data/sql/testDB.sqlite", options, function(fileEntry) {
                        expect(fileEntry.isDirectory).toBe(false);
                        expect(fileEntry.isFile).toBe(true);

                        moveToNextFunction(null, fileEntry);
                    }, defaultFail);
                });

            },
            function(fileEntry, moveToNextFunction) {

                sqlite3enc_import(fileEntry.fullPath, "SQLite3enc2.db", function(dbFile) {
                    expect(dbFile.name).toBe("SQLite3enc2.db");
                    expect(dbFile.fullPath.includes("/SQLite3enc2.db")).toBe(true);

                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });

    it('Import SQL database, open imported database (iosDatabaseLocation: "Documents"), check data existence', function(done) {
        async.waterfall([
            function(moveToNextFunction) {

                window.plugins.GDAppKineticsPlugin.copyFilesToSecureFileSystem(function(result) {
                    var options = {create: false, exclusive: false};

                    gdFileSystem.root.getFile("/data/sql/testDB.sqlite", options, function(fileEntry) {
                        expect(fileEntry.isDirectory).toBe(false);
                        expect(fileEntry.isFile).toBe(true);

                        moveToNextFunction(null, fileEntry);
                    }, defaultFail);
                });

            },
            function(fileEntry, moveToNextFunction) {

                sqlite3enc_import(fileEntry.fullPath, "SQLite3encTestData.db", function(dbFile) {
                    expect(dbFile.name).toBe("SQLite3encTestData.db");
                    expect(dbFile.fullPath.includes("/SQLite3encTestData.db")).toBe(true);

                    moveToNextFunction(null, dbFile);
                }, defaultFail);
            },
            function(dbFile, moveToNextFunction) {
                var db;
                db = window.sqlitePlugin.openDatabase({ name: dbFile.name, iosDatabaseLocation: 'Documents' }, function() {
                    expect(true).toBe(true);
                    moveToNextFunction(null, db);
                }, defaultFail);
            },
            function(db, moveToNextFunction) {
                db.transaction(function(tx) {
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function(tx, result) {
                        var expectedTablesNumber = 1;
                        var expectedTableName = "demo";

                        expect(result.rows.item(0)).toBeDefined();
                        expect(result.rows.item(0).name).toBe(expectedTableName);
                    }, defaultFail);

                    tx.executeSql("SELECT * FROM demo", [], function(tx, result) {
                        var expectedDbDataList = [
                            {
                                id: 1,
                                name: "SqLite",
                                hint: "is a relational database management system contained in a C programming library"
                            },
                            {
                                id: 2,
                                name: "jQuery",
                                hint: "is a cross-platform JavaScript library designed to simplify the client-side scripting of HTML"
                            },
                            {
                                id: 3,
                                name: "HTML5",
                                hint: "is a core technology markup language of the Internet used for structuring and presenting content for the World Wide Web"
                            }
                        ];

                        expect(result.rows.length).toBe(expectedDbDataList.length);
                        expect(result.rows.item(0)).toBeDefined();
                        expect(result.rows.item(0)).toEqual(expectedDbDataList[0]);
                        expect(result.rows.item(1)).toBeDefined();
                        expect(result.rows.item(1)).toEqual(expectedDbDataList[1]);
                        expect(result.rows.item(2)).toBeDefined();
                        expect(result.rows.item(2)).toEqual(expectedDbDataList[2]);
                    }, defaultFail);

                }, defaultFail, function() {
                    moveToNextFunction(null, db);
                });
            }
        ], function() {
            done();
        });
    });

});
