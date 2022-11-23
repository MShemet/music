import { describe, expect, test, vi } from 'vitest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import i18n from '@/includes/i18n';

import SongItem from '@/components/SongItem.vue';
import HomeView from '@/views/HomeView.vue';

const songs = [{ docID: 1 }, { docID: 2 }, { docID: 3 }];

vi.mock('@/views/getSongsRequest', () => ({
  getSongsRequest: () => Promise.resolve(songs),
}));

describe('HomeView.vue', () => {
  test('renders list of songs', async () => {
    const component = shallowMount(HomeView, {
      global: {
        plugins: [i18n],
      },
    });

    await flushPromises();

    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i]);
    });
  });
});
