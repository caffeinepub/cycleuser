import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Runtime "mo:core/Runtime";

(with migration = Migration.run)
actor {
  // Prefabricated access control system handling authorization.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type VehicleType = {
    #bicycle;
    #scooter;
  };

  type DriverStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type DriverProfile = {
    name : Text;
    email : Text;
    phone : Text;
    city : Text;
    vehicleType : VehicleType;
    licenseNumber : Text;
    status : DriverStatus;
  };

  public type DriverWithPrincipal = {
    principal : Principal;
    profile : DriverProfile;
  };

  let drivers = Map.empty<Principal, DriverProfile>();

  public shared ({ caller }) func registerDriver(emptyProfile : DriverProfile) : async () {
    // Only guests can register as new drivers
    // Users who are already registered cannot re-register
    // Admins should not register as drivers
    let currentRole = AccessControl.getUserRole(accessControlState, caller);
    switch (currentRole) {
      case (#guest) {
        // Allow guest to register - assign user role
        AccessControl.assignRole(accessControlState, caller, caller, #user);
        drivers.add(caller, emptyProfile);
      };
      case (#user) {
        Runtime.trap("Already registered as a driver");
      };
      case (#admin) {
        Runtime.trap("Admins cannot register as drivers");
      };
    };
  };

  public query ({ caller }) func getDriverProfile(user : Principal) : async ?DriverProfile {
    // Authorization: caller must be viewing their own profile OR be an admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    drivers.get(user);
  };

  public query ({ caller }) func getCallerDriverProfile() : async ?DriverProfile {
    // Only users (drivers) can view their own profile
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered drivers can view their profile");
    };
    drivers.get(caller);
  };

  public shared ({ caller }) func saveDriverProfile(profile : DriverProfile) : async () {
    // Only users (drivers) can save their own profile
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered drivers can save their profile");
    };
    drivers.add(caller, profile);
  };

  public query ({ caller }) func getAllDriversWithPrincipals() : async [DriverWithPrincipal] {
    // Only admins can view all drivers with their principals
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    drivers.toArray().map(func((principal, profile)) { { principal; profile } });
  };

  public shared ({ caller }) func updateDriverStatus(driver : Principal, status : DriverStatus) : async () {
    // Only admins can update driver status
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (drivers.get(driver)) {
      case (?profile) {
        let updatedProfile : DriverProfile = {
          profile with status;
        };
        drivers.add(driver, updatedProfile);
      };
      case (null) { Runtime.trap("Driver not found") };
    };
  };
};
