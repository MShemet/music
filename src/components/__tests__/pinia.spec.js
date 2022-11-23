import { beforeEach, describe, expect, test, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useUserStore from '@/stores/user';

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: () => Promise.resolve(),
}));

vi.mock('@/includes/firebase', () => ({
  auth: {},
  db: {},
}));

describe('stores', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('authenticates user', async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).not.toBe(true);

    await store.authenticate({});

    expect(store.userLoggedIn).toBe(true);
  });
});
