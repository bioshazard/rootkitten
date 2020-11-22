module.exports = {
	pwa: {
    manifestCrossorigin: 'use-credentials',
  },
	publicPath: process.env.NODE_ENV === 'production'
    ? '/' + process.env.CI_PROJECT_NAME + '/'
    : '/'
}
