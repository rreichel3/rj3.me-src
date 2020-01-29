module.exports = {
  title: 'Robert Reichel',
  description: 'Security, Tech, & Life',
  dest: 'public',
  docsDir: 'docs',
  themeConfig: {
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'GitHub', link: 'https://github.com/rreichel3' },
      { text: 'Subscribe', link: 'https://mailchi.mp/be6ec727b22d/rj3me' },
      //{ text: 'Knowledge', link: '/knowledge/' },
      //{ text: 'Gists', link: '/subscribe/' },
    ],
    sidebar: {
      '/blog/': [
        'questions-to-ask-when-transitioning-jobs',
        'reading-your-cars-obdii-output',
        'nsa-codebreaker-challenge-2016',
        'elliptic-curve-cryptography',
      ],

    }
  }
  
}