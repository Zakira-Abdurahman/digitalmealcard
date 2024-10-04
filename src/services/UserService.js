import axios from "axios";

import service from "./common/FetchInterceptor";

const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_API_SERVICE_BASE_URL;

const UserService = {};

UserService.updateUser = function (data) {
    return service({
        url: `https://localhost:7137/api/Users/update-user-info`,
        method: "post",
        data: data
    });
};
UserService.assignRoleUser = function (data) {
    return service({
        url: `https://localhost:7137/api/Users/assign-role`,
        method: "post",
        data: data
    });
};
UserService.getAll = function (params) {
    return service({
        url: "https://localhost:7137/api/Users/info",
        method: "get"
    });
};

UserService.addUsers = function (data) {
    console.log("api", data);
    return service({
        url: "https://localhost:7137/api/Users/register",
        method: "post",
        data: data
    });
};

UserService.getUserDetail = function (userName) {
    return service({
        url: "https://localhost:7137/api/Users/info?userName=" + userName,
        method: "get"
    });
};

UserService.deleteUser = function (userName) {
    return service({
        url: `https://localhost:7137/api/Users/delete-user?username=` + userName,
        method: "delete"
    });
};

UserService.revokeRoleUser = function (data) {
    return service({
        url:
            `https://localhost:7137/api/Users/remove-role-from-user?userId=` +
            data.userId +
            "&roleName=" +
            data.roleName,
        method: "delete"
    });
};

UserService.searchUsers = function (userName) {
    return service({
        url: "https://localhost:7137/api/Users/info?userName=" + userName
    });
};

export default UserService;
