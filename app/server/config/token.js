import jwt from 'jsonwebtoken';

const genToken = async (user)=>{
    try{
        const token= jwt.sign({id : user._id, userType: user.userType}, 
            process.env.JWT_SECRET, {expiresIn : '30d'});
        return token;
    }
    catch(err){
        console.error("token has issue",err.message);
        throw err;
    }
    
}

export default genToken;