import { defineStore } from 'pinia';

/** Persisted: full ActivityWatch UI (timelines, buckets, categorization, …). Port is fixed — see constants/gfps.ts. */
const LS_ADVANCED_KEY = 'aw_advanced_ui';

export const useUiModeStore = defineStore('uiMode', {
  state: () => ({
    advancedEmployeeUi:
      typeof localStorage !== 'undefined' && localStorage.getItem(LS_ADVANCED_KEY) === '1',
  }),

  getters: {
    /** Simple mode = default for rank-and-file employees. */
    simpleEmployeeUi(state): boolean {
      return !state.advancedEmployeeUi;
    },
  },

  actions: {
    unlockAdvanced() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LS_ADVANCED_KEY, '1');
      }
      this.advancedEmployeeUi = true;
    },

    /** Open the web UI with hash `#advanced` or `#ctrldesk-advanced` once to reveal full UI (installer docs). */
    tryHashUnlock() {
      if (typeof window === 'undefined') return;
      const h = window.location.hash.replace(/^#/, '');
      if (h === 'advanced' || h === 'ctrldesk-advanced') {
        this.unlockAdvanced();
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    },
  },
});
