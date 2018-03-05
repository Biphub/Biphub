module.exports = {
  postFakeMessage: function({ text }) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        console.info('pod fake 1 received a fake action trigger! ', text)
        res({ ok: true })
      }, 2000)
    })
  },
  searchChannel: function({ searchText }) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        console.info('Searching a channel! ', searchText)
        res({ ok: true })
      }, 2000)
    })
  },
  deleteFakeMessage: function({ messageId }) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        console.info('Deleting a fake message', messageId)
        res({ ok: true })
      }, 1500)
    })
  },
}
