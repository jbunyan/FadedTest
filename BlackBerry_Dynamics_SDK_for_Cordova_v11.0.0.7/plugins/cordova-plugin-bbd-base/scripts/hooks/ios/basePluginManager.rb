#!/usr/bin/ruby

#
# (c) 2021 BlackBerry Limited. All rights reserved.
#

require 'xcodeproj'

class BasePluginManager

  LOCALIZATION_GROUP_NAME = 'InfoPlist.strings'

  def initialize
    @root = Dir.pwd
    @xcodeproj = open_project
    exit(1) if !@xcodeproj

    @native_target = @xcodeproj.targets.select.first
    @resources_group = @xcodeproj.groups.select do |group|
      group.name == 'Resources'
    end.first
  end

  def add_localization
    available_languages = ["da", "de", "en", "es", "fr", "it", "ja", "ko", "nl", "pt-PT", "pt", "sv", "zh-Hans"]
    localization_path = copy_localization_resources "plugins/cordova-plugin-bbd-base/src/ios/resources/Localization"

    # If localization already added just return to avoid re-adding
    @resources_group.children.objects.each do |item|
      if item.display_name == LOCALIZATION_GROUP_NAME
        return
      end
    end

    localization_group = @resources_group.new_variant_group LOCALIZATION_GROUP_NAME
    available_languages.each do |lang|
      localization_group.new_reference "#{localization_path}/#{lang}.lproj/#{LOCALIZATION_GROUP_NAME}"
    end

    @native_target.add_resources [localization_group]
    @xcodeproj.save
  end

  def remove_localization
    @resources_group.children.objects.each do |item|
      if item.display_name == LOCALIZATION_GROUP_NAME
        item.clear
        item.remove_from_project
      end
    end

    @xcodeproj.save
  end

  private

  def open_project
    files = Dir.entries "#{@root}/platforms/ios"
    @project_name = files.grep(/(.)\.xcodeproj/).first
    @ios_path = File.expand_path "#{@root}/platforms/ios/#{@project_name}"

    Xcodeproj::Project.open @ios_path
  end

  def copy_localization_resources from
    to = File.expand_path "#{@root}/platforms/ios/#{@project_name.split('.').first}/Resources"
    FileUtils.cp_r from, to

    "#{to}/Localization"
  end
end

class String
  def red; "\e[31m#{self}\e[0m" end
  def yellow; "\e[33m#{self}\e[0m" end
end

class ErrorManager
  def self.print_load_error
    error_prefix = red "ERROR:"
    puts "ERROR: 'xcodeproj' Ruby gem is not installed.".red
    puts error_prefix
    puts "#{error_prefix} Please install it by running following command:"
    puts "#{error_prefix} $ sudo gem install xcodeproj"
    puts "#{error_prefix} And reinstall Base plugin"
    puts "NOTE:  required Ruby version >= 2.0.0".yellow
    puts "" # empty line for splitting messages
  end

  def self.print_exception exception
    puts "ERROR: #{exception.class}: #{exception.message}".red
  end
end
