export const protegerRuta = (req, res, next) => {
    if (!req.session || !req.session.usuario) {
        return res.redirect('/login');
    }
    next();
};