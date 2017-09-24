import * as dotenv from 'dotenv'
import * as path from 'path'

const setup = () => {
  dotenv.config({ path: path.join(__dirname, '/../../.env') })
  console.log('Env setup complete', process.env.NODE_ENV)
  return dotenv
}

export default {
  setup
}
