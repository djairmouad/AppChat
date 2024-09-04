
import Friends from "./Friends";
import Settings from "./Settings";

export default function Side({data}){
    return <>
     <Friends data={data}/>
      <Settings data={data}/>
    </>
}