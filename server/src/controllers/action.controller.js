import logger from '../logger'
import actionDao from '../DAO/action.dao'

const get = (req, res) => {
  req.checkBody({
    id: {
      notEmpty: true,
    },
  })
  const { id } = req.body
  actionDao.getAction(id).fork(
    err => {
      logger.error('Could not find an action by id ', id, '  ', err)
      throw err
    },
    action => {
      return res.json({
        ok: true,
        data: action,
      })
    }
  )
}

export default {
  get,
}
