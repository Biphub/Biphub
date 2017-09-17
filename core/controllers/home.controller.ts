import { Request, Response } from 'express';

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  console.log('checking req ', req.user)
  res.render('home', {
    title: 'Home'
  });
};
