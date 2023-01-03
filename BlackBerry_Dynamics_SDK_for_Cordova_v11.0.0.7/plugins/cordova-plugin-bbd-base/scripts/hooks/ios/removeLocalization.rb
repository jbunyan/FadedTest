#!/usr/bin/ruby

#
# (c) 2020 BlackBerry Limited. All rights reserved.
#

begin
  require_relative './basePluginManager.rb'

  @manager = BasePluginManager.new
  @manager.remove_localization
rescue LoadError => e
  ErrorManager.print_load_error
  exit(1)
end
