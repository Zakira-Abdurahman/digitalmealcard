import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPayments, searchPayment } from "src/store/slices/PaymentSlice";

export default function index() {
    const dispatch = useDispatch();

    const { data: session } = useSession();

    const { t: translateCommon } = useTranslation("common");
    const { t: translateRoute } = useTranslation("routes");

    const [searchInput, setSearchInput] = useState("");
    const [positions, setPositions] = useState();
    const PaymentState = useSelector((state) => state.Payment);

    const SearchBtns = () => {
        return (
            <div className="flex justify-content-between gap-4">
                <InputText
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={translateCommon("Search Payment")}
                />
                <Button
                    icon="pi pi-search"
                    label={translateCommon("Search", { type: translateRoute("Payment") })}
                    disabled={searchInput ? false : true}
                    onClick={() => dispatch(searchPayment(searchInput))}
                />
                <Button
                    icon="pi pi-refresh"
                    label={translateCommon("clear")}
                    onClick={() => {
                        setSearchInput("");
                        dispatch(getPayments());
                    }}
                />
            </div>
        );
    };

    useEffect(() => {
        dispatch(getPayments());
    }, []);
    const PaymentStatuses = [
        { name: "Pending", value: 1 },
        { name: "Paid", value: 2 }
    ];

    const PaymentStatusFilter = (rowData) => {
        const status = PaymentStatuses.find((type) => type.value === rowData?.paymentStatus);
        return status ? status.name : "Unknown";
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" right={SearchBtns} />
                    <DataTable
                        value={PaymentState?.Payments}
                        tableStyle={{ minWidth: "50rem" }}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        loading={PaymentState?.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        emptyMessage="No Payment"
                        currentPageReportTemplate="Payment"
                    >
                        <Column field="transactionID" header="TransactionID"></Column>
                        <Column field="paymentAmount" header="Payment Amount"></Column>
                        <Column field="paymentStatus" header="Payment Status" body={PaymentStatusFilter}></Column>
                        <Column field="paymentDate" header="Payment Date"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

