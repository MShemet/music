import { describe, expect, test } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import AboutView from '@/views/AboutView.vue';

describe('AboutView.vue', () => {
  test('renders inner text', () => {
    const wrapper = shallowMount(AboutView);

    expect(wrapper.text()).toContain('about');
  });
});
