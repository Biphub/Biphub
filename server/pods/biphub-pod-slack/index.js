const slack = require('slack')

module.exports = {
  setupBot: ({ token }) => {
    slack.bot()
  },
  postMessage: ({token, channel, text}) => new Promise((res, rej) => {
    slack.chat.postMessage({
      token, channel, text
    }).then((result) => res(result.message))
      .catch((err) => {
      rej(err)
    })
  })
}
