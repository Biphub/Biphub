/**
 * GET /
 * Home page.
 */
export let index = (req, res) => {
  res.render('home', {
    title: 'Home'
  })
}
