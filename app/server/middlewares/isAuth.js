import jwt from 'jsonwebtoken';

const isAuth = async(req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: "No token, authorization denied"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach entire user payload for flexible checks
        next();
    }   catch(err){
        console.error(err.message);
        return res.status(401).json({message: "Token is not valid"});
    }
}

export default isAuth;