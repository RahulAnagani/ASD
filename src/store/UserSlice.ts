import { createSlice } from "@reduxjs/toolkit";
const UserSlice=createSlice({
    name:"user",
    initialState:{},
    reducers:{
        setUser:(state,action)=>{
            console.log(state);
            return action.payload
        }
    }
});
export const actions=UserSlice.actions;
export default UserSlice