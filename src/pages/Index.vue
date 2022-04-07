<template>
  <button id="hideD33" v-on:click="hided33 = !hided33">
    Click me to hide/show D3.3
  </button>
  <button v-on:click="hided32 = !hided32">Click me to hide/show D3.2</button>
  <button v-on:click="hided3 = !hided3">Click me to hide/show D3.1</button>
  <button v-on:click="hideCyto = !hideCyto">Click me to hide/show Cyto</button>

  <Dthree3 v-if="!hided33"></Dthree3>
  <Dthree2 v-if="!hided32"></Dthree2>
  <Dthree v-if="!hided3"></Dthree>
  <Cyto v-if="!hideCyto"> </Cyto>

  <!--<q-page class="flex flex-center"> </q-page>-->
</template>

<script>
import Cyto from "src/components/Cyto.vue";
import Dthree from "src/components/Dthree.vue";
import Dthree2 from "src/components/Dthree2.vue";
import Dthree3 from "src/components/Dthree3.vue";

export default {
  components: {
    Cyto,
    Dthree,
    Dthree2,
    Dthree3,
  },
  data() {
    return {
      hided3: true,
      hideCyto: true,
      hided32: true,
      hided33: false,
    };
  },
};
</script>
