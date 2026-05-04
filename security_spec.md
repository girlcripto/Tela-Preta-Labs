# Security Specification: LFS Mastery Lab

## Data Invariants
1. A user profile (`/users/{uid}`) can only be created by the authenticated owner (`request.auth.uid == uid`).
2. Progress tracking (`/users/{uid}/progress/{stepId}`) can only be read or written by the owner of the account.
3. Quiz results are immutable once created (only `allow create`).
4. Certificates are globally readable but only writable by the system or authenticated users under their own profile (currently user-created for demo).
5. All timestamps (`createdAt`, `updatedAt`) must be validated against `request.time`.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing**: Attempt to create a profile for `UserA` using `UserB`'s token.
2. **Shadow Field Injection**: Attempt to add `isAdmin: true` to a user profile update.
3. **Ghost Progress Update**: Attempt to update someone else's LFS progress.
4. **ID Poisoning**: Attempt to use `../poison/..` as a document ID.
5. **Unauthorized Quiz Deletion**: Attempt to delete a quiz result.
6. **Certificate Tampering**: Attempt to modify a certificate document after it's been issued.
7. **Client Timestamp Override**: Attempt to set `updatedAt` to a past date manually.
8. **Public Profile Scraping**: Attempt to `list` the `/users` collection as a guest.
9. **Progress List Leak**: Attempt to list progress for another user.
10. **Quiz Result Injection**: Attempt to create a quiz result for another user.
11. **Excessive Storage Attack**: Attempt to write a 1MB string into the `displayName` field.
12. **Orphaned Progress**: Attempt to create progress without a corresponding user document (verified via `exists`).

## Test Runner
The following `firestore.rules.test.ts` will verify these constraints.
