import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DriverProfile {
    status: DriverStatus;
    vehicleType: VehicleType;
    city: string;
    name: string;
    email: string;
    licenseNumber: string;
    phone: string;
}
export enum DriverStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VehicleType {
    bicycle = "bicycle",
    scooter = "scooter"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllDrivers(): Promise<Array<DriverProfile>>;
    getCallerDriverProfile(): Promise<DriverProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getDriverProfile(user: Principal): Promise<DriverProfile>;
    isCallerAdmin(): Promise<boolean>;
    registerDriver(): Promise<void>;
    saveDriverProfile(profile: DriverProfile): Promise<void>;
    updateDriverStatus(driver: Principal, status: DriverStatus): Promise<void>;
}
