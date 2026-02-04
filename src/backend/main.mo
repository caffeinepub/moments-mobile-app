import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Photo metadata type for Moments collection
  public type PhotoMetadata = {
    id : Nat;
    owner : Principal;
    timestamp : Int;
    blobId : Text; // Reference to blob storage
  };

  // Build deployment types
  public type BuildVersion = {
    version : Nat;
    status : BuildStatus;
    timestamp : Int;
    promotedBy : ?Principal;
  };

  public type BuildStatus = {
    #draft;
    #production;
    #archived;
  };

  // User system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let momentsPhotos = Map.empty<Principal, [PhotoMetadata]>();
  var nextPhotoId : Nat = 0;

  // Build deployment state
  let builds = Map.empty<Nat, BuildVersion>();
  var currentProductionVersion : ?Nat = null;
  var currentDraftVersion : Nat = 140; // Current draft is version 140

  // Initialize draft version 140
  stable var initialized = false;
  if (not initialized) {
    builds.add(140, {
      version = 140;
      status = #draft;
      timestamp = 0;
      promotedBy = null;
    });
    initialized := true;
  };

  // ============================================
  // Build Deployment Management (ADMIN ONLY)
  // ============================================

  // Promote a draft build to production
  public shared ({ caller }) func promoteBuildToProduction(version : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can promote builds to production");
    };

    let build = switch (builds.get(version)) {
      case null {
        Runtime.trap("Build version not found");
      };
      case (?b) { b };
    };

    if (build.status != #draft) {
      Runtime.trap("Only draft builds can be promoted to production");
    };

    // Archive current production version if exists
    switch (currentProductionVersion) {
      case (?prodVersion) {
        let prodBuild = switch (builds.get(prodVersion)) {
          case null { };
          case (?b) {
            builds.add(prodVersion, {
              version = b.version;
              status = #archived;
              timestamp = b.timestamp;
              promotedBy = b.promotedBy;
            });
          };
        };
      };
      case null { };
    };

    // Promote draft to production
    builds.add(version, {
      version = build.version;
      status = #production;
      timestamp = 0; // Should use Time.now() in real implementation
      promotedBy = ?caller;
    });

    currentProductionVersion := ?version;
  };

  // Get current production version
  public query func getCurrentProductionVersion() : async ?BuildVersion {
    switch (currentProductionVersion) {
      case null { null };
      case (?version) { builds.get(version) };
    };
  };

  // Get current draft version
  public query func getCurrentDraftVersion() : async ?BuildVersion {
    builds.get(currentDraftVersion);
  };

  // Get build by version number (admin only for full details)
  public query ({ caller }) func getBuildVersion(version : Nat) : async ?BuildVersion {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view build details");
    };
    builds.get(version);
  };

  // List all builds (admin only)
  public query ({ caller }) func listAllBuilds() : async [BuildVersion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list builds");
    };

    let buildList = builds.toArray();
    buildList.map<(Nat, BuildVersion), BuildVersion>(func(entry) { entry.1 });
  };

  // Create new draft build (admin only)
  public shared ({ caller }) func createDraftBuild(version : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create draft builds");
    };

    switch (builds.get(version)) {
      case (?_) {
        Runtime.trap("Build version already exists");
      };
      case null {
        builds.add(version, {
          version = version;
          status = #draft;
          timestamp = 0;
          promotedBy = null;
        });
        currentDraftVersion := version;
      };
    };
  };

  // ============================================
  // User Profile Management
  // ============================================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) { return null };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Admin or self can view profiles
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Only authenticated users can save profiles
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required to save profile");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============================================
  // Photo Storage for Moments Collection
  // ============================================

  // Store a photo in the Moments collection
  // Only authenticated users can store photos
  public shared ({ caller }) func storePhoto(photoBlob : Blob) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required to store photos");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can store photos");
    };

    let blobId = caller.toText() # "_" # nextPhotoId.toText();
    nextPhotoId += 1;

    // Store blob using MixinStorage
    // Note: MixinStorage's put function should be called here

    let metadata : PhotoMetadata = {
      id = nextPhotoId - 1;
      owner = caller;
      timestamp = 0;
      blobId = blobId;
    };

    let currentPhotos = switch (momentsPhotos.get(caller)) {
      case null { [] };
      case (?photos) { photos };
    };
    let updatedPhotos = currentPhotos.concat([metadata]);
    momentsPhotos.add(caller, updatedPhotos);

    blobId;
  };

  // Retrieve all photos from caller's Moments collection
  // Only authenticated users can retrieve their own photos
  public query ({ caller }) func getCallerMomentsPhotos() : async [PhotoMetadata] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required to access photos");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access photos");
    };

    switch (momentsPhotos.get(caller)) {
      case null { [] };
      case (?photos) { photos };
    };
  };

  // Retrieve photos from a specific user's Moments collection
  // Admin or owner can view
  public query ({ caller }) func getUserMomentsPhotos(user : Principal) : async [PhotoMetadata] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own photos");
    };

    switch (momentsPhotos.get(user)) {
      case null { [] };
      case (?photos) { photos };
    };
  };

  // Delete a photo from caller's Moments collection
  // Only the owner can delete their photos
  public shared ({ caller }) func deletePhoto(photoId : Nat) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required to delete photos");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete photos");
    };

    let currentPhotos = switch (momentsPhotos.get(caller)) {
      case null { return false };
      case (?photos) { photos };
    };

    let updatedPhotos = currentPhotos.filter(
      func(photo) { photo.id != photoId }
    );

    if (updatedPhotos.size() == currentPhotos.size()) {
      return false; // Photo not found
    };

    momentsPhotos.add(caller, updatedPhotos);
    true;
  };

  // ============================================
  // Blob Storage Authorization Wrappers
  // ============================================

  public query ({ caller }) func getBlob(blobId : Text) : async ?Blob {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required to access blobs");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access blobs");
    };

    // Call MixinStorage's get function
    // Return type depends on MixinStorage implementation
    null; // Placeholder - implement based on MixinStorage interface
  };

  // ============================================
  // Settings and App State
  // ============================================

  // Settings are user-specific and require authentication
  public type UserSettings = {
    notifications : Bool;
    appearance : Text; // e.g., "light", "dark"
    privacy : Text;
  };

  let userSettings = Map.empty<Principal, UserSettings>();

  public query ({ caller }) func getCallerSettings() : async ?UserSettings {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required to access settings");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access settings");
    };

    userSettings.get(caller);
  };

  public shared ({ caller }) func saveCallerSettings(settings : UserSettings) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required to save settings");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save settings");
    };

    userSettings.add(caller, settings);
  };
};
