module.exports = {
  createFakeIssue: ({ title, description }) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        console.info('Creating a fake issue! title ', title, '  ', description)
        res({ ok: true })
      }, 1300)
    })
  },
  testMoveIssue: ({ reason }) => {
    return new Promise((res, rej) => {
      console.info('Moving a fake issue! ', reason)
      res({ ok: true })
    })
  }
}