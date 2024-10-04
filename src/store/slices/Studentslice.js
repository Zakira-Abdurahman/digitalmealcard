import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import StudentService from "../../services/studentService";

export const initialState = {
    loading: false,
    error: "",
    performingAction: false,
    success: false,
    message: "",
    students: [],
};

export const searchStudents = createAsyncThunk("student/search", async (data, { rejectWithValue }) => {
    try {
        const response = await StudentService.searchEmployee(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getStudents = createAsyncThunk("student/getAll", async () => {
    const response = await StudentService.getAll();
    return response.data;
});

export const getStudentPhoto = createAsyncThunk("student/photo", async (universityId) => {
    
    const response = await StudentService.getStudentDetail(universityId);
    return response.data;
});

export const addStudent = createAsyncThunk("student/add", async (data, { rejectWithValue }) => {
    try {
        const response = await StudentService.addStudents(data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateStudent = createAsyncThunk("student/update", async (data, { rejectWithValue }) => {
    try {
        const response = await StudentService.updateStudent(data); 
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
export const deleteStudent = createAsyncThunk("student/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await StudentService.deleteStudent(id); 
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Slice
export const studentSlice = createSlice({
    name: "student",
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




builder.addCase(searchStudents.pending, (state) => {
    state.loading = true;
    state.performingAction = true;
});
builder.addCase(searchStudents.fulfilled, (state, action) => {
    state.loading = false;
    state.performingAction = false;
    state.students = action.payload;
});
builder.addCase(searchStudents.rejected, (state, action) => {
    state.loading = false;
    state.performingAction = false;
    state.error = action.payload?.errors[0] || "Failed to search students";
    state.students = [];
});

        builder.addCase(getStudents.pending, (state) => {
            state.loading = true;
            state.performingAction = true;
        });
        builder.addCase(getStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.performingAction = false;
            state.students = action.payload;
        });
        builder.addCase(getStudents.rejected, (state, action) => {
            state.loading = false;
            state.performingAction = false;
            state.error = action.payload?.errors[0] || "Failed to fetch students";
            state.students = [];
        });

        builder.addCase(addStudent.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        builder.addCase(addStudent.fulfilled, (state) => {
            state.performingAction = false;
            state.success = true;
            state.message = "Student added successfully";
        });
        builder.addCase(addStudent.rejected, (state, action) => {
            state.performingAction = false;
            state.error = action.payload?.errors[0] || "Failed to add student";
            state.message = "Failed to add student";
        });

        builder.addCase(updateStudent.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        builder.addCase(updateStudent.fulfilled, (state, action) => {
            state.performingAction = false;
            state.success = true;
            state.message = "Student updated successfully";
            state.students = state.students.map((student) =>
                student.universityId === action.payload.universityId
                    ? { ...student, ...action.payload }
                    : student
            );
        });


        
        builder.addCase(updateStudent.rejected, (state, action) => {
            state.performingAction = false;
            state.error = action.payload?.errors[0] || "Failed to update student";
            state.message = "Failed to update student";
        });



        
        builder.addCase(deleteStudent.pending, (state) => {
            state.performingAction = true;
            state.error = "";
        });
        builder.addCase(deleteStudent.fulfilled, (state, action) => {
            state.performingAction = false;
            state.success = true;
        });
        
        builder.addCase(deleteStudent.rejected, (state, action) => {
            state.performingAction = false;
        });
    }
});

// Export actions and reducer
export const { RESET_POSITION_VALUES } = studentSlice.actions;
export default studentSlice.reducer;
