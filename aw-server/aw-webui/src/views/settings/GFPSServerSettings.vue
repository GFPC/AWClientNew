<template lang="pug">
  div.gfps-server-settings
    h4.mb-3 {{ simpleEmployeeUi ? 'Центральный сервер' : 'GFPS Server Settings' }}

    b-form-group(
      :label="simpleEmployeeUi ? 'Синхронизация' : 'Enabled'"
      label-cols-md=3
      :description="simpleEmployeeUi ? 'Отправлять данные активности на центральный сервер.' : 'If enabled, data of activity will be sent to the server.'"
    )
      div
        b-form-checkbox.float-right.ml-2(v-model="gfpsEnabled" switch @change="gfpsEnabled = $event")

    b-form-group(
      :label="simpleEmployeeUi ? 'Адрес сервера' : 'GFPS Server Address'"
      label-cols-md=3
      :description="serverAddressDescription"
    )
      div
        div.d-inline-flex.mb-3
          span {{ simpleEmployeeUi ? 'Хост (IP)' : 'IP' }}
        div.d-inline-flex
          b-input.float-right.ml-4(v-model="gfpsServerIP" type="text", :placeholder="simpleEmployeeUi ? 'Например 203.0.113.10' : 'GFPS host'")

    b-alert(show)
      template(v-if="simpleEmployeeUi")
        | #[b Важно:] после изменения адреса нажмите «Сохранить», затем при необходимости «Проверить соединение».
      template(v-else)
        | #[b Note:] Save your changes before testing.

    div.mt-3
      b-button.mb-2(
        @click="testConnection",
        variant="success",
        :disabled="gfpsTestDisabled",
      )
        | {{ simpleEmployeeUi ? 'Проверить соединение' : 'Test Connection' }}

    b-alert.gfps-connection-result.mt-3(
      v-if="connectionAlertVisible",
      :variant="connectionAlertVariant",
      show,
    )
      | {{ connectionAlertText }}

    div.mt-4.text-right
      b-button(@click="saveClasses", variant="success", :disabled="!unsavedChanges")
        | {{ simpleEmployeeUi ? 'Сохранить' : 'Save' }}
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { GFPS_CENTRAL_PORT } from '~/constants/gfps';
import { useSettingsStore } from '~/stores/settings';
import { useUiModeStore } from '~/stores/uiMode';
import { getClient } from '@/util/awclient.ts';

type ConnectionUiState = 'idle' | 'testing' | 'success' | 'failed';

export default {
  data() {
    return {
      gfpsEnabled: true,
      gfpsServerIP: '188.225.44.153',
      settingsStore: useSettingsStore(),
      unsavedChanges: false,
      connectionUi: 'idle' as ConnectionUiState,
    };
  },
  computed: {
    ...mapState(useUiModeStore, ['simpleEmployeeUi']),
    serverAddressDescription(): string {
      if (this.simpleEmployeeUi) {
        return `IP или имя хоста. Порт сервера всегда ${GFPS_CENTRAL_PORT} (не меняется).`;
      }
      return `The GFPS server host. Port is fixed at ${GFPS_CENTRAL_PORT} for this product build (see constants/gfps.ts).`;
    },
    gfpsTestDisabled(): boolean {
      return !String(this.gfpsServerIP || '').trim();
    },
    connectionAlertVisible(): boolean {
      return this.connectionUi !== 'idle';
    },
    connectionAlertVariant(): string {
      switch (this.connectionUi) {
        case 'testing':
          return 'info';
        case 'success':
          return 'success';
        case 'failed':
          return 'danger';
        default:
          return 'secondary';
      }
    },
    connectionAlertText(): string {
      if (this.simpleEmployeeUi) {
        switch (this.connectionUi) {
          case 'testing':
            return 'Проверка соединения…';
          case 'success':
            return 'Центральный сервер отвечает, связь в порядке.';
          case 'failed':
            return 'Не удалось связаться с центральным сервером. Проверьте адрес, сохраните настройки и сеть.';
          default:
            return '';
        }
      }
      switch (this.connectionUi) {
        case 'testing':
          return 'Testing connection…';
        case 'success':
          return 'Central server responded successfully.';
        case 'failed':
          return 'Could not reach the central server. Check the address, save settings, and your network.';
        default:
          return '';
      }
    },
  },
  watch: {
    gfpsEnabled: function (_value) {
      this.unsavedChangesListener();
    },
    gfpsServerIP: function (_value) {
      this.unsavedChangesListener();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const settingsStore = useSettingsStore();
      this.gfpsEnabled = settingsStore.gfpsEnabled;
      this.gfpsServerIP = settingsStore.gfpsServerIP;
    },
    async saveClasses() {
      await this.settingsStore.update({
        gfpsEnabled: this.gfpsEnabled,
        gfpsServerIP: this.gfpsServerIP,
        gfpsServerPort: GFPS_CENTRAL_PORT,
      });
      this.unsavedChanges = false;
    },
    unsavedChangesListener() {
      const portMismatch = Number(this.settingsStore.gfpsServerPort) !== GFPS_CENTRAL_PORT;
      if (
        this.gfpsServerIP !== this.settingsStore.gfpsServerIP ||
        this.gfpsEnabled !== this.settingsStore.gfpsEnabled ||
        portMismatch
      ) {
        this.unsavedChanges = true;
      } else {
        this.unsavedChanges = false;
      }
    },
    async testConnection() {
      const client = getClient();
      this.connectionUi = 'testing';
      try {
        const response = await client.req.get('/0/gfps/status');
        if (response.data && response.data.status === 'ok') {
          this.connectionUi = 'success';
        } else {
          this.connectionUi = 'failed';
        }
      } catch (_e) {
        this.connectionUi = 'failed';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.gfps-connection-result {
  max-width: 42rem;
}
</style>
