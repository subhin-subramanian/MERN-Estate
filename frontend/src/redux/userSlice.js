import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:'user',
    initialState:{
        currentUser:null,
        loading:false,
        error:null
    },
    reducers:{
        signInStart:(state)=>{
            state.error = null;
            state.loading = true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        signInFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const {signInSuccess,signInFailure,signInStart} = userSlice.actions;
export default userSlice.reducer;