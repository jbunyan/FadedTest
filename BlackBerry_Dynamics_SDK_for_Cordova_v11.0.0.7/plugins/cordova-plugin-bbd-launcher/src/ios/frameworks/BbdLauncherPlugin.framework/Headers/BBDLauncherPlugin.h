/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIApplication.h>
#import <Cordova/CDVAppDelegate.h>
#import <BlackBerryLauncher/BlackBerryLauncher.h>

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface BBDLauncherPlugin : GDCBasePlugin <GTLauncherViewControllerDelegate>

-(void)open:(CDVInvokedUrlCommand *)command;
-(void)close:(CDVInvokedUrlCommand *)command;
-(void)show:(CDVInvokedUrlCommand *)command;
-(void)hide:(CDVInvokedUrlCommand *)command;

@end
