#!/usr/bin/ruby

#
# (c) 2021 BlackBerry Limited. All rights reserved.
#

require 'xcodeproj'

class LauncherPluginManager

  LAUNCHER_XCFRAMEWORK    = 'BlackBerryLauncher.xcframework'
  EMBED_FRAMEWORKS_PHASE  = 'Embedded Launcher Framework'
  FRAMEWORKS_GROUP_NAME   = 'Frameworks'
  FRAMEWORKS_BUILD_PHASE  = 'FrameworksBuildPhase'

  LAUNCHER_FRAMEWORK_PATH = "#{__dir__}/../../src/ios/frameworks/BlackBerryLauncher.xcframework"

  CODE_SIGN_SETTINGS = {
    'ATTRIBUTES' => ['CodeSignOnCopy', 'RemoveHeadersOnCopy']
  }

  def initialize
    @root = Dir.pwd
    @xcodeproj = open_project
    exit 1 if !@xcodeproj

    @native_target = @xcodeproj.targets.select.first
    @resources_group = @xcodeproj.groups.select do |group|
      group.name == 'Resources'
    end.first
  end

  def add_framework
    frameworks_group = @xcodeproj.groups.find { |group|
      group.display_name == FRAMEWORKS_GROUP_NAME
    }
    frameworks_build_phase = @native_target.build_phases.find { |build_phase|
      build_phase.to_s == FRAMEWORKS_BUILD_PHASE
    }

    # Check if BlackBerryLauncher.xcframework is already added to avoid extra adding
    exit 0 if frameworks_build_phase.file_display_names.include? LAUNCHER_XCFRAMEWORK

    # Add new "Embedded Launcher Framework" build phase to target
    embed_frameworks_build_phase = @xcodeproj.new Xcodeproj::Project::Object::PBXCopyFilesBuildPhase
    embed_frameworks_build_phase.name = EMBED_FRAMEWORKS_PHASE
    embed_frameworks_build_phase.symbol_dst_subfolder_spec = :frameworks
    @native_target.build_phases << embed_frameworks_build_phase

    framework_ref = frameworks_group.new_file File.expand_path LAUNCHER_FRAMEWORK_PATH
    build_file = embed_frameworks_build_phase.add_file_reference framework_ref
    frameworks_build_phase.add_file_reference framework_ref
    build_file.settings = CODE_SIGN_SETTINGS

    @xcodeproj.save
  end

  def rm_framework
    frameworks_build_phase = @native_target.build_phases.find { |build_phase|
      build_phase.to_s == FRAMEWORKS_BUILD_PHASE
    }

    # Check if BlackBerryLauncher.xcframework is still in project to avoid errors
    exit 0 if !frameworks_build_phase.file_display_names.include? LAUNCHER_XCFRAMEWORK

    # Find and remove "BlackBerryLauncher.xcframework" from build phases
    launcher_xcframework = frameworks_build_phase.files.find { |build_file|
      build_file.display_name == LAUNCHER_XCFRAMEWORK
    }
    frameworks_build_phase.remove_build_file launcher_xcframework

    # Find and remove "BlackBerryLauncher.xcframework" from sign & copy build phases
    embeded_phase = @native_target.copy_files_build_phases.find { |build_phase|
      build_phase.name == EMBED_FRAMEWORKS_PHASE
    }
    embeded_phase.remove_from_project

    @xcodeproj.save
  end

  private

  def open_project
    files = Dir.entries "#{@root}/platforms/ios"
    @project_name = files.grep(/(.)\.xcodeproj/).first
    @ios_path = File.expand_path "#{@root}/platforms/ios/#{@project_name}"

    Xcodeproj::Project.open @ios_path
  end
end

class String
  def red; "\e[31m#{self}\e[0m" end
end

class ErrorManager
  def self.print_exception exception
    puts "ERROR: #{exception.class}: #{exception.message}".red
  end
end
