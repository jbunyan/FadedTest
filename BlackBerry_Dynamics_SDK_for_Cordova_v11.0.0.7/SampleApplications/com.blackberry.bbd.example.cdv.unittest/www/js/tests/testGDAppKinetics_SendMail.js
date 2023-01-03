/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 * 
 * GDAppKinetics plugin functional tests for "sendMail" functionality.
 */
describe('GDAppKinetics plugin', function() {

  var defaultFail = function() {
    expect(true).toBe(false);
  };

  it('Check GDAppKineticsPlugin plugin installation', function() {
    expect(window).toBeDefined();
    expect(window.plugins).toBeDefined();
    expect(window.plugins.GDAppKineticsPlugin).toBeDefined();
  });

  it('Check GDAppKineticsPlugin.sendEmailViaBBWork is available', function() {
    expect(window).toBeDefined();
    expect(window.plugins).toBeDefined();
    expect(window.plugins.GDAppKineticsPlugin.sendEmailViaBBWork).toBeDefined();
  });

  it('Check GDAppKineticsPlugin.sendEmailViaGFE deprecation', function() {
    var deprecationMesssage = '"sendEmailViaGFE" function is deprecated in GDAppKineticsPlugin';
    spyOn(console, "warn");
    window.plugins.GDAppKineticsPlugin.sendEmailViaGFE([], '', '', [], function() { }, function() { });

    var warningMessage = console.warn.calls.mostRecent().args[0];

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(warningMessage).toContain(deprecationMesssage);
  });

  it('Check sendEmailViaBBWork - all parameters, not existing file', function(done) {
    var toRecipients = ['to1@good.com'];
    var ccRecipients = ['cc1@good.com', 'cc2@good.com'];
    var bccRecipients = ['bcc1@good.com'];
    var subject = 'Test sendEmailViaBBWork';
    var body = 'Some test text!';
    var attachments = ['/path/to/attachment.txt'];

    window.plugins.GDAppKineticsPlugin.sendEmailViaBBWork(
      toRecipients,
      ccRecipients,
      bccRecipients,
      subject,
      body,
      attachments,
      function(result) {
        defaultFail();
        done();
      }, function(error) {
        done();
      }
    );
  });

});
