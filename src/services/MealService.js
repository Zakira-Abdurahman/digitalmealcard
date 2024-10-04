
import axios from "axios";
import service from "./common/FetchInterceptor";

const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_API_SERVICE_BASE_URL;

const MealService = {};





MealService.updateMeal = function (data) {
    return service({
        url: `https://localhost:7137/api/Meal/${data.mealID}`,
        method: "put",
        data: data,
    });
};



MealService.getAll = function (params) {
    return service({
        url: "https://localhost:7137/api/Meal",
        method: "get",
    });
};

MealService.addMeals = function (data) {
    console.log("api",data)
    return service({
        url: "https://localhost:7137/api/Meal",
        method: "post",
        data: data,
    });
};

MealService.updateEmployee = function (data, id) {
    return fetch({
        url: localStorage.getItem("baseUrl") + "employee-service/api/v1/Employee/Update/" + id,
        method: "put",
        data: data,
        headers: {
            "Content-Type": "multipart/form-data",
            ClientClaim: EMPLOYEE_UPDATE
        }
    });
};
MealService.deleteMeal = function (id) {
    return service({
        url: `https://localhost:7137/api/Meal/${id}`,
        method: "delete",
    });
};



export default  MealService;
