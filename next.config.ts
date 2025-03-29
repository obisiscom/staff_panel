import i18n from "@/i18n";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports={
  i18n:{
    locales:['tr','en'],
    defaultLocale:'tr',
  }
}

export default nextConfig;
