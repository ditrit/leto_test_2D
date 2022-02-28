<template>
  <div style="display: flex">
    <div id="container" style="height: 100ch; width: 150ch"></div>
  </div>
</template>

<script>
const Cytoscape = require("cytoscape");
export default {
  name: "Cyto",

  data() {
    return {};
  },
  mounted() {
    var container = document.getElementById("container");
    console.log(container);
    const cy = Cytoscape({
      container, // container to render in
      boxSelectionEnabled: false,
      style: [
        {
          selector: "node",
          css: {
            content: "data(id)",
            "text-valign": "center",
            "text-halign": "center",
          },
        },
        {
          selector: ":parent",
          css: {
            "text-valign": "top",
            "text-halign": "center",
          },
        },
        {
          selector: "edge",
          css: {
            "curve-style": "unbundled-bezier",
            "target-arrow-shape": "triangle",
            content: "data(id)",
            "text-valign": "top",
            "text-halign": "center",
          },
        },
      ],
      elements: {
        nodes: [
          {
            data: { id: "DataBase", parent: "DB Server" },
            position: { x: 50, y: 50 },
            style: {
              shape: "round-rectangle",
              height: "75",
              width: "75",
            },
          },
          {
            data: { id: "DB Server", parent: "Server" },
            style: { shape: "barrel" },
          },
          {
            data: { id: "Web App", parent: "Web Server" },
            position: { x: 250, y: 50 },
            style: { shape: "round-rectangle", height: "75", width: "75" },
          },
          {
            data: { id: "Web Server", parent: "Server" },
          },
          {
            data: { id: "Server" },
            style: { shape: "barrel" },
          },
        ],
        edges: [
          {
            data: { id: "Connects to", source: "Web App", target: "DataBase" },
          },
        ],
      },
      layout: {
        name: "preset",
        padding: 5,
      },
    });
  },
  methods: {
    make: function () {
      return;
    },
  },
};
</script>
