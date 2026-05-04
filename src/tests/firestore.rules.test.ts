import { 
  assertFails, 
  assertSucceeds, 
  initializeTestEnvironment, 
  RulesTestEnvironment 
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'lfs-mastery-lab-test',
      firestore: {
        rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('1. Identity Spoofing: User B cannot create User A\'s profile', async () => {
    const aliceAuth = testEnv.authenticatedContext('alice');
    const bobAuth = testEnv.authenticatedContext('bob');
    
    await assertFails(setDoc(doc(bobAuth.firestore(), 'users', 'alice'), {
      uid: 'alice',
      email: 'alice@test.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  });

  it('2. Shadow Field Injection: User cannot add isAdmin to profile', async () => {
    const aliceAuth = testEnv.authenticatedContext('alice');
    const aliceDoc = doc(aliceAuth.firestore(), 'users', 'alice');
    
    await assertSucceeds(setDoc(aliceDoc, {
      uid: 'alice',
      email: 'alice@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      displayName: 'Alice'
    }));

    // Attempt to update with extra field
    await assertFails(updateDoc(aliceDoc, {
      isAdmin: true,
      updatedAt: new Date()
    }));
  });

  it('3. Ghost Progress Update: Bob cannot update Alice\'s progress', async () => {
    const bobAuth = testEnv.authenticatedContext('bob');
    await assertFails(setDoc(doc(bobAuth.firestore(), 'users/alice/progress/1'), {
      userId: 'alice',
      stepId: 1,
      isCompleted: true,
      updatedAt: new Date()
    }));
  });

  it('4. Public Profile Scraping: Guest cannot list users', async () => {
    const guest = testEnv.unauthenticatedContext();
    await assertFails(getDocs(collection(guest.firestore(), 'users')));
  });

  it('5. Quiz Result Injection: Bob cannot record quiz for Alice', async () => {
    const bobAuth = testEnv.authenticatedContext('bob');
    await assertFails(setDoc(doc(bobAuth.firestore(), 'users/alice/quizzes/q1'), {
      userId: 'alice',
      stepId: 1,
      score: 10,
      totalQuestions: 10,
      completedAt: new Date()
    }));
  });
});
