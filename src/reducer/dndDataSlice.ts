import { createSlice } from "@reduxjs/toolkit";

export const dndSlice = createSlice({
    name: "dbdData",
    initialState : {
        isDndEnable: false,
    },
    reducers: {
        setDndEnabled: (state, action) => {
            state.isDndEnable = action.payload
        }
    }
})

export const dndDetails = (state: any) => state?.dndDetails;
export const { setDndEnabled } = dndSlice.actions
export default dndSlice.reducer
