import type { Project } from '~/types/data'

export const PROJECTS: Project[] = [
  {
    type: 'work',
    title: 'The Greek Myth API',
    description:
      'A comprehensive REST API providing detailed information about Greek mythology, including gods, titans, monsters, and heroes with 200+ entries and multiple endpoints.',
    imgSrc:
      'https://res.cloudinary.com/dfjq9qvoz/image/upload/v1749439089/egglogwfguvb4npphhu8.webp',
    repo: 'https://github.com/xi-Rick/thegreekmythapi',
    builtWith: ['Node.js', 'Vercel', 'REST API', 'JSON', 'Express.js'],
    links: [
      {
        title: 'Demo',
        url: 'https://thegreekmythapi.vercel.app/',
      },
    ],
    content:
      '<h2 id="introducing-the-greek-myth-api-dive-into-the-world-of-gods-titans-monsters-and-heroes">Introducing the Greek Myth API: Dive into the World of Gods, Titans, Monsters, and Heroes</h2><p>As a long-time enthusiast of Greek mythology, I\'ve always been fascinated by the rich tapestry of stories, characters, and adventures from ancient Greece. Recently, I decided to combine this passion with my love for coding by creating a Greek Myth API. After some development and testing, I\'m thrilled to announce that the API is now live on Vercel.</p><h4 id="why-i-created-the-greek-myth-api">Why I Created the Greek Myth API</h4><p>The idea behind this API stemmed from my own passion and a practical need for a project I\'m developing. I wanted a reliable source of Greek mythology data that I could integrate seamlessly. The more I thought about it, the more I realized that others might benefit from such a tool as well. Thus, I made the API publicly available for free, with no rate limits, allowing anyone to explore and utilize the data without restrictions.</p><h4 id="features-of-the-greek-myth-api">Features of the Greek Myth API</h4><p>My Greek mythology API is packed with a wealth of information, organized into multiple endpoints for easy access:</p><ul><li><strong>Gods</strong> : Information about the major and minor gods of Greek mythology.<ul><li>Endpoint: <code>/api/gods</code></li></ul></li><li><strong>Titans</strong> : Details about the primordial beings and predecessors of the gods.<ul><li>Endpoint: <code>/api/titans</code></li></ul></li><li><strong>Monsters</strong> : Data on the various creatures that populate Greek myths.<ul><li>Endpoint: <code>/api/monsters</code></li></ul></li><li><strong>Heroes</strong> : Profiles of the legendary heroes renowned for their epic deeds.<ul><li>Endpoint: <code>/api/heroes</code></li></ul></li><li><strong>Main Data Endpoint</strong> : A comprehensive endpoint that aggregates all entries.<ul><li>Endpoint: <code>/api/data</code></li></ul></li></ul><p>Currently, the API houses 200 entries, each rich with details. For each entity, you can find:</p><ul><li><strong>Name</strong> : The name of the god, titan, monster, or hero.</li><li><strong>Description</strong> : A brief overview of their story and significance.</li><li><strong>Character Attributes</strong> : Origin, symbols, abode, and powers.</li><li><strong>Family Connections</strong> : Their relatives and notable relationships.</li><li><strong>Stories</strong> : Key myths and tales associated with them.</li><li><strong>Image</strong> : Visual representation to bring the myth to life (in progress).</li></ul><p>I\'m still working on adding images for the entries to create for the API. I might use AI to generate these images, which would add a visual dimension to the mythological data.</p><h4 id="how-to-use-the-api">How to Use the API</h4><p>Accessing the API is straightforward. Simply visit the main site at <a href="https://thegreekmythapi.vercel.app/">thegreekmythapi.vercel.app</a> to get started. From there, you can explore the various endpoints to retrieve the data you need for your projects.<br>For instance, to get data on all gods, you would use the following endpoint:</p><pre><code class="language-bash">GET /api/gods\n</code></pre><p>Similarly, for a comprehensive dataset that includes all entries, you can use:</p><pre><code class="language-bash">GET /api/data\n</code></pre><h4 id="supporting-the-project">Supporting the Project</h4><p>While the API is free to use, I\'ve also included an option for donations on the site. If you find the API useful and would like to support its continued development and maintenance, any contributions would be greatly appreciated.</p><h4 id="conclusion">Conclusion</h4><p>Creating this API has been a labor of love, blending my passion for Greek mythology with the excitement of developing a useful tool for others. Whether you\'re a developer, a mythology enthusiast, or someone working on a project that could benefit from this data, I hope you find the Greek Myth API as enjoyable and useful as I do.</p><p>Feel free to explore, integrate, and get inspired by the timeless stories of Greek mythology!<br><strong>Main site</strong> : <a href="https://thegreekmythapi.vercel.app/">thegreekmythapi.vercel.app</a></p>',
  },
  {
    type: 'self',
    title:
      'From Rock Bottom to React: How I Turned My Card Game Into a Web App',
    description:
      'A personal journey of turning a card game invented during a difficult time into a modern web application using Next.js, complete with animations and mobile support.',
    imgSrc:
      'https://images.unsplash.com/photo-1501003878151-d3cb87799705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxwbGF5aW5nJTIwY2FyZHxlbnwwfHx8fDE3NDc2MTg0MjV8MA&ixlib=rb-4.1.0&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/marginmatch',
    builtWith: [
      'Next.js 15',
      'React',
      'Framer Motion',
      'Capacitor',
      'Lucide Icons',
      'React Icons',
      'ElevenLabs',
      'Vercel',
    ],
    links: [
      {
        title: 'Demo',
        url: 'https://marginmatch.app/',
      },
    ],
    content:
      "<h1 id=\"\"></h1><p>Sometimes the best ideas come from the darkest places. About 15 years ago, I was in one of those places—a really low point where all I had was time and a deck of cards. What started as mindless card flipping became something unexpected: a game I'd eventually call <strong>Margin Match</strong>.</p><h2 id=\"the-birth-of-margin-match\">The Birth of Margin Match</h2><p>Picture this: me, sitting alone, pulling cards one from the top of the deck, one from the bottom, discarding them, and repeating. But then I started noticing patterns and asking myself questions. What if the left card I drew could only \"play\" on the right card if their values were within a specific margin?</p><p>The rule became simple: the left card can only match the right card if it's plus one, minus one, or exactly the same value. A 7 matches with a 6, 7, or 8. Nothing else. If they don't match, you discard both cards, shuffle everything back together, and try again.</p><p>It sounds almost trivial, but this little constraint turned a mindless activity into something genuinely engaging. The decisions started mattering. When do you play? When do you discard? How do you strategically work through your deck?</p><h2 id=\"%F0%9F%A7%91%F0%9F%8F%BC%E2%80%8D%F0%9F%A4%9D%E2%80%8D%F0%9F%A7%91%F0%9F%8F%BE-a-late-night-conversation\">🧑🏼‍🤝‍🧑🏾 A Late-Night Conversation </h2><p>Fast forward to recently. I was talking to someone who mentioned she was up at 2 AM playing solitaire, and naturally, I told her about this weird game I'd invented years ago. But here's the thing about card games—they're nearly impossible to explain without actually showing someone. She asked for a visual, and that simple request lit a fire under me.</p><p>I had to build this thing.</p><h2 id=\"%F0%9F%91%A8%F0%9F%8F%BE%E2%80%8D%F0%9F%92%BB-building-margin-match-the-tech-stack\">👨🏾‍💻 Building Margin Match: The Tech Stack</h2><p>When I decided to bring Margin Match to life digitally, I wanted to use modern tools that would let me create something polished and professional. Here's what I landed on:</p><p><strong>Next.js 15</strong> became my foundation—the latest version with all the performance improvements and developer experience enhancements. There's something satisfying about building on cutting-edge tech.</p><p><strong>Framer Motion</strong> handles all the card animations. When you draw cards or play matches, everything flows smoothly. Cards slide, flip, and transition in ways that make the digital version feel almost tactile.</p><p><strong>Capacitor</strong> lets me export the web app as an Android build. Sure, there are always a few quirks with Capacitor builds (they tend to lag behind the web version), but being able to take a web application and turn it into a native mobile app still feels like magic.</p><p>For the visual polish, I incorporated <strong>Lucide and React Icons</strong> for crisp, modern iconography. The interface needed to feel clean and intuitive—after all, the game's complexity should come from the strategy, not from figuring out how to use the app.</p><h2 id=\"the-details-that-matter\">The Details That Matter</h2><p>One thing I'm particularly proud of is integrating <strong>ElevenLabs sound effects</strong>—completely free—that give the game audio feedback. There's something deeply satisfying about hearing cards flip and matches register.</p><p>The whole thing is hosted on <strong>Vercel</strong> because, honestly, the deployment process is so smooth it almost feels like cheating. Push to GitHub, and within minutes, the updated version is live.</p><p>I even set it up as a <strong>Progressive Web App</strong>, so it can be installed on phones and desktops, giving it that native app feel without requiring app store distribution.</p><h2 id=\"%F0%9F%8E%AE-the-game-rules-in-case-you-want-to-try\">🎮 The Game Rules (In Case You Want to Try)</h2><p>Here's how Margin Match actually works:</p><p>🌀 <strong>Begin Your Journey</strong>: Hit 'Start Game' to get your first hand from the deck.</p><p>🎲 <strong>Draw with Intent</strong>: Tap 'Draw Cards' to pull one from the top, one from the bottom.</p><p>🔁 <strong>Play with Precision</strong>: The left card must align with the right board card—it must be +1, 0, or -1 in value (with Aces looping to Kings and vice versa).</p><p>🃏 <strong>Make Your Move</strong>: If they match, hit 'Play' to make your move.</p><p>❌ <strong>When Fate Frowns</strong>: No match? Press 'Discard' to send both cards to the discard pile.</p><p>♻️ <strong>A Deck Reborn</strong>: When you run out of cards, the discard pile gets shuffled back into the deck.</p><p>🏆 <strong>Victory or Defeat</strong>: Win by clearing all cards, or lose if no more plays are possible.</p><h2 id=\"why-this-matters-to-me\">Why This Matters to Me</h2><p>What started as a way to pass time during a really difficult period became something I'm genuinely proud of. There's something beautiful about taking an idea that existed only in my head and as scattered cards on a table, and turning it into something other people can experience.</p><p>The technical challenge was fun—figuring out card game logic, smooth animations, mobile responsiveness, and audio integration. But more than that, it represents a full circle moment. From that low place where I had nothing but time and cards, to now having the skills and tools to build something real and share it with the world.</p><p>Sometimes the best projects aren't the ones we plan meticulously, but the ones that emerge from genuine personal experience and the simple desire to share something meaningful with others.</p><p>Now, when someone asks me about that weird card game I invented, I don't have to struggle with explanations. I can just send them a link.</p><p><strong>Check out the game here via the web:</strong><br><a href=\"https://marginmatch.app/\">https://marginmatch.app/</a></p>",
  },
  {
    type: 'self',
    title: 'Animelist - Discord bot',
    description:
      'A Discord bot that allows users to search for Anime, Manga, Users and Characters on AniList with unique mid-sentence command functionality.',
    imgSrc:
      'https://images.unsplash.com/photo-1552308995-2baac1ad5490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEzfHxqYXZhc2NyaXB0fGVufDB8fHx8fDE3MTkxNjQ4ODF8MA&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/animelist',
    builtWith: [
      'JavaScript',
      'Discord.js',
      'AniList API',
      'Node.js',
      'fs',
      'turndown',
      'fetch',
    ],
    content:
      '<h1 id="my-journey-creating-animelist-a-unique-discord-bot-for-anime-enthusiasts">My Journey Creating AnimeList: A Unique Discord Bot for Anime Enthusiasts</h1><p>Hey fellow otaku and coding enthusiasts!</p><p>Today, I want to share my experience creating a Discord bot that I\'m particularly proud of - AnimeList. This project combined my love for anime with my passion for coding, resulting in a unique tool that brought a smile to many anime fans in our Discord community.</p><h2 id="the-birth-of-animelist">The Birth of AnimeList</h2><p>AnimeList was born out of a desire to have quick, seamless access to anime information right within our Discord conversations. I wrote this bot in JavaScript, leveraging several powerful modules including fs, turndown, discord.js, and fetch, among others.</p><h2 id="what-makes-animelist-special">What Makes AnimeList Special?</h2><h3 id="mid-sentence-commands">Mid-Sentence Commands</h3><p>One of the coolest features of AnimeList is its ability to process commands mid-sentence. Unlike many Discord bots that require separate messages or strict command formats, AnimeList can be summoned right in the flow of your conversation. Imagine typing:</p><p>"You should watch a{Attack on Titan}! Its really good."</p><p>The bot would seamlessly fetch and display information about Attack on Titan without interrupting your message. This feature made interactions feel more natural and conversational.</p><h3 id="powered-by-anilist-api">Powered by AniList API</h3><p>To ensure accurate and up-to-date information, I integrated the AniList API into AnimeList. This allowed users to search for:</p><ul><li>Anime series</li><li>Manga titles</li><li>Characters</li><li>User profiles</li></ul><p>The depth of information available made AnimeList a go-to resource for quick anime-related queries within our Discord server.</p><h2 id="the-technical-side">The Technical Side</h2><p>Creating AnimeList was a great learning experience. Some of the key technical aspects included:</p><ul><li>Implementing efficient API calls to AniList</li><li>Parsing and formatting the returned data for Discord display</li><li>Creating a flexible command parsing system for mid-sentence functionality</li><li>Handling user interactions and error cases gracefully</li></ul><h2 id="current-status-and-future-plans">Current Status and Future Plans</h2><p>While slash commands have become the new standard for Discord bots, AnimeList still holds its own with its unique mid-sentence functionality. It continues to be a useful tool for our anime discussions.</p><p>Looking ahead, I\'m considering:</p><ul><li>Adapting some features to work with slash commands</li><li>Expanding the database to include more niche anime and manga</li><li>Implementing a recommendation system based on user preferences</li></ul><h2 id="wrapping-up">Wrapping Up</h2><p>Creating AnimeList was more than just a coding project - it was a journey that combined my technical skills with my passion for anime. It\'s incredibly satisfying to see something you\'ve built being used and enjoyed by others in your community.</p><p>Have you ever created a bot or tool for your hobbies? I\'d love to hear about your experiences in the comments below!</p><p>Until next time, happy coding and anime watching!</p><div class="kg-card kg-button-card kg-align-center"><a href="https://github.com/xi-Rick/animelist" class="kg-btn kg-btn-accent">Check it out on Github</a></div>',
  },
  {
    type: 'self',
    title: 'Citadel',
    description:
      'An AI-powered tool that generates detailed and unique backstories for characters from the TV show Rick and Morty.',
    imgSrc:
      'https://images.unsplash.com/photo-1592564630984-7410f94db184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fHJpY2slMjBhbmQlMjBtb3J0eXxlbnwwfHx8fDE2NzM2NzA5NzE&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/citadel',
    builtWith: [
      'Next.js',
      'Next UI',
      'Node.js',
      'OpenAI',
      'DALL-E',
      'Discord.js',
      'MongoDB',
    ],
    links: [
      {
        title: 'Demo',
        url: 'https://citadel.vercel.app',
      },
    ],
    content:
      '<h1 id="building-my-rick-and-morty-inspired-citadel-project">Building My Rick and Morty-Inspired "Citadel" Project</h1><p>Hey fellow dimension-hoppers!</p><p>I\'m thrilled to share my latest passion project – a website I\'ve dubbed "Citadel." It\'s a tribute to the mind-bending universe of Rick and Morty, blending my love for the show with my passion for web development and AI.</p><h2 id="the-concept">The Concept</h2><p>Inspired by the show\'s "Citadel of Ricks," my Citadel aims to be a vast interdimensional repository of Rick and Morty information. I\'m leveraging the Rick and Morty API and integrating various OpenAI endpoints to generate unique content that even the Council of Ricks would approve of.</p><h2 id="current-features">Current Features</h2><h3 id="1-web-interface">1. Web Interface</h3><ul><li>Built with Next.js and Next UI</li><li>Basic but functional design (more intuitive interface coming soon!)</li></ul><h3 id="2-discord-bot">2. Discord Bot</h3><ul><li>Offers similar functionality to the website</li><li>Perfect for discussing infinite timelines with your Discord crew</li></ul><h3 id="3-character-based-story-generation">3. Character-Based Story Generation</h3><ul><li>Click on any character from the Rick and Morty API</li><li>Instantly generates a unique story about that character</li></ul><h3 id="4-ai-generated-illustrations">4. AI-Generated Illustrations</h3><ul><li>Uses DALL-E 3 to create images based on story context</li><li>Warning: This feature can be as expensive as Kalaxian crystals, so it\'s not always active!</li></ul><h2 id="upcoming-features">Upcoming Features</h2><h3 id="1-audio-narration">1. Audio Narration</h3><ul><li>Working on adding voice narration for generated stories</li><li>Hoping for future OpenAI voice cloning support (Imagine Rick narrating his own adventures!)</li></ul><h3 id="2-mongodb-integration">2. MongoDB Integration</h3><ul><li>Plan to store and organize user-generated stories</li><li>Create a collection of alternate universe Rick and Morty tales</li></ul><h2 id="the-big-picture">The Big Picture</h2><p>This project is my way of combining multiple technologies to create something as unique as Pickle Rick. It\'s ambitious, sure, but so is stealing from the Galactic Federation!</p><h2 id="wrapping-up">Wrapping Up</h2><p>Have you ever crafted a project inspired by your favorite TV show or movie? Drop your interdimensional cable in the comments below – I\'d love to hear about it!</p><p>Until our paths cross in another dimension</p><p>P.S. Wubba lubba dub dub!</p><hr><h2 id="tech-stack-highlight">Tech Stack Highlight</h2><ul><li>Frontend: Next.js, Next UI</li><li>Backend: Node.js</li><li>APIs: Rick and Morty API, OpenAI (GPT, DALL-E)</li><li>Database (Planned): MongoDB</li><li>Bot Platform: Discord</li></ul><hr><p>Remember, the multiverse is vast, and so are the possibilities for this project. Stay tuned for more updates as Citadel evolves!</p><div class="kg-card kg-button-card kg-align-center"><a href="https://citadel.vercel.app" class="kg-btn kg-btn-accent">Go check out my project!</a></div>',
  },
  {
    type: 'work',
    title: 'VoteWise',
    description:
      "A political web application that allows users to track their local representatives' voting records and legislation using the Congress.gov API for increased civic engagement.",
    imgSrc:
      'https://images.unsplash.com/photo-1555848962-6e79363ec58f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxwb2xpdGljYWx8ZW58MHx8fHwxNzA3MzY4MzY0fDA&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-rick/votewise',
    builtWith: ['Next.js 15', 'React 19', 'TypeScript', 'Congress.gov API'],
    links: [
      {
        title: 'Demo',
        url: 'https://ivotewise.com',
      },
    ],
    content:
      '<div class="space-y-4"><div class="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize p-2">web app</div><h1 class="text-3xl font-bold tracking-tighter capitalize sm:text-4xl">VoteWise: My Foray into Political Web Applications</h1><p class="text-gray-500 dark:text-gray-400">― A political web application that allows users to track their local representatives\' voting records and legislation using the Congress.gov API for increased civic engagement.</p></div><div class="relative space-y-6" style="opacity: 1; transform: none;"><div class="w-16 h-px bg-foreground/30" style="width: 64px;"></div><div class="project-content" style="opacity: 1;"><h2 id="the-genesis-of-votewise">The Genesis of VoteWise</h2>\n<p>I never thought I\'d be developing web applications with a political angle, but here I am, creator of VoteWise. It\'s funny how life pushes you in unexpected directions sometimes.</p>\n<p>For a while now, I\'ve been the go-to person in my family for political updates. I guess not having as many distractions as others allows me to stay more informed. But you know how it goes - my cousins started throwing that old adage at me: "You\'re talking a whole lot, but what are you actually doing about it?"</p>\n<p>That struck a chord. I realized it was time to put my skills to use and contribute something meaningful. That\'s how VoteWise was born.</p>\n\n<h2 id="what-is-votewise">What is VoteWise?</h2>\n<p>VoteWise is a modern Next.js application that empowers citizens to stay informed about their elected representatives and engage with democracy. Built with cutting-edge technologies, it provides real-time access to voting records, enables community discussions, and makes political engagement accessible to everyone.</p>\n<p>The platform allows users to find their local House, Senate, and other elected officials simply by entering their address or zip code. Users can view detailed voting histories, track legislative patterns, and connect with others in their district for meaningful political dialogue.</p>\n\n<h2 id="key-features">Key Features</h2>\n<ul>\n<li><strong>Representative Tracking</strong>: Find and track your local representatives with detailed voting records</li>\n<li><strong>Real-time Data</strong>: Access up-to-date voting information directly from Congress.gov API</li>\n<li><strong>Community Engagement</strong>: Join district-based discussions with verified location authentication</li>\n<li><strong>Smart Notifications</strong>: Get alerts when your representatives vote on legislation you care about</li>\n<li><strong>Mobile-First Design</strong>: Responsive, accessible interface optimized for all devices</li>\n<li><strong>Privacy &amp; Security</strong>: Enterprise-grade security with Google OAuth authentication</li>\n<li><strong>Analytics Dashboard</strong>: Visualize voting patterns and track representative performance over time</li>\n</ul>\n\n<h2 id="technologies-used">Technologies Used</h2>\n<ul>\n<li><strong>Next.js 15</strong>: Modern React framework with App Router for optimal performance</li>\n<li><strong>React 19</strong>: Latest React version with advanced features and hooks</li>\n<li><strong>TypeScript</strong>: Full type safety and improved developer experience</li>\n<li><strong>Tailwind CSS</strong>: Utility-first CSS framework for responsive design</li>\n<li><strong>Framer Motion</strong>: Smooth animations and interactive user experiences</li>\n<li><strong>Radix UI</strong>: Accessible, unstyled UI components as foundation</li>\n<li><strong>Prisma</strong>: Type-safe database ORM with PostgreSQL</li>\n<li><strong>Redis (ioredis)</strong>: High-performance caching and session management</li>\n<li><strong>Congress.gov API</strong>: Official government API for legislative data</li>\n<li><strong>Arctic</strong>: Modern OAuth authentication library</li>\n<li><strong>Zod</strong>: Runtime type validation and schema parsing</li>\n<li><strong>Recharts</strong>: Data visualization for voting analytics</li>\n</ul>\n\n<h2 id="community-features">Community &amp; Engagement</h2>\n<p>One of VoteWise\'s most innovative features is its location-verified community discussions. Users can engage with others in their specific voting district, ensuring that conversations remain relevant and focused on local representation. This creates a more meaningful dialogue between constituents and helps representatives understand their community\'s priorities.</p>\n<p>The platform also includes comprehensive analytics that help users understand voting patterns, track legislative trends, and see how their representatives align with district preferences over time.</p>\n\n<h2 id="privacy-and-security">Privacy &amp; Security</h2>\n<p>VoteWise takes user privacy seriously. The platform uses Google\'s secure authentication system and implements enterprise-grade security measures. Your location is only used to show relevant representatives - addresses aren\'t stored or shared. All personal information is protected, and the platform is designed with privacy-by-design principles.</p>\n\n<h2 id="future-roadmap">Future Roadmap</h2>\n<p>While VoteWise already offers a comprehensive set of features, I\'m continuously improving and expanding the platform. Upcoming features include:</p>\n<ul>\n<li><strong>Enhanced Mobile Experience</strong>: Progressive Web App capabilities with offline functionality</li>\n<li><strong>Advanced Analytics</strong>: More sophisticated data visualization and trend analysis</li>\n<li><strong>Email Notifications</strong>: Comprehensive notification system for legislative updates</li>\n<li><strong>Multi-language Support</strong>: Making democracy accessible across language barriers</li>\n<li><strong>API Access</strong>: Public API for developers to build upon VoteWise data</li>\n</ul>\n\n<h2 id="impact-and-vision">Impact &amp; Vision</h2>\n<p>VoteWise represents more than just a web application - it\'s a step towards more informed and engaged citizenry. By making voting records transparent and accessible, the platform helps bridge the gap between representatives and their constituents. VoteWise encourages active participation in democracy while providing the tools needed for informed decision-making.</p>\n<p>My vision is to create a more transparent political landscape where citizens can easily track their representatives\' actions, engage in meaningful discussions, and make their voices heard at the local level.</p>\n\n<h2 id="conclusion">Conclusion</h2>\n<p>VoteWise continues to evolve as a comprehensive platform for political engagement and transparency. What started as a personal project to "do something about it" has grown into a feature-rich application that serves citizens across the country.</p>\n<p>The platform is completely free to use for all core features, because I believe democracy should be accessible to everyone. Whether you\'re a political newcomer or a seasoned civic participant, VoteWise provides the tools you need to stay informed and engaged.</p>\n<p>I\'m proud of what VoteWise represents and excited about its potential to make our political system more transparent and accessible. Your feedback and engagement help make this platform better for everyone.</p>\n\n<p>Experience VoteWise today: <a href="https://ivotewise.com/" target="_blank" rel="noopener noreferrer">https://ivotewise.com/</a></p></div></div>',
  },
  {
    type: 'self',
    title: 'Break the Wall',
    description:
      'A transparency tool that analyzes SEC filings and corporate data to expose corporate hierarchies and executive compensation, revealing the "wall" of positions designed to protect wealth rather than create value.',
    imgSrc:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDJ8fGJ1c2luZXNzfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/break-the-wall',
    builtWith: ['Next.js', 'TypeScript', 'SEC EDGAR API', 'D3.js', 'Recharts'],
    links: [
      {
        title: 'Demo',
        url: 'https://breakthewall.us',
      },
    ],
    content:
      'A transparency tool that analyzes SEC filings and corporate data to expose corporate hierarchies and executive compensation, revealing the "wall" of positions designed to protect wealth rather than create value.',
  },
  {
    type: 'self',
    title: 'Steam Insight',
    description:
      'Steam Insight is a modern Steam game discovery platform built with Next.js and TypeScript. Explore thousands of games with intelligent search, detailed reviews, rich media, and advanced analytics.',
    imgSrc:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHx2aWRlbyUyMGdhbWVzfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/steam-insight',
    builtWith: ['Next.js', 'TypeScript', 'React', 'Steam API'],
    content:
      'Steam Insight is a modern Steam game discovery platform built with Next.js and TypeScript. Explore thousands of games with intelligent search, detailed reviews, rich media, and advanced analytics.',
  },
  {
    type: 'work',
    title: "Captain's Log",
    description:
      "A voice-powered Progressive Web App inspired by One Piece and Star Trek that uses OpenAI's Whisper technology to transcribe speech into text, creating a personal digital logbook with AI-powered summarization.",
    imgSrc:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHx2b2ljZSUyMHJlY29yZGluZ3xlbnwwfHx8fDE3MDczNjgzNjR8MA&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/captains-log',
    builtWith: [
      'Next.js 14',
      'React 18',
      'shadcn/ui',
      'OpenAI Whisper API',
      'MongoDB',
      'NextAuth.js',
      'Tailwind CSS',
      'react-hook-form',
      'Zod',
    ],
    content:
      '<div class="space-y-4"><div class="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize p-2">Web App</div><h1 class="text-3xl font-bold tracking-tighter capitalize sm:text-4xl">Captain\'s Log</h1><p class="text-gray-500 dark:text-gray-400">― A voice-powered Progressive Web App inspired by One Piece and Star Trek that uses OpenAI\'s Whisper technology to transcribe speech into text, creating a personal digital logbook with AI-powered summarization.</p></div><div class="relative space-y-6" style="opacity: 1; transform: none;"><div class="w-16 h-px bg-foreground/30" style="width: 64px;"></div><div class="project-content" style="opacity: 1;"><p></p><h1 id="captains-log-a-voice-powered-journal">Captain\'s Log: A Voice-Powered Journal</h1><p align="center"><img src="https://i.imgur.com/I8p2Xjn.png" alt="Captain\'s Log Logo"></p><p>I\'m excited to share a project I\'ve been working on: a React application with a beautiful, accessible interface powered by shadcn/ui. I call it <strong>Captain\'s Log</strong>, inspired by my love for both <strong>One Piece</strong> and <strong>Star Trek</strong>. This web app combines the adventurous spirit of Monkey D. Luffy and the exploratory nature of Starfleet captains into a practical, everyday tool.</p><h2 id="what-is-captains-log">What is Captain\'s Log?</h2><p>Captain\'s Log is a <strong>Progressive Web App (PWA)</strong> that I can conveniently access on my phone. It\'s a voice transcription application that leverages <strong>OpenAI\'s Whisper technology</strong> to transcribe spoken words into text. The idea is to have a personal logbook where I can quickly and efficiently record my thoughts and activities, similar to how a starship captain logs their journeys and encounters.</p><h2 id="technical-stack">Technical Stack</h2><p>Here\'s a breakdown of the technologies powering Captain\'s Log:</p><ol><li><strong>Frontend Framework</strong>: Built with Next.js 14 and React 18, providing a robust foundation for server-side rendering and optimal performance.</li><li><strong>UI Components</strong>: Implemented using shadcn/ui, a collection of beautifully designed, accessible components built on top of Radix UI primitives. This ensures a consistent, modern look while maintaining excellent accessibility standards.</li><li><strong>Voice Transcription</strong>: Utilizes OpenAI\'s Whisper API through their latest SDK (v4) to convert voice recordings into accurate text transcriptions.</li><li><strong>Data Management</strong>: All transcriptions are stored in MongoDB, with the latest driver (v6) ensuring efficient data operations and reliability.</li><li><strong>Form Handling</strong>: Leverages react-hook-form with Zod validation for robust form management and data validation.</li><li><strong>Authentication</strong>: Implements NextAuth.js for secure, flexible authentication handling.</li><li><strong>Styling</strong>: Uses Tailwind CSS with additional animations through tailwindcss-animate, providing a responsive and polished user interface.</li><li><strong>Enhanced UX</strong>: Features smooth page transitions with next-view-transitions and elegant toast notifications using Sonner.</li></ol><!--kg-card-begin: html--><br classname="hr-5"><!--kg-card-end: html--><!--kg-card-begin: html--><center><img src="https://i.imgur.com/T4rmROP.gif"></center><!--kg-card-end: html--><!--kg-card-begin: html--><br classname="hr-5"><!--kg-card-end: html--><h2 id="key-features">Key Features</h2><ol><li><strong>Voice Transcription with OpenAI</strong>: The app uses OpenAI\'s Whisper endpoint to transcribe voice recordings into text. This state-of-the-art transcription technology ensures high accuracy and efficiency, making it perfect for quick note-taking or detailed journaling.</li><li><strong>Intelligent Data Management</strong>: All transcriptions are stored in MongoDB with efficient indexing and querying capabilities. Each entry is logged and saved for future reference.</li><li><strong>AI-Powered Summarization</strong>: Once the transcription is complete, OpenAI further processes the text to summarize the context of the recording. This creates a concise summary header for each entry, making it easier to browse through past logs.</li></ol><h2 id="personal-and-future-uses">Personal and Future Uses</h2><p>I use Captain\'s Log for various purposes, from capturing random ideas to maintaining important records. As the project evolves, I\'m considering several expansions:</p><ul><li><strong>Local Deployment</strong>: While currently a web-based application, it would be interesting to develop a version that runs locally on devices.</li><li><strong>Enhanced Authentication</strong>: Currently implements Single Sign-On (SSO) capabilities for personal use, with potential for expanded authentication options.</li><li><strong>Open Source Journey</strong>: There\'s a possibility of making Captain\'s Log open source, allowing others to benefit from and contribute to its development.</li></ul><h2 id="final-thoughts">Final Thoughts</h2><p>Captain\'s Log represents more than just a technical project – it\'s a fusion of my passion for technology with my love for iconic sci-fi and anime series. The transition to shadcn/ui and the integration of modern React patterns has made it more maintainable and accessible than ever.</p><p>Whether I continue developing it for personal use or open it up for community contribution, I\'m thrilled with how it\'s evolved. The combination of cutting-edge web technologies with practical utility makes it a tool I use daily.</p><p>Check out the project at <a href="https://github.com/xi-Rick/captains-log">https://github.com/xi-Rick/captains-log</a></p><p>Stay tuned for more updates on Captain\'s Log and other projects I\'m working on!</p></div></div>',
  },
  {
    type: 'self',
    title: 'ArchGaming',
    description:
      '🎮 Transform your Arch Linux system into a gaming powerhouse with intelligent hardware detection, performance optimization, and complete gaming stack installation. Supports 8+ Arch derivatives.',
    imgSrc:
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxnYW1pbmd8ZW58MHx8fHwxNzA3MzY4MzY0fDA&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/archgaming',
    builtWith: ['Bash', 'Linux', 'Gaming', 'Automation'],
    content:
      '🎮 Transform your Arch Linux system into a gaming powerhouse with intelligent hardware detection, performance optimization, and complete gaming stack installation. Supports 8+ Arch derivatives.',
  },
  {
    type: 'self',
    title: 'DevSetup',
    description:
      '🚀 A cross-platform development environment setup script. Transform any Linux distro into a modern web development powerhouse with Node.js, Docker, IDEs, and more. Supports Arch, Ubuntu, Fedora, openSUSE.',
    imgSrc:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHxjb2RpbmclMjBkZXZlbG9wbWVudHxlbnwwfHx8fDE3MDczNjgzNjR8MA&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/devsetup',
    builtWith: ['Shell', 'Linux', 'Node.js', 'Docker', 'Automation'],
    content:
      '🚀 A cross-platform development environment setup script. Transform any Linux distro into a modern web development powerhouse with Node.js, Docker, IDEs, and more. Supports Arch, Ubuntu, Fedora, openSUSE.',
  },
  {
    type: 'self',
    title: 'Dock App Demo',
    description:
      "This project showcases a MacOS-inspired Dock component built with NextJS 14's App Router and Cult/UI's libraries. It integrates Progressive Web App (PWA) functionality using @ducanh2912/next-pwa.",
    imgSrc:
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfG1hY29zfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/dock-app-demo',
    builtWith: ['Next.js', 'TypeScript', 'PWA', 'UI Components'],
    content:
      "This project showcases a MacOS-inspired Dock component built with NextJS 14's App Router and Cult/UI's libraries. It integrates Progressive Web App (PWA) functionality using @ducanh2912/next-pwa.",
  },
  {
    type: 'self',
    title: 'My Sidebar App',
    description:
      "This starter template demonstrates how to build a functional Next.js 14 application featuring Aceternity UI's Sidebar component. It includes dark mode support and is mobile responsive.",
    imgSrc:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHVpfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/my-sidebar-app',
    builtWith: ['Next.js', 'TypeScript', 'Aceternity UI', 'Responsive Design'],
    content:
      '<div class="space-y-4"><div class="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize p-2">web app</div><h1 class="text-3xl font-bold tracking-tighter capitalize sm:text-4xl">Building a Sidebar App with Aceternity UI</h1><p class="text-gray-500 dark:text-gray-400">― A demonstration of building a modern sidebar application using Aceternity UI components with Next.js 14, featuring dark mode toggle and responsive design.</p></div><div class="relative space-y-6" style="opacity: 1; transform: none;"><div class="w-16 h-px bg-foreground/30" style="width: 64px;"></div><div class="project-content" style="opacity: 1;"><h2 id="introduction">Introduction</h2><p>In my recent exploration of React UI libraries, I stumbled upon&nbsp;<a href="https://ui.aceternity.com/" rel="noreferrer"><strong>Aceternity UI</strong></a>. This library is a stunning collection of components that caught my attention, particularly the sidebar component. I decided to create a simple sidebar app demonstration using this library, and I\'m excited to share my experience!</p><h2 id="getting-started-with-nextjs-14">Getting Started with Next.js 14</h2><p>To build my application, I chose&nbsp;<strong>Next.js 14</strong>, a framework I\'m currently learning to master. The sidebar component from Aceternity UI seemed perfect for structuring the layout of my entire application. With its sleek design and functionality, I knew it would serve as a solid foundation.</p><h2 id="structuring-the-application">Structuring the Application</h2><p>Using the sidebar component, I structured a full application that includes several key pages: a&nbsp;<strong>dashboard</strong>,&nbsp;<strong>profile</strong>,&nbsp;<strong>settings</strong>, and a&nbsp;<strong>home page</strong>. The dynamic routing capabilities of Next.js made it easy to navigate between these pages seamlessly.</p><h2 id="implementing-dark-mode-with-tailwind">Implementing Dark Mode with Tailwind</h2><p>To enhance the user experience, I integrated&nbsp;<strong>Tailwind CSS</strong>&nbsp;to implement a dark mode feature. This allows users to toggle between dark mode and light mode effortlessly, adding a modern touch to the application.</p><h2 id="a-bare-bones-demonstration">A Bare Bones Demonstration</h2><p>This project was intended to be a bare bones demonstration of a sidebar application. My goal was to create something that didn\'t take too long to build while still providing a functional and visually appealing layout. It was a great opportunity to get some hands-on experience and practice my skills.</p><h2 id="open-source-contribution">Open Source Contribution</h2><p>One of the best aspects of this project is that it\'s open source! Anyone interested can find the repository, contribute, or even fork it to start their own project. Contributions are always welcome, and I encourage anyone to open a pull request if they have suggestions or improvements.</p><h2 id="conclusion">Conclusion</h2><p>If you\'re looking for unique and stylish components for your web applications, I highly recommend checking out&nbsp;<strong>Aceternity UI</strong>. Their component library is filled with beautiful options that can elevate your projects. I\'m excited about the potential of this library and look forward to using it in future applications!</p><p>Check out my project here : <a href="https://my-sidebar-app.vercel.app/">https://my-sidebar-app.vercel.app/</a><br>Source code: <a href="https://github.com/xi-Rick/my-sidebar-app">https://github.com/xi-Rick/my-sidebar-app</a></p><hr><p>Feel free to explore the <a href="https://ui.aceternity.com/" rel="noreferrer">Aceternity UI</a> library and see how it can enhance your own projects!</p></div></div>',
  },
  {
    type: 'self',
    title: 'Next.js Ghost Frontend',
    description:
      'Transform your Ghost-powered blog into a visual masterpiece with this state-of-the-art NextJS 14 Ghost Frontend. Built with the robust capabilities of Next.js, TypeScript, and the Aceternity UI library.',
    imgSrc:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHdlYnNpdGV8ZW58MHx8fHwxNzA3MzY4MzY0fDA&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/nextjs14-ghost-frontend',
    builtWith: ['Next.js', 'TypeScript', 'Ghost CMS', 'Aceternity UI'],
    content:
      'Transform your Ghost-powered blog into a visual masterpiece with this state-of-the-art NextJS 14 Ghost Frontend. Built with the robust capabilities of Next.js, TypeScript, and the Aceternity UI library.',
  },
  {
    type: 'self',
    title: 'Next.js Pages Template',
    description:
      'A robust starter template for Next.js 13 applications featuring NextUI for UI design, MongoDB for data management, and Next-PWA for Progressive Web App capabilities.',
    imgSrc:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfHRlbXBsYXRlfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/nextjs-pages-template',
    builtWith: ['Next.js', 'TypeScript', 'MongoDB', 'NextUI', 'PWA'],
    content:
      'A robust starter template for Next.js 13 applications featuring NextUI for UI design, MongoDB for data management, and Next-PWA for Progressive Web App capabilities.',
  },
  {
    type: 'self',
    title: 'What If Anime',
    description:
      '⚡ A revolutionary platform where anime enthusiasts become architects of alternative realities. Create, vote on, and discuss compelling "what if" scenarios that reimagine your favorite anime stories with different outcomes and character arcs.',
    imgSrc:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEwfGFuaW1lfGVufDB8fHx8MTcwNzM2ODM2NHww&ixlib=rb-4.0.3&q=80&w=2000',
    repo: 'https://github.com/xi-Rick/anime',
    builtWith: [
      'Next.js 15',
      'React 19',
      'TypeScript',
      'Supabase',
      'PostgreSQL',
    ],
    links: [
      {
        title: 'Demo',
        url: 'https://whatifanime.vercel.app/',
      },
    ],
    content:
      '⚡ A revolutionary platform where anime enthusiasts become architects of alternative realities. Create, vote on, and discuss compelling "what if" scenarios that reimagine your favorite anime stories with different outcomes and character arcs.',
  },
]
