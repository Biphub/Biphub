/**
 * GET /
 * Home page.
 */
export const index = (req, res) => {
  res.render('home', {
    title: 'Home'
  })
}
