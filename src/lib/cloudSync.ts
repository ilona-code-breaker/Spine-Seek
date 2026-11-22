import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { PlayerStats, PuzzleProgress } from '../types/game';
import { db, handleFirestoreError, OperationType } from './firebase';

interface FirestoreGuessRow {
  tiles: string[];
}

interface FirestorePuzzleProgress {
  puzzleId: string;
  ownerId: string;
  solvedGroupIds: string[];
  guesses: FirestoreGuessRow[];
  mistakesRemaining: number;
  status: 'playing' | 'won' | 'lost';
  tileOrder: string[];
}

interface FirestoreUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  completedPuzzleIds: string[];
}

function sanitizeDisplayName(user: User): string {
  const raw = user.displayName?.trim() || user.email?.split('@')[0] || 'Reader';
  return raw.slice(0, 100);
}

function sanitizeStats(stats: PlayerStats): PlayerStats {
  const completedPuzzleIds = Array.from(new Set(stats.completedPuzzleIds))
    .map((id) => id.slice(0, 64))
    .slice(0, 500);
  const gamesPlayed = Math.max(0, Math.min(100000, Math.floor(stats.gamesPlayed)));
  const gamesWon = Math.max(0, Math.min(gamesPlayed, Math.floor(stats.gamesWon)));
  const currentStreak = Math.max(
    0,
    Math.min(gamesWon, Math.floor(stats.currentStreak))
  );
  const maxStreak = Math.max(
    currentStreak,
    Math.min(gamesWon, Math.floor(stats.maxStreak))
  );

  return {
    gamesPlayed,
    gamesWon,
    currentStreak,
    maxStreak,
    completedPuzzleIds,
  };
}

function toFirestoreProgress(
  uid: string,
  progress: PuzzleProgress
): FirestorePuzzleProgress {
  return {
    puzzleId: progress.puzzleId.slice(0, 64),
    ownerId: uid,
    solvedGroupIds: progress.solvedGroupIds.slice(0, 4).map((id) => id.slice(0, 64)),
    guesses: progress.guesses.slice(0, 8).map((row) => ({
      tiles: row.slice(0, 4).map((t) => t.slice(0, 120)),
    })),
    mistakesRemaining: Math.max(0, Math.min(4, Math.floor(progress.mistakesRemaining))),
    status: progress.status,
    tileOrder: progress.tileOrder.slice(0, 16).map((t) => t.slice(0, 120)),
  };
}

function fromFirestoreProgress(data: FirestorePuzzleProgress): PuzzleProgress {
  return {
    puzzleId: data.puzzleId,
    solvedGroupIds: Array.isArray(data.solvedGroupIds) ? data.solvedGroupIds : [],
    guesses: Array.isArray(data.guesses)
      ? data.guesses.map((g) => (Array.isArray(g.tiles) ? g.tiles : []))
      : [],
    mistakesRemaining:
      typeof data.mistakesRemaining === 'number' ? data.mistakesRemaining : 4,
    status:
      data.status === 'won' || data.status === 'lost' ? data.status : 'playing',
    tileOrder: Array.isArray(data.tileOrder) ? data.tileOrder : [],
    updatedAt: Date.now(),
  };
}

export async function ensureAndSyncUserAccount(
  user: User,
  localStats: PlayerStats,
  localProgressMap: Record<string, PuzzleProgress>
): Promise<{
  stats: PlayerStats;
  progressMap: Record<string, PuzzleProgress>;
}> {
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);

  let mergedStats = sanitizeStats(localStats);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const payload: Record<string, unknown> = {
        uid: user.uid,
        displayName: sanitizeDisplayName(user),
        email: (user.email || '').slice(0, 254),
        gamesPlayed: mergedStats.gamesPlayed,
        gamesWon: mergedStats.gamesWon,
        currentStreak: mergedStats.currentStreak,
        maxStreak: mergedStats.maxStreak,
        completedPuzzleIds: mergedStats.completedPuzzleIds,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (user.photoURL) {
        payload.photoURL = user.photoURL.slice(0, 500);
      }
      await setDoc(userRef, payload);
    } else {
      const existingData = snap.data() as FirestoreUserProfile;
      const cloudCompleted = new Set(existingData.completedPuzzleIds || []);
      const localOnlyCompleted = mergedStats.completedPuzzleIds.filter(
        (id) => !cloudCompleted.has(id)
      );

      if (localOnlyCompleted.length > 0) {
        const localOnlyWonCount = localOnlyCompleted.filter(
          (id) => localProgressMap[id]?.status === 'won'
        ).length;
        const combinedCompleted = Array.from(
          new Set([...cloudCompleted, ...localOnlyCompleted])
        ).slice(0, 500);
        const nextPlayed = Math.max(
          existingData.gamesPlayed || 0,
          (existingData.gamesPlayed || 0) + localOnlyCompleted.length
        );
        const nextWon = Math.min(
          nextPlayed,
          (existingData.gamesWon || 0) + localOnlyWonCount
        );
        const nextStreak = Math.max(
          existingData.currentStreak || 0,
          mergedStats.currentStreak
        );
        const nextMax = Math.min(
          nextWon,
          Math.max(
            existingData.maxStreak || 0,
            mergedStats.maxStreak,
            nextStreak
          )
        );
        mergedStats = sanitizeStats({
          gamesPlayed: nextPlayed,
          gamesWon: nextWon,
          currentStreak: Math.min(nextWon, nextStreak),
          maxStreak: nextMax,
          completedPuzzleIds: combinedCompleted,
        });
        await updateDoc(userRef, {
          ...mergedStats,
          updatedAt: serverTimestamp(),
        });
      } else {
        mergedStats = sanitizeStats({
          gamesPlayed: existingData.gamesPlayed || 0,
          gamesWon: existingData.gamesWon || 0,
          currentStreak: existingData.currentStreak || 0,
          maxStreak: existingData.maxStreak || 0,
          completedPuzzleIds: existingData.completedPuzzleIds || [],
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }

  // Fetch cloud progress list and upload any local-only puzzles
  const progressPath = `users/${user.uid}/progress`;
  const mergedProgressMap: Record<string, PuzzleProgress> = { ...localProgressMap };

  try {
    const q = query(
      collection(db, 'users', user.uid, 'progress'),
      where('ownerId', '==', user.uid)
    );
    const cloudSnap = await getDocs(q);
    const cloudIds = new Set<string>();

    cloudSnap.forEach((docSnap) => {
      const data = docSnap.data() as FirestorePuzzleProgress;
      cloudIds.add(docSnap.id);
      mergedProgressMap[docSnap.id] = fromFirestoreProgress(data);
    });

    for (const [puzzleId, localProg] of Object.entries(localProgressMap)) {
      if (
        !cloudIds.has(puzzleId) &&
        (localProg.guesses.length > 0 || localProg.status !== 'playing')
      ) {
        const docRef = doc(db, 'users', user.uid, 'progress', puzzleId);
        const payload = toFirestoreProgress(user.uid, localProg);
        await setDoc(docRef, {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, progressPath);
  }

  return { stats: mergedStats, progressMap: mergedProgressMap };
}

export function subscribeToUserStats(
  uid: string,
  onStats: (stats: PlayerStats) => void
): () => void {
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  return onSnapshot(
    userRef,
    (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as FirestoreUserProfile;
      onStats(
        sanitizeStats({
          gamesPlayed: data.gamesPlayed || 0,
          gamesWon: data.gamesWon || 0,
          currentStreak: data.currentStreak || 0,
          maxStreak: data.maxStreak || 0,
          completedPuzzleIds: data.completedPuzzleIds || [],
        })
      );
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, userPath);
    }
  );
}

export function subscribeToUserProgress(
  uid: string,
  onProgress: (cloudProgress: Record<string, PuzzleProgress>) => void
): () => void {
  const progressPath = `users/${uid}/progress`;
  const q = query(
    collection(db, 'users', uid, 'progress'),
    where('ownerId', '==', uid)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const nextMap: Record<string, PuzzleProgress> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestorePuzzleProgress;
        nextMap[docSnap.id] = fromFirestoreProgress(data);
      });
      onProgress(nextMap);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, progressPath);
    }
  );
}

export async function saveCloudPuzzleProgress(
  uid: string,
  progress: PuzzleProgress,
  action: 'shuffle' | 'submit'
): Promise<void> {
  const docPath = `users/${uid}/progress/${progress.puzzleId}`;
  const docRef = doc(db, 'users', uid, 'progress', progress.puzzleId);
  const payload = toFirestoreProgress(uid, progress);

  try {
    const existingSnap = await getDoc(docRef);
    if (!existingSnap.exists()) {
      await setDoc(docRef, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }

    const existingStatus = existingSnap.data()?.status;
    if (existingStatus !== 'playing') {
      return;
    }

    if (action === 'shuffle') {
      await updateDoc(docRef, {
        tileOrder: payload.tileOrder,
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(docRef, {
        solvedGroupIds: payload.solvedGroupIds,
        guesses: payload.guesses,
        mistakesRemaining: payload.mistakesRemaining,
        status: payload.status,
        tileOrder: payload.tileOrder,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function saveCloudStats(
  uid: string,
  stats: PlayerStats
): Promise<void> {
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);
  const sanitized = sanitizeStats(stats);

  try {
    await updateDoc(userRef, {
      gamesPlayed: sanitized.gamesPlayed,
      gamesWon: sanitized.gamesWon,
      currentStreak: sanitized.currentStreak,
      maxStreak: sanitized.maxStreak,
      completedPuzzleIds: sanitized.completedPuzzleIds,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}
