#!/usr/bin/ruby

#
# (c) 2021 BlackBerry Limited. All rights reserved.
#

begin
  require_relative './launcherManager.rb'

  manager = LauncherPluginManager.new
  manager.rm_framework
rescue => e
  ErrorManager.print_exception e
  exit 1
end
