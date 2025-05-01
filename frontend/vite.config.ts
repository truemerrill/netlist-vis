import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  // Note:
  //
  // Prevent Vite from trying to pre-bundle or SSR-transform @joint/core,
  // which is a CommonJS module and causes runtime issues when evaluated on
  // the server. This ensures JointJS is loaded only in the browser where
  // CommonJS interop is supported.

  ssr: {
    noExternal: ["@joint/core"],
  },
});
