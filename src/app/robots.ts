import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/search", "/api/", "/preview/"],
      },
    ],
    sitemap: "https://blizine.com/sitemap.xml",
  }
}
