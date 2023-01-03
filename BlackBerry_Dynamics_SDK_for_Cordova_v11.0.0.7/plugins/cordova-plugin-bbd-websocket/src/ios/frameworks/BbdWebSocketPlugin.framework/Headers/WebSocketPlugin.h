/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <BlackBerryDynamics/GD/GDNETiOS.h>
#import "JFRWebSocket.h"

#ifdef BBD_CAPACITOR
#import "GDCBasePlugin.h"
#else
#import <BbdBasePlugin/GDCBasePlugin.h>
#endif

@interface WebSocketPlugin : GDCBasePlugin <JFRWebSocketDelegate>

@property(nonatomic, strong)JFRWebSocket *socket;

-(void)connect:(CDVInvokedUrlCommand *)command;
-(void)send:(CDVInvokedUrlCommand *)command;
-(void)close:(CDVInvokedUrlCommand *)command;

@end
