<template lang="pug">
div
  b-alert(v-if="$isAndroid" show)
    | #[b Note:] ActivityWatch on Android is in a very early stage of development.

  template(v-if="simpleEmployeeUi")
    h3 Добро пожаловать
    p.mb-0
      | Откройте «Экранное время» для сводки или «Хронология» для ленты событий.
      | Раздел «Профиль» показывает ваши ФИО с центрального сервера.
      | При необходимости сменить адрес сервера — «Настройки».

  template(v-else)
    h3 Welcome
    p.mb-0
      | Use the menu to open Activity, Timeline, or Account. You can change the default landing page in
      | #[router-link(to="/settings") Settings].

</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useUiModeStore } from '~/stores/uiMode';

export default {
  name: 'Home',
  computed: {
    ...mapState(useUiModeStore, ['simpleEmployeeUi']),
  },
};
</script>
