/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <objc/runtime.h>
#import <Cordova/CDV.h>
#import <BlackBerryDynamics/GD/GDAppServer.h>
#import <BlackBerryDynamics/GD/GDiOS.h>
#import <BlackBerryDynamics/GD/GDServiceProvider.h>

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface GDServerSideServicesPlugin : GDCBasePlugin

- (void)callGDServerSideService:(CDVInvokedUrlCommand *)command;

@end
