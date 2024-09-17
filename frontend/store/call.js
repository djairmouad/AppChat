import { createSlice } from "@reduxjs/toolkit";


const initialState={
    friend:null,
    show:false
}

const call=createSlice({
    name:"call",
    initialState:initialState,
    reducers:{
        showCall(state){
            state.show=true;
        },
        removeCall(state){
            state.show=false
            state.friend=null
        }
    }
})

export const callAction=call.actions;

const callReducers=call.reducer
export default callReducers
