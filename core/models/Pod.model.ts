import * as mongoose from 'mongoose';

export type PodModel = mongoose.Document & {
  name: String,
  title: String,
  description: String,
  url: String,
  config: {},
  auth: {
    // Type of strategy. e.g. Token, oAuth, test
    strategy: String,
    // Required properties to perform the type of authentication
    properties: {},
  },
  actions: {}
}

const PodSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Pod = mongoose.model('Pod', PodSchema);
export default Pod;
