/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>

@interface GDCStoragePlugin : CDVPlugin

//GD LocalStorage
- (void) setItem:( CDVInvokedUrlCommand *)command;
- (void) removeStorageItem:( CDVInvokedUrlCommand *)command;
- (void) getDictionary:( CDVInvokedUrlCommand *)command;
- (void) clearStorage:( CDVInvokedUrlCommand *)command;

@end

