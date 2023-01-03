/*
 *  Copyright (c) Visto Corporation dba Good Technology, 2015. All rights reserved.
 */

#import <UIKit/UIKit.h>

/*!
 @brief  Options for Launcher startup.
 @discussion These options represents the handling of a push connection status and the requesting of auth tokens. The parameter of
 @code -[GTLauncherViewController startServicesWithOptions:] @endcode method requires either the @p GTLInternalGDAuthTokenAndPushConnectionManagement option or one of both of the other options.
 These options are required as @p GDUtility and @p GDPushConnection classes are singletons with a single delegate.
 

 By default Launcher handles shouldAutorotate and childViewControllerForStatusBarHidden calls, to redirect related methods to baseViewController please implement GTLauncherViewController category with next methods:
 
 @code
 - (BOOL)shouldAutorotate
 {
 return [self.baseViewController shouldAutorotate];
 }
 @endcode

 @code
 - (UIViewController *)childViewControllerForStatusBarHidden
 {
 return self.baseViewController;
 }
 @endcode
 */

typedef NS_OPTIONS(NSInteger, GTLauncherServicesStartupOptions)
{
	/*!
	 @brief Launcher will utilize GD auth tokens and the GD Push Connection status internally.
	 @discussion Host application that neither utilize GD auth tokens or rely on the status of a GD Push Connection
	 can provide this startup option. Launcher will internally set itself as the delegate for @p GDUtility and @p GDPushConnection.
	 */
	GTLInternalGDAuthTokenAndPushConnectionManagement = 1 << 0,
	
	/*!
	 @brief Host application will provide auth tokens upon request.
	 @discussion Host application that use the @p GDUtility to generate auth tokens should provide this option on Launcher services startup.
	 If this option is provided, the Launcher delegate @b must implement the
	 @code -[id<GTLauncherViewControllerDelegate> launcherViewController:didRequestGDAuthTokenForServerName:] @endcode method.
	 */
	GTLHostGDAuthTokenManagement = 1 << 1,
	
	/*!
	 @brief Host application will update Launcher of GD Push Connection status.
	 @discussion Host application that set themselves as the @p GDPushConnectionDelegate to monitor the GD Push Connection status
	 should provide this option on Launcher services startup. If this option is provided, the host app should call the
	 @code -[GTLauncherViewController setGDPushConnectionStatus:] @endcode method
	 when the @p onStatus: delegate method is called, passing in the value of the status parameter.
	 */
    GTLHostGDPushConnectionManagement = 1 << 2,
    
};

@class GTLauncherViewController;

/*!
  @brief Handler for events dispatched from the Launcher view controller.
  @discussion Launcher state changes and requests made by @p GTLauncherViewController
  are handled by creating a class that implements this protocol.
 */
@protocol GTLauncherViewControllerDelegate <NSObject>

@optional

/*!
  @brief Indicate that the Launcher view will be set to an open state.
  @discussion This method is called when the the app is in an open state and the user manually taps on the Launcher or
  @code -[GTLauncherViewController setOpen:animated:] @endcode with @p YES as the first parameter is called.
 
  @param controller @p GTLauncherViewController that is being opened.
 */
- (void)launcherViewControllerWillOpen:(GTLauncherViewController *)controller;

/*!
  @brief Indicate that the Launcher view will be set to a closed state.
  @discussion This method is called when the the app is in a closed state and the user manually taps on the Launcher or
  @code -[GTLauncherViewController setOpen:animated:] @endcode with @p NO as the first parameter is called.
 
  @param controller @p GTLauncherViewController that is being closed.
 */
- (void)launcherViewControllerWillClose:(GTLauncherViewController *)controller;

/*! 
  @brief Allows the host application to perform additional work before exiting to an external application.
  @discussion Certain Launcher actions, like selecting another GD app or selecting a
  create action, requires flipping to another application. However, if the
  host application needs to perform additional action, such as present an
  alert, beforebeing sent to the background, the delegate can implement this
  method, retain a reference to the handler, and return @p NO. After
  the host application finishes its respective action, it can then execute
  the open handler.
 
  If this method is not implemented, the default value is @p YES and
  the open handler is executed immediately.
 
  @param controller @p GTLauncherViewController that is requesting to launch an external application.
  @param handler The block of code that, when called, executes the appropriate open behavior.
  @param address @p NSString representing the address of the application being opened and fronted. Use
  this value in conjunction with @code -[GDiOS getServiceProviders] @endcode to get additional information of
  the application being opened.
  @return @p YES if the launcher should perform the open behavior immediately.
  @p NO if the host application intends on retaining the open handler and
  executing it at a later time.
 */
- (BOOL)launcherViewController:(GTLauncherViewController *)controller shouldExecuteOpenHandler:(void (^)(void))handler atAddress:(NSString *)address;

/*!
  @brief Provide an authentication token to Launcher.
  @discussion @p GDUtility is actually a singleton class with regards to the behavior
  of its delegate. In other words, there can only be one for an application.
  Application that provide @p GTLHostGDAuthTokenManagement as a startup
  option must implement this delegate method so that Launcher can properly
  execute its various services.
 
  Because the behavior of retrieving an auth token is asynchronous, a completion
  handler is provided that must be retained until a token is made available or an
  error occurs.
 
  When requesting an auth token, @p nil and the name parameter should be
  used for the challenge string and server name parameters of
  @code -[GDUtility getGDAuthToken:challenge serverName:]@endcode, respectively.
 
  @param controller @p GTLauncherViewController that is requesting an auth token.
  @param name @p NSString of the server name parameter to be provided
  to @p GDUtility when requesting an auth token.
  @param completion The block of code to be retained and executed when an
  @p GDAuthTokenDelegate method is called. In the event of a sucess,
  pass the @p NSString parameter provided in the callback. In the event
  of an error, pass @p nil.
 */
- (void)launcherViewController:(GTLauncherViewController *)controller didRequestGDAuthTokenForServerName:(NSString *)name completion:(void (^)(NSString *token))completion;

/*!
  @brief The settings view controller to be presented from Launcher.
  @discussion Host application can provide their own settings that would be displayed upon the user
  selecting Settings from Launcher.

  Note that the view controller being presented is not the one being returned but rather an
  an internal context view controller which provides additional functionality to
  Launcher. The settings view controller is a child view controller of the context view
  controller and its bounds are set to the bounds of the context view controller. Thus,
  any setting of the modal presentation or transition style are ignored.

  Host application that return a view controller must add an instance of
  @p GTLauncherSettingsViewController to their settings heirarchy. They must also provide 
  UI mechanisms to allow the user to dismiss the settings, such a @p UIBarButtonItem

  If this method is not implemented, the Launcher's settings view controller will
  be presented instead.

  @param controller @p GTLauncherViewController that is requesting to launch an external application.
  @return @p UIViewController with the settings for the host application, of which includes the
  @p GTLauncherSettingsViewController as part of its heirarchy. Returning @p nil will cause
  the default behavior of having the Launcher settings view controller being displayed.
 */
- (UIViewController *)settingsViewControllerForLauncherViewController:(GTLauncherViewController *)controller;

@end


/*!
  @brief This class represents the main application view controller class comprised of
  a Launcher button, Launcher's main view, and a base view controller.

  @discussion
  View Controller Setup <br>
  The initialization process of this view controller can be done either during
  application startup in the @code -[id <UIApplicationDelegate> application:didFinishLaunchingWithOptions:]@endcode
  method or after the @p GDAppEventAuthorized GD event. The view controller
  requires loading of resources from the Launcher bundle. However, the Main Interface
  setting in an application's target's general build settings only refers to the main
  bundle. Thus, this value should be cleared if the Launcher view controller is intended
  to be the window's root view controller.

  Initialization can be done either by calling @p init or
  @code -[GTLauncherViewController initWithBaseViewController:] @endcode and providing a view controller
  as a paremter. With the latter method the parameter can be nil initially, though if the 
  @p baseViewController property remains unset the screen will only show the Launcher button and 
  a black screen. This is an undesireable user experience. Calling any other initializaer, such 
  as @p init will not properly load the view controller.

  The Launcher view controller is intended to be the root view controller of
  the main application window. It can be set as a child view controller so long as
  its dimensions are that of the window. More than one instances of this class
  should not be used.

  Starting Launcher <br>
  Launcher uses a number of APIs provided by the GD SDK. As such access to these
  APIs requires that the GD Runtime be authorized. The Launcher view controller
  will only setup its view heirarchy and not perform any access to these APIs until
  started.

  Starting launcher requires that the view controller be already a part of the view
  heirarchy of the application. Once the application recieves the
  @p GDAppEventAuthorized event from the GD Runtime Launcher and the various
  services it utilizes is started via a call to the
  @code -[GTLauncherViewController startServicesWithOptions:] @endcode method, providing the
  appropropriate @p GTLauncherServicesStartupOptions options as the parameter.

  View Controller Heirarchy <br>
  The Launcher view controller is intended to be a container view controller whose base
  view controller is a single child view controller. The base view controller's view's
  bounds are set to that of the Launcher view controller's view. While the base view
  controller can have child view controllers, it is not recommended that Launcher's
  view controller's child view controllers be directly set. The @p GTLauncherViewController
  class should also not be subsclassed.

  The view layers are setup such that the Launcher button and view shown in the open state
  are always on top of the base view controller. The open state of launcher is not
  displayed modally so any modal view controllers will display properly over the Launcher
  view controller and no special steps need to be taken to present and dismiss them.

  View State <br>
  There are several properties and methods to manage the state of the Launcher. The following
  are valid states:
  <li>Closed with visible button</li>
     This is the default state of Launcher when first initialized. The Launcher's button
     will be in the last placed position, relative to its rotation.
  <li>Open with visible button</li>
     This state is set whenever the user selects the Launcher button or is
     programmatically opened. The Launcher
     button will be in the bottom right corner and cannot be moved.
  <li>Closed with hidden button</li>
     This state is available when the @p showingLauncher property is set
     to @p YES. This property cannot be set if the launcher view is an open state.\n
     This state is useful for application that intend on providing modal-like behavior without
     the use of modal views, such as an introductory or account setup screen.

  Settings <br>
  The settings button within Launcher allows for a host app to display its own custom settings.
  If no settings view controller is provided via the delegate call
  @code -[id<GTLauncherViewControllerDelegate> settingsViewControllerForLauncherViewController:] @endcode
  the default Launcher settings view will be presented modally.

  If the host app does choose to present its settings through Launcher, it must add the
  Launcher view controller in an appropriate place within its settings heirarchy.
  @see @p GTLauncherSettingsViewController
 */
OBJC_EXPORT
@interface GTLauncherViewController : UIViewController

/*!
  @brief Launcher's base view controller
  @discussion The view controller on which Launcher's view and button will be displayed over.
  The value of this property can be initially set through the @p  initWithBaseViewController: initializer.
 
  If a base view controller has not been set at initialization time, setting
  this property sets it up as a child view controller to the @p GTLauncherViewController
  instance. Otherwise, the existing child view controller is swapped out with
  the one being set. Setting this value to nil for an extended period of time
  is not recommended as the user will seee a black screen.
 */
@property (nonatomic, strong) UIViewController *baseViewController;

/*!
  @brief Launcher view status.
  @discussion Read the value of this property, using the @p isOpen accessor, to
  check whether Launcher's view is open or closed.

  This property has the value:
  <li> @p YES if Launcher is open</li>
  <li> @p NO otherwise.</li>
 
  Setting this property has the affect of providing an aimated transition with these values:
  <li> @p YES sets Launcher's view state to open</li> and
  <li> @p NO sets Launcher's view state to closed.</li>
 */
@property (nonatomic, getter=isOpen) BOOL open;

/*!
  @brief Launcher button's visibility status.
  @discussion Read the value of this property, using the @p isLauncherButtonHidden accessor, to
  check whether Launcher's button is showing or is hidden. Use this method if special,
  non-modal views are to be displayed, such an application welcome screen, and the
  Launcher button would be inhibiting.
 
  This property has the value:
  <li> @p YES if the launcher button is visible</li>
  <li> @p NO otherwise.</li>
 
  Setting this property changes the visibility of the Launcher button:
  <li> @p YES sets Launcher button to be hidden</li>
  <li> @p NO sets Launcher button to be visible.</li>
 
  Attempts to change the value of this property while the Launcher's view
  is in an open state are ignored.
 */
@property (nonatomic, getter=isLauncherButtonHidden) BOOL launcherButtonHidden;

/*!
  @brief Delegate for Launcher view controller.
  @discussion With the exception of @p GTLHostGDAuthTokenManagement as a startup option,
  setting a delegate for the Launcher view controller is optional.
 */
@property (atomic, weak) id <GTLauncherViewControllerDelegate> delegate;

/*!
  @brief Create and load the Launcher view controller.
  @discussion Creates and loads the Launcher view controller, using resources from @p GTLauncherBundle,
  with an initial base view controller. The base view controller can be nil at
  startup, though the user will be presented with a black screen if one is not
  set. Setting and changing this value can be done via the
  @p baseViewController property.
 
  Use this or @p init method to load the Launcher view controller. Using
  @p initWithNibName:bundle: will throw an exception.
 
  @param viewController @p UIViewController that will be the initial base view controller.
  This value can be nil.
 */
- (instancetype)initWithBaseViewController:(UIViewController *)viewController;

/*!
  @brief Grant Launcher Access to the various GD Services.
  @discussion Launcher relies on a number of GD APIs internally. These APIs are not
  available when the app is not yet in an authorized state. Call this
  method when the host application's @p GDiOSDelegate recieves
  a @p handleEvent: call. Because Launcher relies on several GD
  APIs that are singleton's in nature, startup options are provided to
  allow for use of these APIs by both Launcher and the host application.
 
  When providing options other than @p GTLInternalGDAuthTokenAndPushConnectionManagement,
  certain methods must either be implemented or called when appropriate.
 
  @see
  -[GTLauncherViewController launcherViewController:didRequestGDAuthTokenForServerName:completion:]
  and 
  -[GTLauncherViewController setGDPushConnectionStatus:]
 
  @param options @p GTLauncherServicesStartupOptions representing
  the behavior for GD Auth Token and GD Push Connection management.
 */
- (void)startServicesWithOptions:(GTLauncherServicesStartupOptions)options;

/*!
  @brief Set open and closed state of Launcher, providing option to animate transition.
  @discussion Programattically set Launcher's view to an open or close state,
  allowing for an option to do the transition with or without
  animation.

  This method does nothing if Launcher's button is set to hidden.

  @param open @p BOOL indicating whether to set the state
  of Launcher to be open or closed.
  @param animated @p BOOL indicating wether to set
  the open or closed state with or without animation.
 */
- (void)setOpen:(BOOL)open animated:(BOOL)animated;

/*!
  @brief Dismiss the presented settings.
  @discussion Dismiss the presented settings view controller.
 */
- (void)dismissSettings;

/*!
  @brief Update Launcher's internal push connection status.
  @discussion Host application that start with @p GTLHostGDPushConnectionManagement
  are assumed to have a @p GDPushConnectionDelegate within their app.
  Delegate calls to @p onStatus: must be forwarded to the current
  Launcher view controller via this method, passing along the status
  parameter that was provided from the delegate callback.

  @param status @p int value of the push connection status.
 */
- (void)setGDPushConnectionStatus:(int)status;

/*!
  @brief The Launcher version.
  @discussion A value in the form of "X.Y.Z" where X represents the major version,
  Y represents the minor version, and Z represents the build number. This
  value is retrieved from Launcher's bundle's Info.plist. Use this value
  for either logging or to diplay in a settings view.
 */
+ (NSString *)version;

/*!
 * Sets interval when launcher data cache will be considered as fresh.
 * -1 value means it will be forever.
 * 0 - no cache will be used.
 */
+ (void)setCacheExpiry:(NSTimeInterval)seconds;
@end
