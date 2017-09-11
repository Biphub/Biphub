import * as mongoose from 'mongoose';

export type PostModel = mongoose.Document & {
  title: String,
  body: String,
}

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Post = mongoose.model('Post', PostSchema);
export default Post;
