import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// La raíz de resolución es este proyecto: evita que Turbopack busque un
// workspace/lockfile en directorios superiores.
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
    rules: {
      // Tailwind CSS v4 vía el plugin oficial del generador de Next 16.
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
