import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "./conversation";

const store=configureStore({
    reducer:{conversation:conversationReducer}
})


export default store