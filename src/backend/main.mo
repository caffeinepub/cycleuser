import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include prefabricated authorization system
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

  module DriverProfile {
    public func compare(driver1 : DriverProfile, driver2 : DriverProfile) : Order.Order {
      Text.compare(driver1.name, driver2.name);
    };
  };

  let drivers = Map.empty<Principal, DriverProfile>();

  // Helper function to check if caller is admin
  func assertAdminRole(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // Helper function to check if caller is a driver (user role)
  func assertDriverRole(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only drivers can perform this action");
    };
  };

  public shared ({ caller }) func registerDriver() : async () {
    // Initialize as driver user if not already registered
    let currentRole = AccessControl.getUserRole(accessControlState, caller);
    switch (currentRole) {
      case (#guest) {
        // Assign user role to the new driver
        AccessControl.assignRole(accessControlState, caller, caller, #user);
      };
      case (_) { 
        Runtime.trap("Already registered. Move to updating your profile.") 
      };
    };
    // Store empty driver profile first to be explicitly filled in by driver and then verified by admin
    let newDriver : DriverProfile = {
      name = "";
      email = "";
      phone = "";
      city = "";
      vehicleType = #bicycle;
      licenseNumber = "";
      status = #pending;
    };
    drivers.add(caller, newDriver);
  };

  public query ({ caller }) func getDriverProfile(user : Principal) : async DriverProfile {
    // Authorization: caller must be viewing their own profile OR be an admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    
    switch (drivers.get(user)) {
      case (?profile) { profile };
      case (null) {
        Runtime.trap("Driver not registered. Please register first.");
      };
    };
  };

  public query ({ caller }) func getCallerDriverProfile() : async DriverProfile {
    assertDriverRole(caller);
    switch (drivers.get(caller)) {
      case (?profile) { profile };
      case (null) {
        Runtime.trap("Driver not registered. Please register first.");
      };
    };
  };

  public shared ({ caller }) func saveDriverProfile(profile : DriverProfile) : async () {
    assertDriverRole(caller);
    drivers.add(caller, profile);
  };

  public query ({ caller }) func getAllDrivers() : async [DriverProfile] {
    assertAdminRole(caller);
    drivers.values().toArray().sort();
  };

  public shared ({ caller }) func updateDriverStatus(driver : Principal, status : DriverStatus) : async () {
    assertAdminRole(caller);
    switch (drivers.get(driver)) {
      case (?profile) {
        let updatedProfile : DriverProfile = {
          name = profile.name;
          email = profile.email;
          phone = profile.phone;
          city = profile.city;
          vehicleType = profile.vehicleType;
          licenseNumber = profile.licenseNumber;
          status;
        };
        drivers.add(driver, updatedProfile);
      };
      case (null) { Runtime.trap("Driver not found") };
    };
  };
}
