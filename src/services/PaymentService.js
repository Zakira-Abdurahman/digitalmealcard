
import axios from "axios";

import service from "./common/FetchInterceptor";

const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_API_SERVICE_BASE_URL;

const PaymentService = {};

PaymentService.getAll = function () {
    return service({
        url: "https://localhost:7137/api/Payment",
        method: "get",
    });
};





export default PaymentService;
