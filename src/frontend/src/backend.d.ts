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
export interface DriverWithPrincipal {
    principal: Principal;
    profile: DriverProfile;
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
    getAllDriversWithPrincipals(): Promise<Array<DriverWithPrincipal>>;
    getCallerDriverProfile(): Promise<DriverProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDriverProfile(user: Principal): Promise<DriverProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerDriver(emptyProfile: DriverProfile): Promise<void>;
    saveDriverProfile(profile: DriverProfile): Promise<void>;
    updateDriverStatus(driver: Principal, status: DriverStatus): Promise<void>;
}
