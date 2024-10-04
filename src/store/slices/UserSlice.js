import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "../../services/UserService";

export const initialState = {
    loading: false,
    error: "",
    performingAction: false,
    success: false,
    message: "",
    users: [],
};

export const searchUsers = createAsyncThunk("user/search", async (data, { rejectWithValue }) => {
    try {
        const response = await UserService.searchUsers(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getUsers = createAsyncThunk("user/getAll", async () => {
    return UserService.getAll();
    
});



export const addUser = createAsyncThunk("user/add", async (data, { rejectWithValue }) => {
    try {
        const response = await UserService.addUsers(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateUser = createAsyncThunk("user/update", async (data, { rejectWithValue }) => {
    try {
        const response = await UserService.updateUser(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const assignRoleUser = createAsyncThunk("user/role", async (data, { rejectWithValue }) => {
    try {
        const response = await UserService.assignRoleUser(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const deleteUser = createAsyncThunk("user/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await UserService.deleteUser(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const revokeRoleUser = createAsyncThunk("user/delete", async (data, { rejectWithValue }) => {
    try {
        const response = await UserService.revokeRoleUser(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
// Slice
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
    RESET_USER_VALUE(state) {
            state.error = "";
            state.success = false;
            state.message = "";
            state.performingAction = false;
            state.users=[]
        }
    },
    extraReducers: (builder) => {
        builder.addCase(searchUsers.pending, (state) => {
            state.loading = true;
            state.performingAction = true;
        });
        
        builder.addCase(searchUsers.fulfilled, (state, action) => {
      
            state.loading = false;
            state.performingAction = false;
            state.users = [action.payload]; 
        });
        
        builder.addCase(searchUsers.rejected, (state, action) => {
       
            state.loading = false;
            state.performingAction = false;
          
            state.users = [];
        });

        builder.addCase(getUsers.pending, (state) => {
            state.loading = true;
            state.performingAction = true;
        });
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.performingAction = false;
            state.users = action.payload.data?.lists;
        });
        builder.addCase(getUsers.rejected, (state, action) => {
            state.loading = false;
            state.performingAction = false;
            state.error = action.payload?.errors[0] || "Failed to fetch users";
            state.users = [];
        });

        builder.addCase(addUser.pending, (state) => {
            state.performingAction = true;
            state.error = false;
        });
        builder.addCase(addUser.fulfilled, (state) => {
            state.performingAction = false;
            state.error = false;
        });
        builder.addCase(addUser.rejected, (state, action) => {
            state.error = true;
            state.message = action.payload?.response?.data?.errors[0];
            state.performingAction = false;
        });

        builder.addCase(updateUser.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.performingAction = false;
            state.success = true;
            state.message = "User updated successfully";
        
        });

        builder.addCase(updateUser.rejected, (state, action) => {
            state.performingAction = false;
      
            state.message = "Failed to update user";
        });

        builder.addCase(deleteUser.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.performingAction = false;
            state.success = true;
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.performingAction = false;
        });
    }
});

export const { RESET_USER_VALUE } = userSlice.actions;
export default userSlice.reducer;
