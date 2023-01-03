/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <BlackBerryDynamics/GD/GDNETiOS.h>

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface GDCSocketPlugin : GDCBasePlugin <GDSocketDelegate>

-(void)connect:(CDVInvokedUrlCommand *)command;
-(void)send:(CDVInvokedUrlCommand *)command;
-(void)close:(CDVInvokedUrlCommand *)command;

@end
