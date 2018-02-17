import { models } from '../models'

const list = (req, res) => {
  models.Pod.findAll()
    .then(values => res.json({ result: values }))
    .catch(err => res.json({ error: err }))
}

export default {
  list,
}
