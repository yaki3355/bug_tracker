const isAuth = (req, res, next) => {
    req.isAuthenticated() 
    ? next() 
    : res.status(401).send();
};

module.exports = {
    isAuth
}