module.exports = {
  postMessage: function ({channel, text}) {
    console.log('received channel', channel, 'text', text)
  }
}