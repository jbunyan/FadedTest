/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Cordova/CDV.h>
#import <WebKit/WebKit.h>

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface GDCHttpRequestPlugin : GDCBasePlugin

-(void)enableClientCertAuth:(CDVInvokedUrlCommand*)command;
-(void)send:(CDVInvokedUrlCommand*)command;
-(void)abort:(CDVInvokedUrlCommand*)command;
-(void)clearCredentialsForMethod:(CDVInvokedUrlCommand*)command;
-(void)kerberosAllowDelegation:(CDVInvokedUrlCommand*)command;

@end
