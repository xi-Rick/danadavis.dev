const { withContentlayer } = require("next-contentlayer2");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' disqus.com analytics.umami.is cloud.umami.is *.eleavers.com *.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com localhost:3434 danadavis.dev *.kinde.com;
  connect-src *;
  font-src 'self';
  frame-src disqus.com *.github.io *.youtube.com *.kinde.com;
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const output = process.env.EXPORT ? "export" : undefined;
const basePath = process.env.BASE_PATH || undefined;
const unoptimized = process.env.UNOPTIMIZED ? true : undefined;

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer];
  return plugins.reduce((acc, next) => next(acc), {
    output,
    basePath,
    reactStrictMode: true,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    experimental: {
      swc: {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: false,
            },
          },
        },
      },
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "i.gr-assets.com", // Goodreads book covers
        },
        {
          protocol: "https",
          hostname: "i.scdn.co", // Spotify album covers
        },
        {
          protocol: "https",
          hostname: "m.media-amazon.com", // IMDB movie posters
        },
        {
          protocol: "https",
          hostname: "image.tmdb.org", // TMDB movie images
        },
        {
          protocol: "https",
          hostname: "books.google.com", // Google Books covers
        },
        {
          protocol: "http",
          hostname: "books.google.com", // Google Books covers (fallback)
        },
        {
          protocol: "https",
          hostname: "x9onikwdxxmj3qnt.public.blob.vercel-storage.com", // Vercel blob storage
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com", // Unsplash images for blog posts
        },
        {
          protocol: "https",
          hostname: "res.cloudinary.com", // Cloudinary images for projects
        },
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com",
        },
        {
          protocol: "https",
          hostname: "raw.githubusercontent.com",
        },
        {
          protocol: "https",
          hostname: "mpd-biblio-covers.imgix.net", // Biblio covers
        },
      ],
      unoptimized,
    },
    async redirects() {
      return [
        {
          source: "/snippets/crawling-goodreads-books-data",
          destination: "/blog/crawling-goodreads-books-data",
          permanent: true,
        },
      ];
    },
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "prefixIds",
                    params: {
                      delim: "__",
                      prefixIds: true,
                      prefixClassNames: true,
                    },
                  },
                ],
              },
            },
          },
        ],
      });

      return config;
    },
  });
};
