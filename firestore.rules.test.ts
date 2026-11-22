/**
 * Pure TypeScript structural verification of Dirty Dozen security invariants
 * against the Firestore schema boundaries defined in firebase-blueprint.json.
 */
import assert from 'node:assert/strict';

interface MockUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  completedPuzzleIds: string[];
  isAdmin?: boolean;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function checkId(id: string): boolean {
  return id.length > 0 && id.length <= 128 && VALID_ID_REGEX.test(id);
}

function checkUserPayload(data: MockUserProfile, authUid: string, emailVerified: boolean): boolean {
  if (!emailVerified) return false;
  if ('isAdmin' in data) return false;
  if (data.uid !== authUid || !checkId(data.uid)) return false;
  if (data.gamesWon > data.gamesPlayed) return false;
  if (data.currentStreak > data.gamesWon) return false;
  if (data.maxStreak < data.currentStreak) return false;
  return true;
}

// 1. Unverified email rejected
assert.equal(
  checkUserPayload(
    {
      uid: 'userA',
      displayName: 'Reader',
      email: 'reader@example.com',
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      completedPuzzleIds: [],
    },
    'userA',
    false
  ),
  false
);

// 2. Shadow field rejected
assert.equal(
  checkUserPayload(
    {
      uid: 'userA',
      displayName: 'Reader',
      email: 'reader@example.com',
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      completedPuzzleIds: [],
      isAdmin: true,
    },
    'userA',
    true
  ),
  false
);

// 3. Invalid ID poisoning rejected
assert.equal(checkId('invalid$id!'), false);
assert.equal(checkId('a'.repeat(200)), false);

// 4. Invalid stats math rejected
assert.equal(
  checkUserPayload(
    {
      uid: 'userA',
      displayName: 'Reader',
      email: 'reader@example.com',
      gamesPlayed: 1,
      gamesWon: 5,
      currentStreak: 0,
      maxStreak: 0,
      completedPuzzleIds: [],
    },
    'userA',
    true
  ),
  false
);
