/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    // remotePatterns: [
    //   {
    //     // protocol: "http",
    //     // hostname: "**", // Chấp nhận tất cả hostname
    //     // domains: ["example.com", "localhost", "picsum.photos", "lh3.googleusercontent"], // Thêm các domain bạn muốn cho phép

    //   },
    // ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Nếu dùng localhost kèm port
        pathname: "/image/**", // Pattern cho path
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**", // Cho phép tất cả các đường dẫn từ domain này
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
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

export default nextConfig;
