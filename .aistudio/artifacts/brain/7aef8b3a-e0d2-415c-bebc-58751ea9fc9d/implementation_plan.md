# Implementation Plan: Comprehensive Login Persistence & Live Audit Logging

## Overview
Implement automated dual-persistence whenever any student, faculty member, or administrator logs in. The system will capture the user's **Campus ID Number**, **Full Name**, **Institutional Email**, and **Role**, ensuring this data is immediately upserted into the `users` directory table and appended to a dedicated `login_logs` audit history table in Supabase (with offline synchronization). An administrative **Live Login Audit Stream** tab will be integrated into the Admin Panel to monitor authentications in real time.

---

## 1. Database Schema & Persistence Layer
- **New Data Models in `src/types/campus.ts`**:
  - `LoginAuditLog`:
    - `id`: unique record ID (`log-...`)
    - `userId`: linked user account ID
    - `name`: member's full name
    - `email`: verified institutional email
    - `idNumber`: campus Student/Faculty/Staff ID
    - `role`: `student` | `faculty` | `admin`
    - `department`: academic or administrative department
    - `timestamp`: ISO timestamp of authentication
    - `loginMethod`: `credential_login` | `role_preset`
  - Update `CampusUser` with `lastLoginAt` and `loginCount`.

- **Data Service in `src/lib/supabaseClient.ts`**:
  - Add `login_logs` key to `DATA_STORAGE_KEYS`.
  - Implement `recordLogin(details, method)`:
    - **Upsert to `users`**: Check if user exists by email or ID number; update `lastLoginAt`, increment `loginCount`, and refresh profile details. If new, create full user directory profile.
    - **Insert into `login_logs`**: Write an immutable audit log record to Supabase table `login_logs` and local persistence.
  - Implement `getLoginLogs()`: Retrieve ordered log entries.
  - Update `getBootstrapSql()`: Include `CREATE TABLE IF NOT EXISTS login_logs (...)` with RLS policies and indexes.

---

## 2. Updated Dual-Mode Login Modal (`LoginModal.tsx`)
- **Required Field Updates**:
  - **Full Name**: Campus member's legal/directory name.
  - **Institutional Email**: `@campus.edu` address.
  - **Campus ID Number**: Student/Employee registration ID (e.g., `STU-2026-9812`, `FAC-104`, `ADM-001`).
  - **Role Portal**: Student, Faculty, or Administrator.
  - **Password / Access PIN**: Secure authentication gate.
- **Trigger Dual-Persistence**:
  - Both manual credential logins and 1-click role presets will immediately trigger `campusDb.recordLogin()` to capture and store the ID, Name, Email, Role, and timestamp into the database.
  - Provide instant visual confirmation: "Authentication recorded in campus database".

---

## 3. Dedicated Live Login Audit Tab in Admin Panel (`AdminPanelView.tsx`)
- **Admin Tab 4: "Live Login Audit Logs"**:
  - Chronological activity stream of all login attempts and successful sessions.
  - Filter by role (`All`, `Student`, `Faculty`, `Admin`) and search by Member Name, ID Number, or Email.
  - Display timestamp, device/browser signature, method (`Credential Login` vs `Role Preset`), and link to the user's directory profile.
  - "Export Audit Log (JSON/CSV)" feature for compliance archiving.
- **Top Metrics**:
  - Add "Authentications Today" card to the Admin dashboard header.

---

## 4. Verification & Testing
1. **Login Trigger**:
   - Log in using a custom ID, Name, and Email in the modal; verify the user profile is created/updated in the `users` table.
   - Verify a new record is added to the `login_logs` table with exact ID, name, email, role, and current timestamp.
   - Test 1-click role preset; verify it also registers an entry in `login_logs`.
2. **Admin Panel Verification**:
   - Switch to Administrator role and navigate to the **Live Login Audit Logs** tab.
   - Confirm all recent logins appear with correct ID, name, email, and time.
3. **Compilation & Linting**:
   - Run `compile_applet` and `lint_applet` to confirm error-free execution.
