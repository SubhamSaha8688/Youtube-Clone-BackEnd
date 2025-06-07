import userModel from "../Model/user.model.js";
import jwt from 'jsonwebtoken';

// Middleware to verify JWT tokens for protected routes
function VerifyToken(req, res, next) {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "JWT"
    ) {
        jwt.verify(
            req.headers.authorization.split(" ")[1],
            "Secretkey",
            function (err, verifiedtoken) {
                if (err) {
                    return res.status(400).send(err);
                }
                if (verifiedtoken) {
                    userModel
                        .findOne({ email: verifiedtoken.email })
                        .then(data => {
                            if (!data) {
                                return res.status(400).send('Something went wrong');
                            }
                            req.user = data;
                            next();
                        })
                        .catch(err => {
                            return res.status(500).send(err);
                        });
                }
            }
        );
    } else {
        return res.status(400).json({ error: true, message: "Access Denied" });
    }
}

export default VerifyToken;