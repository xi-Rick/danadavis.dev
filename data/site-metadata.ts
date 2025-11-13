export const SITE_METADATA = {
  title: `Dana's dev blog – stories, insights, and ideas`,
  author: 'Dana Davis',
  headerTitle: `Dana's dev blog`,
  description:
    'A personal space on the cloud where I document my programming journey, sharing lessons, insights, and resources for fellow developers.',
  language: 'en-us',
  locale: 'en-US',
  stickyNav: true,
  theme: 'system', // system, dark or light
  siteUrl: 'https://danadavis.dev',
  siteRepo: 'https://github.com/xi-Rick/danadavis.dev',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${
    process.env.BASE_PATH || ''
  }/static/images/twitter-card.jpeg`,
  email: 'dana@danadavis.dev',
  github: 'https://github.com/xi-Rick',
  x: 'https://twitter.com/cortrale',
  facebook: 'https://facebook.com/',
  youtube: 'https://youtube.com/@danadavisyt',
  linkedin: 'https://www.linkedin.com/in/danadavisdev/',
  threads: 'https://www.threads.net/cortrale',
  instagram: 'https://www.instagram.com/cortrale',
  goodreadsBookshelfUrl:
    'https://www.goodreads.com/review/list/179720035-dana-davis',
  goodreadsFeedUrl: 'https://www.goodreads.com/review/list_rss/148529394',
  imdbRatingsList: 'https://www.imdb.com/user/ur153494190/ratings',
  analytics: {
    umamiAnalytics: {
      websiteId: process.env.NEXT_UMAMI_ID,
      shareUrl: 'https://cloud.umami.is/share/sXLbAFCobWMcjc3l/danadavis.dev',
    },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus, beehive
    // Please add your .env file and modify it according to your selection
    provider: 'buttondown',
  },
  comments: {
    // Disqus shortname is loaded from DISQUS_SHORTNAME env var
    provider: 'disqus',
    disqus: {
      shortname: process.env.DISQUS_SHORTNAME || 'danadavis-dev',
    },
  },
  search: {
    kbarConfigs: {
      // path to load documents to search
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
  support: {
    buyMeACoffee: 'https://www.buymeacoffee.com/danadavis',
    paypal: 'https://paypal.me/cortrale?country.x=VN&locale.x=en_US',
    kofi: 'https://ko-fi.com/danadavisdev',
  },
}
