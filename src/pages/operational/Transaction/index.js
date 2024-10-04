import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteDialog from "src/components/common/delete";
import TransactionPage from "src/components/Transaction/Transaction-form";
import { deleteTransaction, getTransactions } from "src/store/slices/TransactionSlice";

import TransactionFormUpdate from "src/components/Transaction/Transaction-form-update";


export default function index() {
    const dispatch = useDispatch();
    const menu = useRef(null);
    const toast = useRef(null);

    const { data: session } = useSession();


 
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [positions, setPositions] = useState();
    const [transaction,setTransactions]=useState()
    const [positionStatus, setPositionStatus] = useState();
    const TransactionState = useSelector((state) => state.Transaction);
    const [visible,setVisible]=useState(false)
    const deleteTransactionFn = async () => {
        dispatch(deleteTransaction(transaction?.transactionID))
        .unwrap()
        .then(() => {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Transaction deleted Successfully!"
        });
        setDeleteDialog(false);
        dispatch(getTransactions());
        });
};
   
    const items = [
        {
            items: [
                {
                    label: "Edit",
                    icon: "pi pi-pencil",
                    command: () => {
                        setVisible(true);
                    }
                },

                {
                    label: "Delete",
                    icon: "pi pi-times",
                    command: () => {
                        setDeleteDialog(true);
                    }
                }
            ].filter(Boolean)
        }
    ];


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex">
                <Button
                    icon="pi pi-ellipsis-v"
                    text
                    onClick={(e) => {
                        menu.current.toggle(e);
                        setTransactions(rowData);
                    }}
                />
            </div>
        );
    };

  
    const SearchTransactionFn = (data) => {
        // dispatch(SearchTransaction(data));
        setSearchInput("");
    };
    const SearchBtns = () => {
        return (
            <div className="flex justify-content-between gap-4">
                <InputText
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={translateCommon("Search Transaction")}
                />
                <Button
                    icon="pi pi-search"
                    label={translateCommon("Search", { type: translateRoute("Transaction") })}
                    disabled={searchInput ? false : true}
                    onClick={() => SearchTransactionFn(searchInput)}
                />
                <Button
                    icon="pi pi-refresh"
                    label={translateCommon("clear")}
                    onClick={() => {
                        setSearchInput("");
                       
                    }}
                />
            </div>
        );
    };
  
    
    useEffect(() => {
        dispatch(getTransactions());
    }, []);


    const  MealTypes = [
        { name: "Breakfast", value: 1 },
        { name: "Lunch", value: 2 },
        { name: "Dinner", value: 3 }
        
    ];

    const mealTypeFilter = (rowData) => {
        const status = MealTypes.find((type) => type.value === rowData?.mealType); 

        return status ? status.name : "Unknown";
    };




    const RecordStatuses = [
        { name: "Active", value: 1 },
        { name: "Inactive", value: 2 },
        { name: "Deleted", value: 3 },
    ];
    const RecordStatusFilter = (rowData) => {
        const status = RecordStatuses.find(type => type.value === rowData?.recordStatus);
        if (!status) return "Unknown";
    
        return (
            <span 
                style={{
                    color: status.value === 1 ? 'white' : 'black', 
                    backgroundColor: status.value === 1 ? 'green' : 'transparent',
                    fontWeight: 'bold',
                    padding: '0.2em 0.5em',
                    borderRadius: '4px' // Optional for rounded corners
                }}
            >
                {status.name}
            </span>
        );
    };
    
      const MealStatuss = [
        { name: "NotTaken", value: 1 },
        { name: "Taken", value: 2 },
       
    ];
    const MealStatusFilter = (rowData) => {
        const status = MealStatuss.find(type => type.value === rowData?.mealStatus);
        return status ? status.name : "Unknown";
    };    
    return (
        <div className="grid">
            <Toast ref={toast} />
            <TransactionPage/>
            {items.at(0).items.length > 0 ? <Menu popup model={items} ref={menu} /> : null}
            <div className="col-12">
                <div className="card">
                    {/* <Toolbar className="mb-4" left={AddNewBtn} right={SearchBtns} /> */}
                    <DataTable
                        value={TransactionState?.Transactions}
                        tableStyle={{ minWidth: "50rem" }}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        loading={TransactionState?.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        emptyMessage="No Transaction"
                        currentPageReportTemplate="Transaction"                        
                    >
                        <Column field="fullName" header="Full Name"></Column>
                        <Column field="universityID" header="University ID"></Column>
                        <Column field="mealType" header="Meal Type" body={mealTypeFilter}></Column>
                        <Column field="mealStatus" header="Meal Status" body={MealStatusFilter} ></Column>
                        <Column field="transactionTime" header="Transaction Time"></Column>
                        <Column field="recordStatus" header="Record Status"body={RecordStatusFilter} ></Column>
                        {items.at(0).items.length > 0 ? (
                            <Column
                                body={actionBodyTemplate}
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ minWidth: "10rem" }}
                            ></Column>
                        ) : null}
                    </DataTable>
                </div>
            </div>



        
            <DeleteDialog
                data={transaction}
                name={"transactions"}
                visible={deleteDialog}
                setVisible={setDeleteDialog}
                performingAction={TransactionState?.performingAction}
                callbackFn={deleteTransactionFn}
            />
            {visible&&<TransactionFormUpdate visible={visible} setVisible={setVisible} passData={transaction}/>
            }
           
        </div>
    );
}

