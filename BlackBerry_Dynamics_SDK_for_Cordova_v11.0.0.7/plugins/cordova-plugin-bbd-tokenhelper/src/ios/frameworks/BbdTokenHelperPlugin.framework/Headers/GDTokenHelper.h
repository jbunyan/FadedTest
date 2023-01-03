/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <BlackBerryDynamics/GD/GDUtility.h>

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface GDTokenHelperPlugin : GDCBasePlugin

-(void)getGDAuthToken:(CDVInvokedUrlCommand*)command;

@end
