import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import PaymentService from "src/services/PaymentService";

export const initialState = {
    loading: false,
    error: "",
    performingAction: false,
    success: false,
    message: "",
    Payments: []
};

export const getPayments = createAsyncThunk("Payment/getAll", () => {
    return PaymentService.getAll();
});

export const PaymentSlice = createSlice({
    name: "Payment",
    initialState,
    reducers: {
        RESET_POSITION_VALUES(state) {
            state.error = false;
            state.success = false;
            state.message = "";
            state.performingAction = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPayments.pending, (state) => {
            state.loading = true;
            state.performingAction = true;
        });
        builder.addCase(getPayments.fulfilled, (state, action) => {
           
            state.loading = false;
            state.error = false;
            state.performingAction = false;
            state.Payments = action.payload.data?.lists;
        });
        builder.addCase(getPayments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.response?.data?.errors[0];
            state.performingAction = false;
            state.Payments = [];
        });
    }
});
export const { RESET_POSITION_VALUES } = PaymentSlice.actions;
export default PaymentSlice.reducer;
