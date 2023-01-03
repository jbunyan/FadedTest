/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <WebKit/WebKit.h>

@interface BbdClientCertAssistant : NSObject

-(instancetype)initWithWebView:(WKWebView *)theWebView;

+(void)extendChallengeWithClientCert: (NSURLAuthenticationChallenge *)challenge;

@end
