/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 * 
 * GDSQLite plugin unit tests.
 */
describe('SQLite API', function() {
    var defaultFail = function(error) {
        console.log('SQLite error:', error || 'not specified');
        expect(true).toBe(false);
    };
    it('Check SQLite Storage is available', function() {
        expect(window.sqlitePlugin).toBeDefined();
        expect(window.sqlitePlugin.openDatabase).toBeDefined();
        expect(window.sqlitePlugin.deleteDatabase).toBeDefined();
    });
    describe('SQLite database: openDatabase, close, deleteDatabase', function() {
        it('SQLite: openDatabase, close', function(done) {
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: 'testDB1.db', location: 'default' }, function() {
                        expect(true).toBe(true);
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
        it('SQLite: openDatabase at location - default (Library/LocalDatabase), close, deleteDatabase', function(done) {
            var databaseName = 'testLocationDefault.db';
            var databaseLocation = 'default';
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(function() {
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
                        moveToNextFunction(null);
                    }, function(error) {
                        expect('Deleting database should not fail').toBe(true);
                        defaultFail(error);
                    });
                },
            ], function() {
                done();
            });
        });
        it('SQLite: openDatabase at iosDatabaseLocation - Library, close, deleteDatabase', function(done) {
            var databaseName = 'testLocationLibrary.db';
            var databaseLocation = 'Library';
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(function() {
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        moveToNextFunction(null);
                    }, function(error) {
                        // DEVNOTE: should not get here
                        expect('Deleting database should not fail').toBe(true);
                        defaultFail(error);
                    });
                },
            ], function() {
                done();
            });
        });
        it('SQLite: openDatabase at iosDatabaseLocation - Documents, close, deleteDatabase', function(done) {
            var databaseName = 'testLocationDocuments.db';
            var databaseLocation = 'Documents';
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(function() {
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        moveToNextFunction(null);
                    }, function(error) {
                        // DEVNOTE: should not get here
                        expect('Deleting database should not fail').toBe(true);
                        defaultFail(error);
                    });
                },
            ], function() {
                done();
            });
        });
        it('SQLite: run 2 times openDatabase for the same database - positive case', function(done) {
            var databaseName = 'testDB2.db';
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: 'default' }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: 'default' }, function() {
                        expect(true).toBe(true);
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
        it('SQLite: run 2 times close database for the same database - negative case', function(done) {
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: 'testDB3.db', location: 'default' }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(function() {
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(defaultFail, function(error) {
                        // DEVNOTE: should get here, as database was already closed
                        moveToNextFunction(null);
                    });
                }
            ], function() {
                done();
            });
        });
        it('SQLite: deleteDatabase', function(done) {
            var databaseName = 'testDBDelete.db';
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: 'default' }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, location: 'default' }, function() {
                        moveToNextFunction(null);
                    }, function(error) {
                        // DEVNOTE: should not get here
                        expect('Deleting database should not fail').toBe(true);
                        defaultFail(error);
                    })
                },
                function(moveToNextFunction) {
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: 'default' }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null);
                    }, defaultFail);
                },
            ], function() {
                done();
            });
        });
    });
    describe('SQLite transactions', function() {
        it('SQLite: run transaction with INSERT, SELECT queries', function(done) {
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
                        one = 1, two = 2, three = 3, four = 4;
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
                    db = window.sqlitePlugin.openDatabase({ name: 'testDBBasicTransactions', location: 'default' }, function() {
                        expect(true).toBe(true);
                    }, defaultFail);
                    moveToNextFunction(null, db);
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
                }
            ], function() {
                done();
            });
        });
        it('SQLite: run transaction with INSERT, UPDATE and SELECT queries', function(done) {
            var selectSQLsuccessCB = function(tx, result) {
                expect(true).toBe(true);
            },
                insertSuccess = function(tx, result) {
                    if (result.rowsAffected) {
                        expect(result.rowsAffected).toBe(1);
                    } else {
                        expect(true).toBe(false);
                    }
                }, updateSuccess = function(tx, result) {
                    expect(true).toBe(true);
                }
            querySuccess = function(tx, result) {
                var len = result.rows.length,
                    one = 1, two = 2, three = 3, four = 4;
                expect(len).toBe(4);
                expect(result.rows.item(0).id.toString()).toBe(one.toString());
                expect(result.rows.item(0).data).toBe('row updated');
                expect(result.rows.item(1).id.toString()).toBe(two.toString());
                expect(result.rows.item(1).data).toBe('row updated');
                expect(result.rows.item(2).id.toString()).toBe(three.toString());
                expect(result.rows.item(2).data).toBe('row updated');
                expect(result.rows.item(3).id.toString()).toBe(four.toString());
                expect(result.rows.item(3).data).toBe('row updated');
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
                    db = window.sqlitePlugin.openDatabase({ name: 'testDBBasicTransactions2', location: 'default' }, function() {
                        expect(true).toBe(true);
                    }, defaultFail);
                    moveToNextFunction(null, db);
                },
                function(db, moveToNextFunction) {
                    db.transaction(function(tx) {
                        tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
                        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, 'First row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
                        tx.executeSql('UPDATE DEMO SET DATA = ?', ['row updated'], updateSuccess, errorCB);
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
        it('SQLite: run transaction with errors', function(done) {
            var databaseName = 'testDBCheckTransactionWithError.db';
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
                    expect(true).toBeFalse(false);
                },
                queryFailure = function(tx, err) {
                    expect(err.message).toContain('syntax error');
                },
                errorCB = function(tx, err) {
                    // DEVNOTE: should get here
                    expect(tx.message).toContain('syntax error');
                },
                successTCB = function(tx, err) {
                    // DEVNOTE: should not get here
                    expect('Transaction should fail').toBe(true);
                    defaultFail();
                };
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: 'default' }, function() {
                        expect(true).toBe(true);
                    }, defaultFail);
                    moveToNextFunction(null, db);
                },
                function(db, moveToNextFunction) {
                    db.transaction(function(tx) {
                        tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
                        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, '11 row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
                        tx.executeSql('SELECT *343 FROM DEMO', [], querySuccess, queryFailure);
                    }, function(err) {
                        // DEVNOTE: Transaction should fail due to syntax error in SQL query
                        expect(err.message).toContain('syntax error');
                        moveToNextFunction(null, db);
                    }, successTCB);
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
        it("SQLite: run transaction with errors, check transaction wasn't executed", function(done) {
            var databaseName = 'testDBCheckTransactionWithError2.db';
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
                    expect(true).toBeFalse(false);
                },
                queryFailure = function(tx, err) {
                    expect(err.message).toContain('syntax error');
                },
                errorCB = function(tx, err) {
                    // DEVNOTE: should get here
                    expect(tx.message).toContain('syntax error');
                },
                successTCB = function(tx, err) {
                    // DEVNOTE: should not get here
                    expect('Transaction should fail').toBe(true);
                    defaultFail();
                };
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: 'default' }, function() {
                        expect(true).toBe(true);
                    }, defaultFail);
                    moveToNextFunction(null, db);
                },
                function(db, moveToNextFunction) {
                    db.transaction(function(tx) {
                        tx.executeSql('DROP TABLE IF EXISTS DEMO', [], selectSQLsuccessCB, errorCB);
                        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id integer primary key, data)', [], selectSQLsuccessCB, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [1, '11 row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [2, 'Second row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR REPLACE INTO DEMO (id, data) VALUES (?,?)', [3, 'Third row'], insertSuccess, errorCB);
                        tx.executeSql('INSERT OR ROLLBACK INTO DEMO (id, data) VALUES (?,?)', [4, 'Fourth row'], insertSuccess, errorCB);
                        tx.executeSql('SELECT *343 FROM DEMO', [], querySuccess, queryFailure);
                    }, function(err) {
                        // DEVNOTE: Transaction should fail due to syntax error in SQL query
                        expect(err.message).toContain('syntax error');
                        moveToNextFunction(null, db);
                    }, successTCB);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(function() {
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: 'default' }, function() {
                        expect(true).toBe(true);
                    }, defaultFail);
                    moveToNextFunction(null, db);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.transaction(function(tx) {
                        tx.executeSql('SELECT * FROM DEMO', [], defaultFail, function(tx, err) {
                            var expectedErrorMessage = 'no such table';
                            expect(err.message).toContain(expectedErrorMessage);
                            moveToNextFunction(null);
                        });
                    });
                }
            ], function() {
                done();
            });
        });
        it('SQLite: run nested transaction', function(done) {
            var errorTCB = function(tx, err) {
                // DEVNOTE: should not get here
                expect('Transaction should not fail').toBe(true);
                defaultFail();
            };
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: 'testDBNestedTransaction', location: 'default' }, function() {
                        expect(true).toBe(true);
                    }, defaultFail);
                    moveToNextFunction(null, db);
                },
                function(db, moveToNextFunction) {
                    db.transaction(function(tx) {
                        tx.executeSql('DROP TABLE IF EXISTS test_table');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
                        tx.executeSql('INSERT INTO test_table (data, data_num) VALUES (?,?)', ['test', 100], function(tx, res) {
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
        it('SQLite: run 2 transactions, second after closing database - negative case', function(done) {
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: 'testDBClosedTransaction', location: 'default' }, function() {
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
                                ['test' + i, i, 'name' + i, 50, 'job' + i]);
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
                                ['test' + i, i, 'name' + i, 50, 'job' + i]);
                        }
                    }, function(error) {
                        var expectedErrorMessage = 'database not open';
                        expect(error.message).toBe(expectedErrorMessage);
                        moveToNextFunction(null);
                    }, function(tx, result) {
                        // DEVNOTE: should not get here
                        expect('Should fail transaction, when database is already closed').toBe(true);
                        defaultFail();
                    });
                }
            ], function() {
                done();
            });
        });
    });
    describe('SQLite multiple commands scenarios', function() {
        it('SQLite: location - default: check inserted data exists in database after closing and opening it again', function(done) {
            // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close
            // openDatabase, run transaction (SELECT), close, deleteDatabase
            var databaseName = 'testDBDefault1.db';
            var databaseLocation = 'default';
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
                        one = 1, two = 2, three = 3, four = 4;
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
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: databaseLocation }, function() {
                        expect(true).toBe(true);
                    }, defaultFail);
                    moveToNextFunction(null, db);
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
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    db.transaction(function(tx) {
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
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
                        moveToNextFunction(null);
                    }, function(error) {
                        // DEVNOTE: should not get here
                        expect('Deleting database should not fail').toBe(true);
                        defaultFail();
                    });
                }
            ], function() {
                done();
            });
        });
        it('SQLite: location - default: check inserted data does not exist in database after deleting it', function(done) {
            // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close, deleteDatabase
            // openDatabase, transaction (SELECT), close, deleteDatabase
            var databaseName = 'testDBDefault2.db';
            var databaseLocation = 'default';
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
                        one = 1, two = 2, three = 3, four = 4;
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
                    expect(true).toBe(false);
                    // DEVNOTE: should not get here
                    expect('Transaction should not fail').toBe(true);
                    defaultFail();
                };
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: databaseLocation }, function() {
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
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
                        moveToNextFunction(null);
                    }, function(error) {
                        // DEVNOTE: should not get here
                        expect('Deleting database should not fail').toBe(true);
                        defaultFail();
                    });
                },
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, location: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    var expectedErrorMessage = 'no such table: DEMO';
                    db.transaction(function(tx) {
                        tx.executeSql('SELECT * FROM DEMO', [], defaultFail, function(tx, error) {
                            expect(error.message).toContain(expectedErrorMessage);
                        });
                    }, function(error) {
                        expect(error.message).toContain(expectedErrorMessage);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(function() {
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, location: databaseLocation }, function() {
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
        it('SQLite: iosDatabaseLocation - Library: check inserted data exists in database after closing and opening it again', function(done) {
            // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close
            // openDatabase, run transaction (SELECT), close, deleteDatabase
            var databaseName = 'testDBLibrary1.db';
            var databaseLocation = 'Library';
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
                        one = 1, two = 2, three = 3, four = 4;
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
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
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
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    db.transaction(function(tx) {
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
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
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
        it('SQLite: iosDatabaseLocation - Library: check inserted data does not exist in database after deleting it', function(done) {
            // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close, deleteDatabase
            // openDatabase, transaction (SELECT), close, deleteDatabase
            var databaseName = 'testDBLibrary2.db';
            var databaseLocation = 'Library';
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
                        one = 1, two = 2, three = 3, four = 4;
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
                    expect(true).toBe(false);
                    // DEVNOTE: should not get here
                    expect('Transaction should not fail').toBe(true);
                    defaultFail();
                };
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
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
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        moveToNextFunction(null);
                    }, function(error) {
                        // DEVNOTE: should not get here
                        expect('Deleting database should not fail').toBe(true);
                        defaultFail(error);
                    });
                },
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    var expectedErrorMessage = 'no such table: DEMO';
                    db.transaction(function(tx) {
                        tx.executeSql('SELECT * FROM DEMO', [], defaultFail, function(tx, error) {
                            expect(error.message).toContain(expectedErrorMessage);
                        });
                    }, function(error) {
                        expect(error.message).toContain(expectedErrorMessage);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(function() {
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
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
        it('SQLite: iosDatabaseLocation - Documents: check inserted data exists in database after closing and opening it again', function(done) {
            // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close
            // openDatabase, run transaction (SELECT), close, deleteDatabase
            var databaseName = 'testDBDocuments1.db';
            var databaseLocation = 'Documents';
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
                        one = 1, two = 2, three = 3, four = 4;
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
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
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
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    db.transaction(function(tx) {
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
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
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
        it('SQLite: iosDatabaseLocation - Documents: check inserted data does not exist in database after deleting it', function(done) {
            // DEVNOTE: openDatabase, transaction (CREATE, INSERT, SELECT), close, deleteDatabase
            // openDatabase, transaction (SELECT), close, deleteDatabase
            var databaseName = 'testDBDocuments2.db';
            var databaseLocation = 'Documents';
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
                        one = 1, two = 2, three = 3, four = 4;
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
                    expect(true).toBe(false);
                    // DEVNOTE: should not get here
                    expect('Transaction should not fail').toBe(true);
                    defaultFail();
                };
            async.waterfall([
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
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
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        moveToNextFunction(null);
                    }, function(error) {
                        // DEVNOTE: should not get here
                        expect('Deleting database should not fail').toBe(true);
                        defaultFail(error);
                    });
                },
                function(moveToNextFunction) {
                    var db;
                    db = window.sqlitePlugin.openDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
                        expect(true).toBe(true);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    var expectedErrorMessage = 'no such table: DEMO';
                    db.transaction(function(tx) {
                        tx.executeSql('SELECT * FROM DEMO', [], defaultFail, function(tx, error) {
                            expect(error.message).toContain(expectedErrorMessage);
                        });
                    }, function(error) {
                        expect(error.message).toContain(expectedErrorMessage);
                        moveToNextFunction(null, db);
                    }, defaultFail);
                },
                function(db, moveToNextFunction) {
                    expect(db).toBeDefined();
                    db.close(function() {
                        moveToNextFunction(null);
                    }, defaultFail);
                },
                function(moveToNextFunction) {
                    window.sqlitePlugin.deleteDatabase({ name: databaseName, iosDatabaseLocation: databaseLocation }, function() {
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
    });
});
