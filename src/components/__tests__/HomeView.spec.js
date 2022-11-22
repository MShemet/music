import { describe, expect, test } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import i18n from '@/includes/i18n';

import SongItem from '@/components/SongItem.vue';
import HomeView from '@/views/HomeView.vue';

describe('HomeView.vue', () => {
  test('renders list of songs', async () => {
    const songs = [{ docID: 1 }, { docID: 2 }, { docID: 3 }];

    // TODO mock
    // vi.mock('./getSongsRequest', () => ({
    //   getSongsRequest: () => Promise.resolve(songs),
    // }));

    const component = shallowMount(HomeView, {
      data() {
        return {
          songs,
        };
      },
      global: {
        plugins: [i18n],
      },
    });

    const items = component.findAllComponents(SongItem);

    console.log(component.vm.$data);

    expect(items).toHaveLength(songs.length);

    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i]);
    });
  });
});
