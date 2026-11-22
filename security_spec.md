# Firestore Security Specification — Spine & Seek

## 1. Data Invariants

1. **Ownership & PII Isolation**: A `UserProfile` document at `/users/{userId}` contains PII (`email`) and may only be read, created, or updated by the verified user whose `request.auth.uid == userId`. Listing `/users` is strictly forbidden.
2. **Master Gate Integrity**: A `PuzzleProgress` document at `/users/{userId}/progress/{puzzleId}` cannot be read via `get`, created, or updated unless the parent `/users/{userId}` document exists and belongs to `request.auth.uid`.
3. **Immutable Identity & Creation Timestamps**: `uid`, `ownerId`, `puzzleId`, and `createdAt` cannot be modified after creation. All timestamps must equal `request.time`.
4. **Terminal State Locking**: Once a `PuzzleProgress` document reaches `'won'` or `'lost'`, further client mutations are blocked (`existing().status == 'playing'`).
5. **Bounded Payloads**: Strings (`displayName`, `email`, `photoURL`, `puzzleId`), arrays (`completedPuzzleIds`, `solvedGroupIds`, `guesses`, `tileOrder`), and numeric counters (`mistakesRemaining`, `gamesWon <= gamesPlayed`) are strictly bounded.
6. **Zero-Trust List Queries**: `allow list` on `/users/{userId}/progress` explicitly validates `resource.data.ownerId == request.auth.uid` without `get()`/`exists()` lookups.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Cross-User Profile Read**: User B attempts `get(/users/userA)` -> `PERMISSION_DENIED`.
2. **Users Collection Scraping**: Any user attempts `list(/users)` -> `PERMISSION_DENIED`.
3. **Unverified Email Write**: User A with `email_verified: false` attempts `create(/users/userA)` -> `PERMISSION_DENIED`.
4. **UID Spoofing on Profile Create**: User A attempts `create(/users/userA)` with `{ uid: "userB" }` -> `PERMISSION_DENIED`.
5. **Shadow Field Injection**: User A attempts `create(/users/userA)` with extra field `{ isAdmin: true }` -> `PERMISSION_DENIED`.
6. **Client-Forged Timestamp**: User A attempts `create(/users/userA)` with client date instead of `request.time` -> `PERMISSION_DENIED`.
7. **Invalid Stats Math**: User A updates `/users/userA` with `{ gamesPlayed: 1, gamesWon: 5 }` -> `PERMISSION_DENIED`.
8. **ID Poisoning Attack**: User A attempts `create(/users/userA/progress/invalid$id!)` or 1.5KB ID -> `PERMISSION_DENIED`.
9. **Orphaned Progress Without Parent**: User A attempts `create(/users/userA/progress/edition-01)` before `/users/userA` exists -> `PERMISSION_DENIED`.
10. **Terminal State Tampering**: User A attempts to reset `status: "playing"` on a `PuzzleProgress` doc whose existing `status` is `"lost"` -> `PERMISSION_DENIED`.
11. **Oversized Array / Value Poisoning**: User A attempts `guesses` of length 12 or `mistakesRemaining: 99` -> `PERMISSION_DENIED`.
12. **Cross-User Progress Query**: User B attempts `list(/users/userA/progress)` -> `PERMISSION_DENIED`.
