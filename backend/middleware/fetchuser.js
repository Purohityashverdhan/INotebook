const jwt = require('jsonwebtoken');
const jwtSecret = "Yashis$boy";


const fetchuser = (req, res, next) => {
    //get the token from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authrnticate usiing valid token" });
    }
    try {
        const data = jwt.verify(token, jwtSecret)
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authrnticate usiing valid token" });
    }
}

module.exports = fetchuser;