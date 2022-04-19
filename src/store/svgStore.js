import { defineStore } from "pinia";
import axios from "axios";

export const useSvgStore = defineStore("svgStore", {
  state: () => ({
    svgVars: [],
    loading: true,
    init: false,
  }),

  actions: {
    async loadSVGs() {
      if (this.init == true) {
        return;
      }
      this.init = true;
      if (this.loading == true) {
        try {
          console.log("loading");
          this.svgVars.push(await axios.get("svg_vars/serveur_vars.svg"));
        } catch {
          alert("warning");
        } finally {
          this.loading = false;
        }
      }
    },
  },
});
