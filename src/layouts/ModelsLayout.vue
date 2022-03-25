<template>
  <q-layout view="lHh Lpr lFf">
    <q-header id="header" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Models Workshop </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer id="drawer" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Models </q-item-label>
        <div id="drawerContent" style="margin-left: 3ch"></div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ModelsLayout",

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  methods: {},
});
</script>
