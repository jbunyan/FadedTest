/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <BlackBerryDynamics/GD/GDUtility.h>
#import <BlackBerryDynamics/GD/GDiOS.h>

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface GDSpecificPoliciesPlugin : GDCBasePlugin

-(void)updatePolicy:(CDVInvokedUrlCommand *)command;

@end
