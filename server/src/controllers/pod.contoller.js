import {models} from '../models'

const list = (req, res) => {
  models.Pod.findAll()
    .then((values) => res.json({ result: values }))
    .catch((error) => res.json({ error }))
}

export default {
  list,
}