import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import TransactionService from "src/services/TransactionService";

export const initialState = {
    loading: false,
    error: "",
    performingAction: false,
    success: false,
    message: "",
    Transactions: [],
};

export const getTransactions = createAsyncThunk("Transaction/getAll", () => {
    return TransactionService.getAll();
});



export const addTransaction = createAsyncThunk("Transaction/add", async (data, { rejectWithValue }) => {
    try {
        const response = await TransactionService.addTransactions(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});





export const updateTransaction = createAsyncThunk("Transaction/update", async (data, { rejectWithValue }) => {
    try {
        const response = await TransactionService.updateTransaction(data); 
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteTransaction = createAsyncThunk("Transaction/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await TransactionService.deleteTransaction(id); 
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});







export const TransactionSlice = createSlice({
    name: "Transaction",
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
        
        builder.addCase(getTransactions.pending, (state) => {
            state.loading = true;
            state.performingAction = true;
        });
        builder.addCase(getTransactions.fulfilled, (state, action) => {
            
            state.loading = false;
            state.error = false;
            state.performingAction = false;
            state.Transactions = action.payload.data?.lists;
        });
        builder.addCase(getTransactions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.response?.data?.errors[0];
            state.performingAction = false;
            state.Transactions = [];
        });



        builder.addCase(addTransaction.pending, (state) => {
            state.performingAction = true;
            state.error = false;
        });
        builder.addCase(addTransaction.fulfilled, (state, action) => {
            state.performingAction = false;
            state.error = false;
        });

        builder.addCase(addTransaction.rejected, (state, action) => {
            state.error = true;
            state.message = action.payload?.response?.data?.errors[0];
            state.performingAction = false;
        });


        builder.addCase(updateTransaction.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        
        builder.addCase(updateTransaction.fulfilled, (state, action) => {
            state.performingAction = false;
            state.success = true;
            state.message = "Transaction updated successfully";
          
        });
        
        builder.addCase(updateTransaction.rejected, (state, action) => {
            state.performingAction = false;
            state.error = action.payload?.errors[0] || "Failed to update Transaction";
            state.message = "Failed to update Transaction";
        });

        builder.addCase(deleteTransaction.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        builder.addCase(deleteTransaction.fulfilled, (state, action) => {
         
            state.performingAction = false;
            state.success = true;
        });
        
        builder.addCase(deleteTransaction.rejected, (state, action) => {
            state.performingAction = false;
        });









        
    }
});
export const { RESET_POSITION_VALUES } = TransactionSlice.actions;
export default TransactionSlice.reducer;
