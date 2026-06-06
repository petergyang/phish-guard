# Backend Scanner Follow-Up

## Why It Is Deferred

A backend scanner can classify more mail and support labels or history, but it requires broader Gmail API access and introduces server-side data handling.

## Choose This When

- Users need mailbox-wide scanning.
- Users need Gmail labels or historical review.
- Teams need centralized policy or reporting.
- Current-message warnings are not enough.

## Required Constraints

- Define exactly what metadata is uploaded.
- Avoid body upload by default.
- Store the minimum possible derived data.
- Add retention limits.
- Add consent copy that explains background access.
- Complete restricted-scope and data-security review before public release.
