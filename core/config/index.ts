import * as dotenv from 'dotenv'
import * as path from 'path'

const setup = () => {
  const z = path.join(__dirname, '/../../.env')
  dotenv.config({ path: path.join(__dirname, '/../../.env') })
  return dotenv
}

export default {
  setup
}
