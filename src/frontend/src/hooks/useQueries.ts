import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type DriverProfile,
  type DriverStatus,
  type DriverWithPrincipal,
  UserRole,
} from "../backend";
import { useActor } from "./useActor";

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDriverProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<DriverProfile | null>({
    queryKey: ["driverProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerDriverProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDrivers() {
  const { actor, isFetching } = useActor();
  return useQuery<DriverWithPrincipal[]>({
    queryKey: ["allDrivers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDriversWithPrincipals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveDriverProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: DriverProfile) => {
      if (!actor) throw new Error("Not connected");
      try {
        await actor.registerDriver(profile);
      } catch {
        // already registered, continue
      }
      await actor.saveDriverProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["driverProfile"] });
    },
  });
}

export function useUpdateDriverStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      driver,
      status,
    }: { driver: Principal; status: DriverStatus }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateDriverStatus(driver, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allDrivers"] });
    },
  });
}
