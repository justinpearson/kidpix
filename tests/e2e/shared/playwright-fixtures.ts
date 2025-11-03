import { test as base } from "@playwright/test";

/**
 * Extended Playwright test fixture that mutes audio by mocking Audio APIs
 * This ensures no sound plays during E2E tests regardless of browser launch options
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Mock Audio API to prevent any sound playback
    await page.addInitScript(() => {
      // Mock HTMLAudioElement
      window.Audio = class MockAudio {
        play() {
          return Promise.resolve();
        }
        pause() {}
        load() {}
        addEventListener() {}
        removeEventListener() {}
      } as any;

      // Mock HTMLMediaElement.prototype.play
      if (window.HTMLMediaElement) {
        window.HTMLMediaElement.prototype.play = function () {
          return Promise.resolve();
        };
        window.HTMLMediaElement.prototype.pause = function () {};
      }

      // Mock Web Audio API
      if (window.AudioContext || (window as any).webkitAudioContext) {
        const MockAudioContext = class {
          createOscillator() {
            return {
              connect() {},
              disconnect() {},
              start() {},
              stop() {},
              frequency: { value: 0 },
              type: "sine",
            };
          }
          createGain() {
            return {
              connect() {},
              disconnect() {},
              gain: { value: 0 },
            };
          }
          createBuffer() {
            return {};
          }
          createBufferSource() {
            return {
              buffer: null,
              connect() {},
              disconnect() {},
              start() {},
              stop() {},
            };
          }
          decodeAudioData() {
            return Promise.resolve({});
          }
          get destination() {
            return { connect() {}, disconnect() {} };
          }
          get currentTime() {
            return 0;
          }
          get sampleRate() {
            return 44100;
          }
          close() {
            return Promise.resolve();
          }
          resume() {
            return Promise.resolve();
          }
          suspend() {
            return Promise.resolve();
          }
          get state() {
            return "running";
          }
        };

        window.AudioContext = MockAudioContext as any;
        (window as any).webkitAudioContext = MockAudioContext;
      }
    });

    // Use the page in the test
    await use(page);
  },
});

export { expect } from "@playwright/test";
