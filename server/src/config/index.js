import * as path from 'path'
import * as dotenv from 'dotenv'

const setup = () => {
  dotenv.config({path: path.join(__dirname, '/../../.env')})
  return dotenv
}

export default {
  setup
}
