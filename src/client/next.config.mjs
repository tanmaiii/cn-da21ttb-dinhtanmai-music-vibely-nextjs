/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/image/**", 
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    });

    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // appDir: true, // Nếu đang dùng thư mục "app".
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

export default nextConfig;
