import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type VehicleType = {
    #bicycle;
    #scooter;
  };

  type DriverStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type DriverProfile = {
    name : Text;
    email : Text;
    phone : Text;
    city : Text;
    vehicleType : VehicleType;
    licenseNumber : Text;
    status : DriverStatus;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    drivers : Map.Map<Principal, DriverProfile>;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    drivers : Map.Map<Principal, DriverProfile>;
  };

  public func run(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      drivers = old.drivers;
    };
  };
};
