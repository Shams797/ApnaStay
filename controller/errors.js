// error
exports.error=(req,res,next)=>{
  res.status(404).render('404',{
    pageTitle:'404 not found',
    currentPage:'404',
    isLoggedIn:req.session.isLoggedIn,
    user:req.session.user
  })
}