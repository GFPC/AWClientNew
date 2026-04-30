<template lang="pug">
div
  h3 {{ pageTitle }}

  template(v-if="advancedEmployeeUi")
    hr

    DaystartSettings

    hr

    TimelineDurationSettings

    hr

    LandingPageSettings

    hr

    Theme

    hr

    ColorSettings

    hr

    ActivePatternSettings

    hr

    CategorizationSettings

    //hr

    //DeveloperSettings

    hr

  GFPSServer
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useSettingsStore } from '~/stores/settings';
import { useUiModeStore } from '~/stores/uiMode';

import DaystartSettings from '~/views/settings/DaystartSettings.vue';
import TimelineDurationSettings from '~/views/settings/TimelineDurationSettings.vue';
import CategorizationSettings from '~/views/settings/CategorizationSettings.vue';
import LandingPageSettings from '~/views/settings/LandingPageSettings.vue';
import DeveloperSettings from '~/views/settings/DeveloperSettings.vue';
import Theme from '~/views/settings/Theme.vue';
import ColorSettings from '~/views/settings/ColorSettings.vue';
import ActivePatternSettings from '~/views/settings/ActivePatternSettings.vue';
import GFPSServer from '@/views/settings/GFPSServerSettings.vue';

export default {
  name: 'Settings',
  components: {
    GFPSServer,
    DaystartSettings,
    TimelineDurationSettings,
    CategorizationSettings,
    LandingPageSettings,
    Theme,
    ColorSettings,
    DeveloperSettings,
    ActivePatternSettings,
  },
  computed: {
    ...mapState(useUiModeStore, ['advancedEmployeeUi', 'simpleEmployeeUi']),
    pageTitle() {
      return this.simpleEmployeeUi ? 'Настройки' : 'Settings';
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      const settingsStore = useSettingsStore();
      return settingsStore.load();
    },
  },
};
</script>
