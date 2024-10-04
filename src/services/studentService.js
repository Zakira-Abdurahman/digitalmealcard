
import axios from "axios";

import service from "./common/FetchInterceptor";

const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_API_SERVICE_BASE_URL;

const StudentService = {};





StudentService.updateStudent = function (data) {
  
    return service({
        url: `https://localhost:7137/api/Student/${data?.studentID}`,
        method: "put",
        data: data,
    });
};

StudentService.deleteStudent = function (id) {
  
    return service({
        url: `https://localhost:7137/api/Student/${id}`,
        method: "delete",
    });
};


StudentService.getAll = function (params) {
   
    return service({
        url: "https://localhost:7137/api/Student",
        method: "get",
    });
};

StudentService.addStudents = function (data) {
    console.log("api",data)
    return service({
        url: "https://localhost:7137/api/Student",
        method: "post",
        data: data,
    });
};
StudentService.getStudentDetail = function (universityId) {
    return service({
        url: `https://localhost:7137/api/Student/${universityId}`,
        method: "get",
    });
};





export default StudentService;
