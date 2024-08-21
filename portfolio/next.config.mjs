import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const withNextIntl = createNextIntlPlugin("./i18n.ts");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        includePaths: [join(__dirname, 'src/styles')],
    },
    output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined
};

export default withNextIntl(nextConfig);
