
import axios from "axios";

import service from "./common/FetchInterceptor";

const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_API_SERVICE_BASE_URL;

const TransactionService = {};


TransactionService.updateTransaction = function (data) {
    return service({
        url: `https://localhost:7137/api/Transaction/${data.transactionID}`,
        method: "put",
        data: data,
    });
};

TransactionService.getAll = function (params) {
    return service({
        url: "https://localhost:7137/api/Transaction",
        method: "get",
    });
};

TransactionService.addTransactions = function (data) {
    console.log("api",data)
    return service({
        url: "https://localhost:7137/api/Transaction/scan",
        method: "post",
        data: data,
    });
};





export default  TransactionService;
