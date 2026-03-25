# CycleUser

## Current State
The app has a landing page for driver registration, a driver dashboard, and an admin dashboard. The admin dashboard has Approve/Reject buttons but they don't actually call the backend — `handleStatusUpdate` only shows warning toasts because `getAllDrivers` returns `[DriverProfile]` without Principal IDs, making it impossible to call `updateDriverStatus`.

## Requested Changes (Diff)

### Add
- Backend: `getAllDriversWithPrincipals` query that returns `[(Principal, DriverProfile)]`
- Admin dashboard: actual approve/reject mutation using `useUpdateDriverStatus`

### Modify
- Backend `getAllDrivers` -> return principal alongside profile
- AdminDashboard `handleStatusUpdate` -> call real backend mutation
- `useAllDrivers` hook -> use new endpoint that returns principals

### Remove
- Warning toast in `handleStatusUpdate` about missing principal

## Implementation Plan
1. Regenerate Motoko backend with `getAllDriversWithPrincipals` returning `[(Principal, DriverProfile)]`
2. Update `useAllDrivers` hook to use new endpoint and store `{principal, ...profile}` shape
3. Fix `AdminDashboard` to call `useUpdateDriverStatus` with real principal
