import * as dotenv from 'dotenv';
import * as path from 'path';

const setup = () => {
  dotenv.config({ path: path.join(__dirname, '/../../.env') });
  return dotenv;
};

export default {
  setup
};
