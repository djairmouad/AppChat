export default function getToken(){
const token=localStorage.getItem("token");
return token
}

export function RemoveToken(){
localStorage.removeItem("token");
return null
}