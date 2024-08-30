const jwt=require("jsonwebtoken")

const privateKey="HelloWorld";


function authJWT(req,res,next){
    const authHeader= req.headers["Authorization"];
    const token=authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(500).json({success:false,message:"Unauthorized: Missing token"})
    }
    jwt.verify(token,privateKey,(err,decoded)=>{
        if(err){
            return res.status(403)
        }
        console.log(decoded)
        req.user=decoded;
        next()
    })

}

module.exports={authJWT}