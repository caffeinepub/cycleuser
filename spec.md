# CycleUser

## Current State
New project. Empty backend and frontend scaffolding.

## Requested Changes (Diff)

### Add
- Driver registration page with a form (name, phone, email, vehicle type, license number)
- Driver login / profile view
- Admin dashboard to view registered drivers
- Link/button to cycleride-vs0.caffeine.xyz (the main ride platform)
- Role-based access: drivers and admin

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select authorization component for role-based access (admin + driver roles)
2. Generate Motoko backend with driver profile storage, registration, and admin listing
3. Build frontend: landing/home page, driver register form, driver profile page, admin driver list, navigation with link to cycleride site
