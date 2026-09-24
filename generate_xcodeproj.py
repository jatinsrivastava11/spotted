import os
import uuid

def gen_id():
    return uuid.uuid4().hex[:24].upper()

source_files = [
    "App/SpottedApp.swift",
    "Models/MusicModels.swift",
    "Services/SpotifyService.swift",
    "Services/AudioPlayerService.swift",
    "ViewModels/SocialStore.swift",
    "Views/Components/NowPlayingBarView.swift",
    "Views/Feed/PostCardView.swift",
    "Views/Feed/CreatePostSheet.swift",
    "Views/Feed/FeedView.swift",
    "Views/MusicStats/CuratedFavoritesView.swift",
    "Views/MusicStats/SpotifyStatsView.swift",
    "Views/Rankings/RankWhileListeningSheet.swift",
    "Views/Rankings/RankingsHubView.swift",
    "Views/Explore/ExploreFriendsView.swift",
    "Views/Profile/ProfileView.swift",
    "Views/MainTabView.swift",
]

resource_files = [
    "Resources/Assets.xcassets"
]

# Generate IDs
proj_id = gen_id()
target_id = gen_id()
main_group_id = gen_id()
sources_group_id = gen_id()
products_group_id = gen_id()
product_ref_id = gen_id()
sources_build_phase_id = gen_id()
frameworks_build_phase_id = gen_id()
resources_build_phase_id = gen_id()

proj_config_list_id = gen_id()
proj_debug_config_id = gen_id()
proj_release_config_id = gen_id()

target_config_list_id = gen_id()
target_debug_config_id = gen_id()
target_release_config_id = gen_id()

file_entries = {}
for sf in source_files:
    file_id = gen_id()
    build_id = gen_id()
    name = os.path.basename(sf)
    file_entries[sf] = {
        "file_id": file_id,
        "build_id": build_id,
        "name": name,
        "path": f"Spotted/{sf}",
        "type": "sourcecode.swift",
        "is_resource": False
    }

for rf in resource_files:
    file_id = gen_id()
    build_id = gen_id()
    name = os.path.basename(rf)
    file_entries[rf] = {
        "file_id": file_id,
        "build_id": build_id,
        "name": name,
        "path": f"Spotted/{rf}",
        "type": "folder.assetcatalog",
        "is_resource": True
    }

pbx = []
pbx.append("// !$*UTF8*$!")
pbx.append("{")
pbx.append("\tarchiveVersion = 1;")
pbx.append("\tclasses = {")
pbx.append("\t};")
pbx.append("\tobjectVersion = 56;")
pbx.append("\tobjects = {")

# PBXBuildFile
pbx.append("\n/* Begin PBXBuildFile section */")
for item in file_entries.values():
    pbx.append(f"\t\t{item['build_id']} /* {item['name']} in {'Resources' if item['is_resource'] else 'Sources'} */ = {{isa = PBXBuildFile; fileRef = {item['file_id']} /* {item['name']} */; }};")
pbx.append("/* End PBXBuildFile section */")

# PBXFileReference
pbx.append("\n/* Begin PBXFileReference section */")
pbx.append(f"\t\t{product_ref_id} /* Spotted.app */ = {{isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = Spotted.app; sourceTree = BUILT_PRODUCTS_DIR; }};")
for item in file_entries.values():
    pbx.append(f"\t\t{item['file_id']} /* {item['name']} */ = {{isa = PBXFileReference; lastKnownFileType = {item['type']}; name = \"{item['name']}\"; path = \"{item['path']}\"; sourceTree = \"<group>\"; }};")
pbx.append("/* End PBXFileReference section */")

# PBXFrameworksBuildPhase
pbx.append("\n/* Begin PBXFrameworksBuildPhase section */")
pbx.append(f"\t\t{frameworks_build_phase_id} /* Frameworks */ = {{")
pbx.append("\t\t\tisa = PBXFrameworksBuildPhase;")
pbx.append("\t\t\tbuildActionMask = 2147483647;")
pbx.append("\t\t\tfiles = (")
pbx.append("\t\t\t);")
pbx.append("\t\t\trunOnlyForDeploymentPostprocessing = 0;")
pbx.append("\t\t};")
pbx.append("/* End PBXFrameworksBuildPhase section */")

# PBXGroup
pbx.append("\n/* Begin PBXGroup section */")
# Main Group
pbx.append(f"\t\t{main_group_id} = {{")
pbx.append("\t\t\tisa = PBXGroup;")
pbx.append("\t\t\tchildren = (")
pbx.append(f"\t\t\t\t{sources_group_id} /* Spotted */,")
pbx.append(f"\t\t\t\t{products_group_id} /* Products */,")
pbx.append("\t\t\t);")
pbx.append("\t\t\tsourceTree = \"<group>\";")
pbx.append("\t\t};")

# Sources Group
pbx.append(f"\t\t{sources_group_id} /* Spotted */ = {{")
pbx.append("\t\t\tisa = PBXGroup;")
pbx.append("\t\t\tchildren = (")
for item in file_entries.values():
    pbx.append(f"\t\t\t\t{item['file_id']} /* {item['name']} */,")
pbx.append("\t\t\t);")
pbx.append("\t\t\tpath = \".\";")
pbx.append("\t\t\tsourceTree = \"<group>\";")
pbx.append("\t\t};")

# Products Group
pbx.append(f"\t\t{products_group_id} /* Products */ = {{")
pbx.append("\t\t\tisa = PBXGroup;")
pbx.append("\t\t\tchildren = (")
pbx.append(f"\t\t\t\t{product_ref_id} /* Spotted.app */,")
pbx.append("\t\t\t);")
pbx.append("\t\t\tname = Products;")
pbx.append("\t\t\tsourceTree = \"<group>\";")
pbx.append("\t\t};")
pbx.append("/* End PBXGroup section */")

# PBXNativeTarget
pbx.append("\n/* Begin PBXNativeTarget section */")
pbx.append(f"\t\t{target_id} /* Spotted */ = {{")
pbx.append("\t\t\tisa = PBXNativeTarget;")
pbx.append(f"\t\t\tbuildConfigurationList = {target_config_list_id} /* Build configuration list for PBXNativeTarget \"Spotted\" */;")
pbx.append("\t\t\tbuildPhases = (")
pbx.append(f"\t\t\t\t{sources_build_phase_id} /* Sources */,")
pbx.append(f"\t\t\t\t{frameworks_build_phase_id} /* Frameworks */,")
pbx.append(f"\t\t\t\t{resources_build_phase_id} /* Resources */,")
pbx.append("\t\t\t);")
pbx.append("\t\t\tbuildRules = (")
pbx.append("\t\t\t);")
pbx.append("\t\t\tdependencies = (")
pbx.append("\t\t\t);")
pbx.append("\t\t\tname = Spotted;")
pbx.append("\t\t\tproductName = Spotted;")
pbx.append(f"\t\t\tproductReference = {product_ref_id} /* Spotted.app */;")
pbx.append("\t\t\tproductType = \"com.apple.product-type.application\";")
pbx.append("\t\t};")
pbx.append("/* End PBXNativeTarget section */")

# PBXProject
pbx.append("\n/* Begin PBXProject section */")
pbx.append(f"\t\t{proj_id} /* Project object */ = {{")
pbx.append("\t\t\tisa = PBXProject;")
pbx.append("\t\t\tattributes = {")
pbx.append("\t\t\t\tBuildIndependentTargetsInParallel = 1;")
pbx.append("\t\t\t\tLastUpgradeCheck = 1500;")
pbx.append("\t\t\t\tTargetAttributes = {")
pbx.append(f"\t\t\t\t\t{target_id} = {{")
pbx.append("\t\t\t\t\t\tCreatedOnToolsVersion = 15.0;")
pbx.append("\t\t\t\t\t};")
pbx.append("\t\t\t\t};")
pbx.append("\t\t\t};")
pbx.append(f"\t\t\tbuildConfigurationList = {proj_config_list_id} /* Build configuration list for PBXProject \"Spotted\" */;")
pbx.append("\t\t\tcompatibilityVersion = \"Xcode 14.0\";")
pbx.append("\t\t\tdevelopmentRegion = en;")
pbx.append("\t\t\thasScannedForEncodings = 0;")
pbx.append("\t\t\tknownRegions = (")
pbx.append("\t\t\t\ten,")
pbx.append("\t\t\t\tBase,")
pbx.append("\t\t\t);")
pbx.append(f"\t\t\tmainGroup = {main_group_id};")
pbx.append(f"\t\t\tproductRefGroup = {products_group_id} /* Products */;")
pbx.append("\t\t\tprojectDirPath = \"\";")
pbx.append("\t\t\tprojectRoot = \"\";")
pbx.append("\t\t\ttargets = (")
pbx.append(f"\t\t\t\t{target_id} /* Spotted */,")
pbx.append("\t\t\t);")
pbx.append("\t\t};")
pbx.append("/* End PBXProject section */")

# PBXResourcesBuildPhase
pbx.append("\n/* Begin PBXResourcesBuildPhase section */")
pbx.append(f"\t\t{resources_build_phase_id} /* Resources */ = {{")
pbx.append("\t\t\tisa = PBXResourcesBuildPhase;")
pbx.append("\t\t\tbuildActionMask = 2147483647;")
pbx.append("\t\t\tfiles = (")
for item in file_entries.values():
    if item['is_resource']:
        pbx.append(f"\t\t\t\t{item['build_id']} /* {item['name']} in Resources */,")
pbx.append("\t\t\t);")
pbx.append("\t\t\trunOnlyForDeploymentPostprocessing = 0;")
pbx.append("\t\t};")
pbx.append("/* End PBXResourcesBuildPhase section */")

# PBXSourcesBuildPhase
pbx.append("\n/* Begin PBXSourcesBuildPhase section */")
pbx.append(f"\t\t{sources_build_phase_id} /* Sources */ = {{")
pbx.append("\t\t\tisa = PBXSourcesBuildPhase;")
pbx.append("\t\t\tbuildActionMask = 2147483647;")
pbx.append("\t\t\tfiles = (")
for item in file_entries.values():
    if not item['is_resource']:
        pbx.append(f"\t\t\t\t{item['build_id']} /* {item['name']} in Sources */,")
pbx.append("\t\t\t);")
pbx.append("\t\t\trunOnlyForDeploymentPostprocessing = 0;")
pbx.append("\t\t};")
pbx.append("/* End PBXSourcesBuildPhase section */")

# XCBuildConfiguration
pbx.append("\n/* Begin XCBuildConfiguration section */")
# Project Debug
pbx.append(f"\t\t{proj_debug_config_id} /* Debug */ = {{")
pbx.append("\t\t\tisa = XCBuildConfiguration;")
pbx.append("\t\t\tbuildSettings = {")
pbx.append("\t\t\t\tALWAYS_SEARCH_USER_PATHS = NO;")
pbx.append("\t\t\t\tCLANG_ANALYZER_NONNULL = YES;")
pbx.append("\t\t\t\tCLANG_CXX_LANGUAGE_STANDARD = \"gnu++20\";")
pbx.append("\t\t\t\tCLANG_ENABLE_MODULES = YES;")
pbx.append("\t\t\t\tCLANG_ENABLE_OBJC_ARC = YES;")
pbx.append("\t\t\t\tCOPY_PHASE_STRIP = NO;")
pbx.append("\t\t\t\tDEBUG_INFORMATION_FORMAT = dwarf;")
pbx.append("\t\t\t\tENABLE_TESTABILITY = YES;")
pbx.append("\t\t\t\tGCC_DYNAMIC_NO_PIC = NO;")
pbx.append("\t\t\t\tGCC_OPTIMIZATION_LEVEL = 0;")
pbx.append("\t\t\t\tGCC_PREPROCESSOR_DEFINITIONS = (")
pbx.append("\t\t\t\t\t\"DEBUG=1\",")
pbx.append("\t\t\t\t\t\"$(inherited)\",")
pbx.append("\t\t\t\t);")
pbx.append("\t\t\t\tIPHONEOS_DEPLOYMENT_TARGET = 17.0;")
pbx.append("\t\t\t\tMTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;")
pbx.append("\t\t\t\tONLY_ACTIVE_ARCH = YES;")
pbx.append("\t\t\t\tSDKROOT = iphoneos;")
pbx.append("\t\t\t\tSWIFT_ACTIVE_COMPILATION_CONDITIONS = \"DEBUG $(inherited)\";")
pbx.append("\t\t\t\tSWIFT_OPTIMIZATION_LEVEL = \"-Onone\";")
pbx.append("\t\t\t};")
pbx.append("\t\t\tname = Debug;")
pbx.append("\t\t};")

# Project Release
pbx.append(f"\t\t{proj_release_config_id} /* Release */ = {{")
pbx.append("\t\t\tisa = XCBuildConfiguration;")
pbx.append("\t\t\tbuildSettings = {")
pbx.append("\t\t\t\tALWAYS_SEARCH_USER_PATHS = NO;")
pbx.append("\t\t\t\tCLANG_ANALYZER_NONNULL = YES;")
pbx.append("\t\t\t\tCLANG_CXX_LANGUAGE_STANDARD = \"gnu++20\";")
pbx.append("\t\t\t\tCLANG_ENABLE_MODULES = YES;")
pbx.append("\t\t\t\tCLANG_ENABLE_OBJC_ARC = YES;")
pbx.append("\t\t\t\tCOPY_PHASE_STRIP = NO;")
pbx.append("\t\t\t\tDEBUG_INFORMATION_FORMAT = \"dwarf-with-dsym\";")
pbx.append("\t\t\t\tENABLE_NS_ASSERTIONS = NO;")
pbx.append("\t\t\t\tIPHONEOS_DEPLOYMENT_TARGET = 17.0;")
pbx.append("\t\t\t\tMTL_ENABLE_DEBUG_INFO = NO;")
pbx.append("\t\t\t\tSDKROOT = iphoneos;")
pbx.append("\t\t\t\tSWIFT_COMPILATION_MODE = wholemodule;")
pbx.append("\t\t\t\tSWIFT_OPTIMIZATION_LEVEL = \"-O\";")
pbx.append("\t\t\t\tVALIDATE_PRODUCT = YES;")
pbx.append("\t\t\t};")
pbx.append("\t\t\tname = Release;")
pbx.append("\t\t};")

# Target Debug
pbx.append(f"\t\t{target_debug_config_id} /* Debug */ = {{")
pbx.append("\t\t\tisa = XCBuildConfiguration;")
pbx.append("\t\t\tbuildSettings = {")
pbx.append("\t\t\t\tASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;")
pbx.append("\t\t\t\tASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;")
pbx.append("\t\t\t\tCODE_SIGN_STYLE = Automatic;")
pbx.append("\t\t\t\tCURRENT_PROJECT_VERSION = 1;")
pbx.append("\t\t\t\tDEVELOPMENT_ASSET_PATHS = \"\";")
pbx.append("\t\t\t\tENABLE_PREVIEWS = YES;")
pbx.append("\t\t\t\tGENERATE_INFOPLIST_FILE = YES;")
pbx.append("\t\t\t\tINFOPLIST_KEY_CFBundleDisplayName = Spotted;")
pbx.append("\t\t\t\tINFOPLIST_KEY_UILaunchScreen_Generation = YES;")
pbx.append("\t\t\t\tINFOPLIST_KEY_UISupportedInterfaceOrientations = UIInterfaceOrientationPortrait;")
pbx.append("\t\t\t\tIPHONEOS_DEPLOYMENT_TARGET = 17.0;")
pbx.append("\t\t\t\tLD_RUNPATH_SEARCH_PATHS = (")
pbx.append("\t\t\t\t\t\"$(inherited)\",")
pbx.append("\t\t\t\t\t\"@executable_path/Frameworks\",")
pbx.append("\t\t\t\t);")
pbx.append("\t\t\t\tMARKETING_VERSION = 1.0;")
pbx.append("\t\t\t\tPRODUCT_BUNDLE_IDENTIFIER = com.jatinsrivastava.spotted;")
pbx.append("\t\t\t\tPRODUCT_NAME = \"$(TARGET_NAME)\";")
pbx.append("\t\t\t\tSWIFT_EMIT_LOC_STRINGS = YES;")
pbx.append("\t\t\t\tSWIFT_VERSION = 5.0;")
pbx.append("\t\t\t\tTARGETED_DEVICE_FAMILY = \"1,2\";")
pbx.append("\t\t\t};")
pbx.append("\t\t\tname = Debug;")
pbx.append("\t\t};")

# Target Release
pbx.append(f"\t\t{target_release_config_id} /* Release */ = {{")
pbx.append("\t\t\tisa = XCBuildConfiguration;")
pbx.append("\t\t\tbuildSettings = {")
pbx.append("\t\t\t\tASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;")
pbx.append("\t\t\t\tASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;")
pbx.append("\t\t\t\tCODE_SIGN_STYLE = Automatic;")
pbx.append("\t\t\t\tCURRENT_PROJECT_VERSION = 1;")
pbx.append("\t\t\t\tDEVELOPMENT_ASSET_PATHS = \"\";")
pbx.append("\t\t\t\tENABLE_PREVIEWS = YES;")
pbx.append("\t\t\t\tGENERATE_INFOPLIST_FILE = YES;")
pbx.append("\t\t\t\tINFOPLIST_KEY_CFBundleDisplayName = Spotted;")
pbx.append("\t\t\t\tINFOPLIST_KEY_UILaunchScreen_Generation = YES;")
pbx.append("\t\t\t\tINFOPLIST_KEY_UISupportedInterfaceOrientations = UIInterfaceOrientationPortrait;")
pbx.append("\t\t\t\tIPHONEOS_DEPLOYMENT_TARGET = 17.0;")
pbx.append("\t\t\t\tLD_RUNPATH_SEARCH_PATHS = (")
pbx.append("\t\t\t\t\t\"$(inherited)\",")
pbx.append("\t\t\t\t\t\"@executable_path/Frameworks\",")
pbx.append("\t\t\t\t);")
pbx.append("\t\t\t\tMARKETING_VERSION = 1.0;")
pbx.append("\t\t\t\tPRODUCT_BUNDLE_IDENTIFIER = com.jatinsrivastava.spotted;")
pbx.append("\t\t\t\tPRODUCT_NAME = \"$(TARGET_NAME)\";")
pbx.append("\t\t\t\tSWIFT_EMIT_LOC_STRINGS = YES;")
pbx.append("\t\t\t\tSWIFT_VERSION = 5.0;")
pbx.append("\t\t\t\tTARGETED_DEVICE_FAMILY = \"1,2\";")
pbx.append("\t\t\t};")
pbx.append("\t\t\tname = Release;")
pbx.append("\t\t};")
pbx.append("/* End XCBuildConfiguration section */")

# XCConfigurationList
pbx.append("\n/* Begin XCConfigurationList section */")
pbx.append(f"\t\t{proj_config_list_id} /* Build configuration list for PBXProject \"Spotted\" */ = {{")
pbx.append("\t\t\tisa = XCConfigurationList;")
pbx.append("\t\t\tbuildConfigurations = (")
pbx.append(f"\t\t\t\t{proj_debug_config_id} /* Debug */,")
pbx.append(f"\t\t\t\t{proj_release_config_id} /* Release */,")
pbx.append("\t\t\t);")
pbx.append("\t\t\tdefaultConfigurationIsVisible = 0;")
pbx.append("\t\t\tdefaultConfigurationName = Release;")
pbx.append("\t\t};")

pbx.append(f"\t\t{target_config_list_id} /* Build configuration list for PBXNativeTarget \"Spotted\" */ = {{")
pbx.append("\t\t\tisa = XCConfigurationList;")
pbx.append("\t\t\tbuildConfigurations = (")
pbx.append(f"\t\t\t\t{target_debug_config_id} /* Debug */,")
pbx.append(f"\t\t\t\t{target_release_config_id} /* Release */,")
pbx.append("\t\t\t);")
pbx.append("\t\t\tdefaultConfigurationIsVisible = 0;")
pbx.append("\t\t\tdefaultConfigurationName = Release;")
pbx.append("\t\t};")
pbx.append("/* End XCConfigurationList section */")

pbx.append("\t};")
pbx.append(f"\trootObject = {proj_id} /* Project object */;")
pbx.append("}")

os.makedirs("Spotted.xcodeproj", exist_ok=True)
with open("Spotted.xcodeproj/project.pbxproj", "w") as f:
    f.write("\n".join(pbx))

print("Successfully generated Spotted.xcodeproj/project.pbxproj!")
