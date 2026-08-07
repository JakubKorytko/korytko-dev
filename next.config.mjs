import { dirname, join } from "path";
import { fileURLToPath } from "url";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");
const filename = fileURLToPath(import.meta.url);
const rootDir = dirname(filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [join(rootDir, "src/styles")],
  },
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined
};

export default withNextIntl(nextConfig);
