import { boot } from "quasar/wrappers";
import { createPinia } from "pinia";

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(createPinia());
});
