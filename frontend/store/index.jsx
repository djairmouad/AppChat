import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./conversation";
import callReducers from "./call";

const store=configureStore({
    reducer:{conversation:conversationReducer,call:callReducers}
})


export default store