import jwt from 'jsonwebtoken';

const genToken = async (id)=>{
    try{
        const token= jwt.sign({id}, process.env.JWT_SECRET, {expiresIn : '30d'});
        return token;
    }
    catch(err){
        console.error("token mae issue",err.message);
        throw err;
    }
    
}

export default genToken;