
import {createSlice} from "@reduxjs/toolkit"

const initialState={
        senderId: null,
        content: "",
        timestamp: null,
        status: null,
        nameFile:null,
        ArrayConversation:[]
}
const MessageSlice=createSlice({
name:"Message",
initialState:initialState,
reducers:{
    newMessage(state,action){
    const {senderId,content,timestamp,status,nameFile}=action.payload;
    state.senderId=senderId
    state.content=content
    state.timestamp=timestamp
    state.status=status
    state.nameFile=nameFile
    const newMessage={senderId,content,timestamp,status,nameFile}
    console.log(newMessage)
    state.ArrayConversation.push({...newMessage})
    },
    deleteMessage(state){
        state.senderId=""
        state.content=""
        state.timestamp=""
        state.status=""
        state.nameFile=null;
    },
    addMessageToArray(state,action){
     const newMessage={...action.payload}
     state.ArrayConversation.push({...newMessage})   
    },deleteArray(state){
        state.ArrayConversation=[];
    }
}
})

export const conversationAction=MessageSlice.actions;
const conversationReducer=MessageSlice.reducer;

export default conversationReducer