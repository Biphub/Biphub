module.exports = {
  postFakeMessage: function ({ text }) {
    return new Promise((res, rej) => {
      console.log('invoking post fake message')
      setTimeout(() => {
        console.info('pod fake 1 received a fake action trigger! ', text);
        res({ ok: true })
      }, 2000);
    })
  }
}