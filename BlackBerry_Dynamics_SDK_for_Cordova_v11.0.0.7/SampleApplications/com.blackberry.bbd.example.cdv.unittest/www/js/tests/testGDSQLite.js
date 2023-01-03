/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 * 
 * GDSQLite plugin unit tests.
 */
describe('GDSQLite plugin installed', function() {
    var defaultFail = function(error) {
        alert(error);
        expect(true).toBe(false);
    };
    it('Check GDSQLite plugin installation', function() {
        expect(window).toBeDefined();
        expect(window.openDatabase).toBeDefined();
    });
    it('Run transaction check insert and update', function(done) {
        var selectSQLsuccessCB = function(tx, result) {
                expect(true).toBe(true);
            },
            insertSuccess = function(tx, result) {
                if (result.rowsAffected) {
                    expect(result.rowsAffected).toBe(1);
                } else {
                    expect(true).toBe(false);
                }
            },
            querySuccess = function(tx, result) {
                var len = result.rows.length,
                    one = 1,
                    two = 2,
                    three = 3,
                    four = 4;
                expect(len).toBe(4);
                expect(result.rows.item(0).id.toString()).toBe(one.toString());
                expect(result.rows.item(0).data).toBe("First row");
                expect(result.rows.item(1).id.toString()).toBe(two.toString());
                expect(result.rows.item(1).data).toBe("Second row");
                expect(result.rows.item(2).id.toString()).toBe(three.toString());
                expect(result.rows.item(2).data).toBe("Third row");
                expect(result.rows.item(3).id.toString()).toBe(four.toString());
                expect(result.rows.item(3).data).toBe("Fourth row");
            },
            errorCB = function(tx, err) {
                expect(true).toBe(false);
            },
            errorTCB = function(tx, err) {
                expect(true).toBe(false);
            };
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB.db", "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                }, defaultFail);
                moveToNextFunction(null, db);
            },
            function(db, moveToNextFunction) {
                db.transaction(function(tx) {
                    tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
                    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, "First row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, "Second row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, "Third row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, "Fourth row"], insertSuccess, errorCB);
                    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
                }, errorTCB, function() {
                    moveToNextFunction(null, db);
                });
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });
    it('Run transaction with errors', function(done) {
        var selectSQLsuccessCB = function(tx, result) {
                expect(true).toBe(true);
            },
            insertSuccess = function(tx, result) {
                if (result.rowsAffected) {
                    expect(result.rowsAffected).toBe(1);
                } else {
                    expect(true).toBe(false);
                }
            },
            querySuccess = function(tx, result) {
                // DISNOTE: its is non-positive case
                expect(true).toBe(true);
            },
            errorCB = function(tx, err) {
                // DISNOTE: its is positive case
                expect(true).toBe(true);
            },
            errorTCB = function(tx, err) {
                // DISNOTE: its is positive case
                alert("transaction failed");
                expect(true).toBe(false);
            };
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB3.db", "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                }, defaultFail);
                moveToNextFunction(null, db);
            },
            function(db, moveToNextFunction) {
                db.transaction(function(tx) {
                    tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
                    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, "First row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, "Second row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, "Third row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, "Fourth row"], insertSuccess, errorCB);
                    tx.executeSql('SELECT *343 FROM DEMO', [], querySuccess, errorCB);
                }, function() {
                    moveToNextFunction(null, db);
                }, errorTCB);
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });
    it('Run nested transaction', function(done) {
        var errorTCB = function(tx, err) {
            alert("transaction failed");
            expect(true).toBe(false);
        };
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB4.db", "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                }, defaultFail);
                moveToNextFunction(null, db);
            },
            function(db, moveToNextFunction) {
                db.transaction(function(tx) {
                    tx.executeSql('DROP TABLE IF EXISTS test_table');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
                    tx.executeSql('INSERT INTO test_table (data, data_num) VALUES (?,?)', ["test", 100], function(tx, res) {
                        if (res.rowsAffected) {
                            expect(res.rowsAffected).toBe(1);
                        } else {
                            expect(true).toBe(false);
                        }
                        tx.executeSql('SELECT COUNT(id) AS CNT FROM test_table;', [], function(tx, res) {
                            if (res.rows) {
                                expect(res.rows.length).toBe(1);
                            } else {
                                expect(true).toBe(false);
                            }
                        });
                    });
                }, errorTCB, function() {
                    moveToNextFunction(null, db);
                });
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });
    it('Run openDatabase', function(done) {
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB.db", "1.0", "CordovaDemo", 200000, function() {
                    moveToNextFunction(null, db);
                }, defaultFail);

            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });
    it('Run SQLite deleteDatabase', function(done) {
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB.db", "1.0", "CordovaDemo", 200000, function() {
                    moveToNextFunction(null, db);
                }, defaultFail);
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                window.sqlitePlugin.deleteDatabase("testDB.db", function(success) {
                    moveToNextFunction(null, db);
                }, defaultFail);
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                window.openDatabase("testDB.db", "1.0", "CordovaDemo", 200000, function() {
                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });
    it('Run SQLite deleteDatabase with additional check for inserted data does not exist in database after deleting it', function(done) {
        // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close, deleteDatabase
        // openDatabase, transaction (SELECT), close, deleteDatabase
        var databaseName = 'testDeleteDatabase.db';
        var selectSQLsuccessCB = function(tx, result) {
                expect(true).toBe(true);
            },
            insertSuccess = function(tx, result) {
                if (result.rowsAffected) {
                    expect(result.rowsAffected).toBe(1);
                } else {
                    expect(true).toBe(false);
                }
            },
            querySuccess = function(tx, result) {
                var len = result.rows.length,
                    one = 1,
                    two = 2,
                    three = 3,
                    four = 4;
                expect(len).toBe(4);
                expect(result.rows.item(0).id.toString()).toBe(one.toString());
                expect(result.rows.item(0).data).toBe('First row');
                expect(result.rows.item(1).id.toString()).toBe(two.toString());
                expect(result.rows.item(1).data).toBe('Second row');
                expect(result.rows.item(2).id.toString()).toBe(three.toString());
                expect(result.rows.item(2).data).toBe('Third row');
                expect(result.rows.item(3).id.toString()).toBe(four.toString());
                expect(result.rows.item(3).data).toBe('Fourth row');
            },
            errorCB = function(tx, err) {
                expect(true).toBe(false);
            },
            errorTCB = function(tx, err) {
                // DEVNOTE: should not get here
                expect('Transaction should not fail').toBe(true);
                defaultFail();
            };
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase(databaseName, "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                    moveToNextFunction(null, db);
                }, defaultFail);
            },
            function(db, moveToNextFunction) {
                db.transaction(function(tx) {
                    tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
                    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
                    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
                }, errorTCB, function() {
                    moveToNextFunction(null, db);
                });
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null);
                }, defaultFail);
            },
            function(moveToNextFunction) {
                window.sqlitePlugin.deleteDatabase(databaseName, function() {
                    moveToNextFunction(null);
                }, function(error) {
                    // DEVNOTE: should not get here
                    expect('Deleting database should not fail').toBe(true);
                    defaultFail();
                });
            },
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase(databaseName, "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                    moveToNextFunction(null, db);
                }, defaultFail);
            },
            function(db, moveToNextFunction) {
                var expectedErrorMessage = 'no such table: DEMO';
                db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM DEMO', [], function() {
                        expect('SELECT query from not existing table should fail').toBe(true);
                        defaultFail();
                    }, function(tx, error) {
                        expect(error.message).toContain(expectedErrorMessage);
                    });
                }, function() {
                    moveToNextFunction(null, db);
                }, errorTCB);
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null);
                }, defaultFail);
            },
            function(moveToNextFunction) {
                window.sqlitePlugin.deleteDatabase(databaseName, function() {
                    moveToNextFunction(null);
                }, function(error) {
                    // DEVNOTE: should not get here
                    expect('Deleting database should not fail').toBe(true);
                    defaultFail(error);
                });
            }
        ], function() {
            done();
        });
    });
    it('Run SQLite 2 methods openDatabase, INSERT queries ', function(done) {
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB2.db", "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                }, defaultFail);
                moveToNextFunction(null, db);
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.transaction(function(tx) {
                    tx.executeSql('DROP TABLE IF EXISTS test_table_for_performance');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS test_table_for_performance ' +
                        '(id integer primary key, data text, data_num integer, name text, age integer, job text)');
                    for (var i = 0; i < 2; i += 1) {
                        tx.executeSql('INSERT INTO test_table_for_performance (data, data_num, name, age, job) VALUES (?,?,?,?,?)',
                            ["test" + i, i, "name" + i, 50, "job" + i],
                            function(tx, res) {});
                    }
                }, defaultFail, function() {
                    moveToNextFunction(null, db);
                });
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function(success) {
                    moveToNextFunction(null, db);
                }, defaultFail);
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.transaction(function(tx) {
                    tx.executeSql('DROP TABLE IF EXISTS test_table_for_performance');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS test_table_for_performance ' +
                        '(id integer primary key, data text, data_num integer, name text, age integer, job text)');
                    for (var i = 0; i < 2; i += 1) {
                        tx.executeSql('INSERT INTO test_table_for_performance (data, data_num, name, age, job) VALUES (?,?,?,?,?)',
                            ["test" + i, i, "name" + i, 50, "job" + i],
                            function(tx, res) {});
                    }
                }, function(error) {
                    moveToNextFunction(null);
                });
            }
        ], function() {
            done();
        });
    });
    it('Run 2 methods openDatabase', function(done) {
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB.db", "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                }, defaultFail);
                moveToNextFunction(null, db);
            },
            function(db, moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB.db", "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                }, defaultFail);
                moveToNextFunction(null, db);
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });
    it('Run 2 methods for close database', function(done) {
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB.db", "1.0", "CordovaDemo", 200000, function() {
                    moveToNextFunction(null, db);
                }, defaultFail);
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null, db);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });
    it('Run transaction insert and select check', function(done) {
        var selectSQLsuccessCB = function(tx, result) {
                expect(true).toBe(true);
            },
            insertSuccess = function(tx, result) {
                if (result.rowsAffected) {
                    expect(result.rowsAffected).toBe(1);
                } else {
                    expect(true).toBe(false);
                }
            },
            updateSuccess = function(tx, result) {
                expect(true).toBe(true);
            }
        querySuccess = function(tx, result) {
                var len = result.rows.length,
                    one = 1,
                    two = 2,
                    three = 3,
                    four = 4;
                expect(len).toBe(4);
                expect(result.rows.item(0).id.toString()).toBe(one.toString());
                expect(result.rows.item(0).data).toBe("row updated");
                expect(result.rows.item(1).id.toString()).toBe(two.toString());
                expect(result.rows.item(1).data).toBe("row updated");
                expect(result.rows.item(2).id.toString()).toBe(three.toString());
                expect(result.rows.item(2).data).toBe("row updated");
                expect(result.rows.item(3).id.toString()).toBe(four.toString());
                expect(result.rows.item(3).data).toBe("row updated");
            },
            errorCB = function(tx, err) {
                expect(true).toBe(false);
            },
            errorTCB = function(tx, err) {
                expect(true).toBe(false);
            };
        async.waterfall([
            function(moveToNextFunction) {
                var db;
                db = window.openDatabase("testDB.db", "1.0", "CordovaDemo", 200000, function() {
                    expect(true).toBe(true);
                }, defaultFail);
                moveToNextFunction(null, db);
            },
            function(db, moveToNextFunction) {
                db.transaction(function(tx) {
                    tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
                    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, "First row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, "Second row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, "Third row"], insertSuccess, errorCB);
                    tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, "Fourth row"], insertSuccess, errorCB);
                    tx.executeSql('UPDATE DEMO SET DATA = ?', ["row updated"], updateSuccess, errorCB);
                    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
                }, errorTCB, function() {
                    moveToNextFunction(null, db);
                });
            },
            function(db, moveToNextFunction) {
                expect(db).toBeDefined();
                db.close(function() {
                    moveToNextFunction(null);
                }, defaultFail);
            }
        ], function() {
            done();
        });
    });
});