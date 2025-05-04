import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:'user',
    initialState:{
        currentUser:null,
        loading:false,
        error:null,
        status:null
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
        updateStart:(state)=>{
            state.error = null;
            state.loading = false;
        },
        updateSuccess:(state,action)=>{
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        updateFailure:(state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
        },
        deleteUserStart:(state)=>{
            state.error = null;
            state.loading = true;
        },
        deleteUserSuccess:(state,action)=>{
            state.currentUser = null;
            state.error = null;
            state.loading = false;
            state.status = action.payload;
        },
        deleteUserFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        signOutStart:(state)=>{
            state.loading = true;
            state.error = null;
        },
        signOutFailure:(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        },    
        signOutSuccess:(state,action)=>{
            state.currentUser = null;
            state.error = null;
            state.loading = false;
            state.status = action.payload;
        }   
    }
});

export const {signInSuccess,signInFailure,signInStart,updateStart,updateSuccess,updateFailure,deleteUserStart,deleteUserFailure,deleteUserSuccess,signOutStart,signOutSuccess,signOutFailure} = userSlice.actions;
export default userSlice.reducer;