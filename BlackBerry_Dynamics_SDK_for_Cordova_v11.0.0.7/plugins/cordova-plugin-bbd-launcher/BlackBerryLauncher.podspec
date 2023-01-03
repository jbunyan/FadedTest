#
# Copyright (c) 2022 BlackBerry Limited. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

Pod::Spec.new do |s|
  s.name         = "BlackBerryLauncher"
  s.version      = "1.0.0"
  s.homepage     = "https://developers.blackberry.com/"
  s.summary      = "BlackBerryLauncher Compatibility Layer"
  s.license      = { :type => "Apache License, Version 2.0" }
  s.authors      = { "Bohdan Pidluzhnyy" => "bpidluzhnyy@blackberry.com" }
  s.source       = { :git => "https://github.com/blackberry/", :tag => "#{s.version}" }
  s.platform     = :ios, 13.0
  s.requires_arc = true

  s.pod_target_xcconfig     = { "EXCLUDED_ARCHS[sdk=iphonesimulator*]" => "arm64" }
  s.user_target_xcconfig    = { "EXCLUDED_ARCHS[sdk=iphonesimulator*]" => "arm64" }
  s.xcconfig                = { "ENABLE_BITCODE" => "NO" }
  s.subspec "BlackBerryLauncher" do |core|
    core.preserve_paths      = "src/ios/frameworks/BlackBerryLauncher.xcframework"
    core.vendored_frameworks = "src/ios/frameworks/BlackBerryLauncher.xcframework"
  end

  s.dependency "BlackBerryDynamics"
end
