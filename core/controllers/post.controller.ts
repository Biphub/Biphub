import { default as Post, PostModel } from '../models/Post.model';
import { Request, Response } from 'express';

export let createPost = (req: Request, res: Response) => {
  console.log('checking create post! ', req.body);
  req.assert('title', 'Title cannot be empty').notEmpty();
  req.assert('body', 'Body cannot be empty').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
  });
  console.log('checking post before saving ', post);
  post.save();
  Post.find({}, (err, docs) => {
    console.log('err? ', err);
    console.log('docs ', docs);
    return res.json({
      ok: true,
    });
  });
}