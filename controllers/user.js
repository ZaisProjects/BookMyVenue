module.exports.userLogin = async(req,res)=>{
    req.flash('success', `Welcome Back! ${req.body.username}!`);
    redirectUrl = res.locals.redirectUrl || '/';
    res.redirect(redirectUrl);
}

module.exports.userLogout =  (req,res, next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You are Logged Out Successfully !");
        res.redirect('/');
    });
}