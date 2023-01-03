/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <BlackBerryDynamics/GD/GDiOS.h>

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface GDCApplicationPlugin : GDCBasePlugin

-(void)getApplicationConfig:(CDVInvokedUrlCommand*)command;
-(void)showPreferenceUI:(CDVInvokedUrlCommand*)command;
-(void)getVersion:(CDVInvokedUrlCommand*)command;

@end
