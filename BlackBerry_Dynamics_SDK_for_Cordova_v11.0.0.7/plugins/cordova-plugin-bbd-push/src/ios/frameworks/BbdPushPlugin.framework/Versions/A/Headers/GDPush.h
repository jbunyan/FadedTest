/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <BlackBerryDynamics/GD/GDPush.h>

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface GDCPushPlugin : GDCBasePlugin

-(void)open:(CDVInvokedUrlCommand *)command;
-(void)close:(CDVInvokedUrlCommand *)command;
-(void)isConnected:(CDVInvokedUrlCommand *)command;

-(NSMutableDictionary*)createResponseObjectForID:(NSString*)channelID withType:(NSString*)responseType withData:(NSString*)responseData;
-(void)removeChannelForID:(NSString*)channelID;

@end
