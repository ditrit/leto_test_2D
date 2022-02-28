<template>
  <canvas id="figure" width="350" height="200"></canvas>
</template>

<script>
const IsoBlock = require("src/main.js");

export default {
  name: "Dthree",

  data() {
    return {};
  },
  mounted() {
    var blocks = [
      new IsoBlock.Block(
        { x: 1, y: 3, z: 0 },
        { x: 2, y: 2, z: 2.5 },
        { light: "#8ae234", medium: "#73d216", dark: "#4e9a06" }
      ),
      new IsoBlock.Block(
        { x: 2, y: 2, z: 0 },
        { x: 1, y: 1, z: 1.5 },
        IsoBlock.colors.red
      ),
      new IsoBlock.Block(
        { x: 3, y: 1, z: 0 },
        { x: 1, y: 4, z: 1 },
        IsoBlock.colors.blue
      ),
    ];

    IsoBlock.makeFigure({ canvas: "figure", blocks: blocks });
  },
  methods: {},
};
</script>
