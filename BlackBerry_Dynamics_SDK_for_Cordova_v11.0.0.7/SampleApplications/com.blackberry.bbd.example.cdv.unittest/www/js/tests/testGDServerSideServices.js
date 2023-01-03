/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 * 
 * GDServerSideServices plugin unit tests.
 */
describe('GDServerSideServices plugin:', function() {

	it('Check GDServerSideServices plugin installation', function() {
		expect(window.plugins).toBeDefined();
		expect(window.plugins.GDServerSideServices).toBeDefined();
    });
		
});
