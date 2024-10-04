import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MealService from "../../services/MealService";

export const initialState = {
    loading: false,
    error: "",
    performingAction: false,
    success: false,
    message: "",
    Meals: [],
};

export const searchMeals = createAsyncThunk("meal/search", async (data, { rejectWithValue }) => {
    try {
        const response = await MealService.searchEmployee(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getMeals = createAsyncThunk("meal/getAll", () => {
    return MealService.getAll();
    
});

export const addMeal = createAsyncThunk("Meal/add", async (data, { rejectWithValue }) => {
    try {
        const response = await MealService.addMeals(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});




export const updateMeal = createAsyncThunk("Meal/update", async (data, { rejectWithValue }) => {
    try {
        const response = await MealService.updateMeal(data); 
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteMeal = createAsyncThunk("meal/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await MealService.deleteMeal(id); 
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const MealSlice = createSlice({
    name: "meal",
    initialState,
    reducers: {
        RESET_POSITION_VALUES(state) {
            state.error = "";
            state.success = false;
            state.message = "";
            state.performingAction = false;
        }
    },
    extraReducers: (builder) => {


        builder.addCase(searchMeals.pending, (state) => {
            state.loading = true;
            state.performingAction = true;
        });
        builder.addCase(searchMeals.fulfilled, (state, action) => {
            state.loading = false;
            state.performingAction = false;
            state.meals = action.payload;
        });
        builder.addCase(searchMeals.rejected, (state, action) => {
            state.loading = false;
            state.performingAction = false;
            state.error = action.payload?.errors[0] || "Failed to search meals";
            state.meals = [];
        });

        

        
        builder.addCase(getMeals.pending, (state) => {
            state.loading = true;
            state.performingAction = true;
        });
        builder.addCase(getMeals.fulfilled, (state, action) => {
       
            state.loading = false;
            state.error = false;
            state.performingAction = false;
            state.Meals = action.payload.data?.lists;
        });
        builder.addCase(getMeals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.response?.data?.errors[0];
            state.performingAction = false;
            state.Meals = [];
        });



        builder.addCase(addMeal.pending, (state) => {
            state.performingAction = true;
            state.error = false;
        });
        builder.addCase(addMeal.fulfilled, (state, action) => {
            state.performingAction = false;
            state.error = false;
        });

        builder.addCase(addMeal.rejected, (state, action) => {
            state.error = true;
            state.message = action.payload?.response?.data?.errors[0];
            state.performingAction = false;
        });




        builder.addCase(updateMeal.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        
        builder.addCase(updateMeal.fulfilled, (state, action) => {
            state.performingAction = false;
            state.success = true;
            state.message = "Meal updated successfully";
            const updatedMeal = action.payload;
            const index = state.Meals.findIndex((meal) => meal.mealID === updatedMeal.mealID);
            if (index !== -1) {
                state.Meals[index] = updatedMeal;
            }
        });
        
        builder.addCase(updateMeal.rejected, (state, action) => {
            state.performingAction = false;
            state.error = action.payload?.errors[0] || "Failed to update meal";
            state.message = "Failed to update meal";
        });

        builder.addCase(deleteMeal.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        builder.addCase(deleteMeal.fulfilled, (state, action) => {
            state.performingAction = false;
            state.success = true;
        });
        
        builder.addCase(deleteMeal.rejected, (state, action) => {
            state.performingAction = false;
        });

        
    }
});
export const { RESET_POSITION_VALUES } = MealSlice.actions;
export default MealSlice.reducer;
