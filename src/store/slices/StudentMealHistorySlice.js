import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import StudentMealHistoryService from "../../services/StudentMealHistoryService";

// Async thunk for fetching student meal history
export const fetchStudentMealHistory = createAsyncThunk(
  "studentMealHistory/fetchStudentMealHistory",
  async ({ universityId, startDate, endDate }) => {
    try {
      const data = await StudentMealHistoryService.getStudentMealHistory({ universityId, startDate, endDate });
      return data;
    } catch (error) {
      return { error: error.message };
    }
  }
);

const studentMealHistorySlice = createSlice({
  name: "studentMealHistory",
  initialState: {
    mealHistory: [],
    totalPaymentAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentMealHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentMealHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.mealHistory = action.payload.mealHistory;
        state.totalPaymentAmount = action.payload.totalPaymentAmount;
      })
      .addCase(fetchStudentMealHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export default studentMealHistorySlice.reducer;