import { combineReducers } from "redux";
import  student from "./slices/Studentslice";
import meal from "./slices/MealSlice";
import Transaction from "./slices/TransactionSlice";
import Payment from "./slices/PaymentSlice";
import StudentMealHistory from "./slices/StudentMealHistorySlice";
import user from "./slices/UserSlice";

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducers = combineReducers({
       student:student,
       meal:meal,
       Transaction:Transaction,
       Payment:Payment,
       StudentMealHistory:StudentMealHistory,
       user:user
    });

    return combinedReducers(state, action);
};

export default rootReducer;
