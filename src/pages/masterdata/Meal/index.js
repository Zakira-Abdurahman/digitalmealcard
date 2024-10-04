import { useSession } from "next-auth/react";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MealForm from "../../../components/meal/meal-form";
import { getMeals } from "src/store/slices/MealSlice";

import DeleteDialog from "src/components/common/delete";
import { Image } from "primereact/image";
import { deleteMeal } from "src/store/slices/MealSlice";

export default function index() {
    const dispatch = useDispatch();
    const menu = useRef(null);
    const toast = useRef(null);

    const { data: session } = useSession();

    const [addnewDialog, setAddNewDialog] = useState(false);
    const [visible, setVisible] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [changeStatusD, setChangeStatusD] = useState(false);
    const [updateDialog, setUpdateDialog] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [meal, setMeals] = useState();

    const [positionStatus, setPositionStatus] = useState();
    const mealState = useSelector((state) => state.meal);

    const deleteMealFn = async () => {
        dispatch(deleteMeal(meal?.mealID))
            .unwrap()
            .then(() => {
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Meal deleted Successfully!"
            });
            setDeleteDialog(false);
            dispatch(getMeals());
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
                        console.log("row", rowData);
                        setMeals(rowData);
                    }}
                />
            </div>
        );
    };

    const AddNewBtn = () => {
        return (
            <div className="flex justify-content-between">
                <Button
                    type="button"
                    icon="pi pi-user-plus"
                    className="p-button-success"
                    label={"New"}
                    onClick={() => {
                        setVisible(true);
                        setMeals(null);
                    }}
                />
            </div>
        );
    };
  
    const SearchBtns = () => {
        return (
            <div className="flex justify-content-between gap-4">
                <InputText
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={"Search Meal"}
                />
                <Button
                    icon="pi pi-search"
                    label={"search Meal"}
                    disabled={searchInput ? false : true}
                   
                />
                <Button
                    icon="pi pi-refresh"
                    label={"clear"}
                    onClick={() => {
                        setSearchInput("");
                        dispatch(getMeals());
                    }}
                />
            </div>
        );
    };
   

    useEffect(() => {
        dispatch(getMeals());
    }, []);

    const MealTypes = [
        { name: "Breakfast", value: 1 },
        { name: "Lunch", value: 2 },
        { name: "Dinner", value: 3 }
    ];

    const mealTypeFilter = (rowData) => {
        const status = MealTypes.find((type) => type.value === rowData?.mealType);

        return status ? status.name : "Unknown";
    };

    const imageBody = (rowData) => {
        return <Image src={`data:image/jpeg;base64,${rowData?.image}`} alt="Image" width="70" preview />;
    };

    console.log("visi", visible);
    return (
        <div className="grid">
            <Toast ref={toast} />
            {items.at(0).items.length > 0 ? <Menu popup model={items} ref={menu} /> : null}
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" left={AddNewBtn} right={SearchBtns} />
                    <DataTable
                        value={mealState?.Meals}
                        tableStyle={{ minWidth: "50rem" }}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        loading={mealState?.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        emptyMessage="No meals Found!"
                        currentPageReportTemplate="List of meals"
                    >
                        <Column header="Image" body={imageBody}></Column>
                        <Column field="mealName" header="Meal Name"></Column>
                        <Column field="mealType" header="Meal Type" body={mealTypeFilter}></Column>
                        <Column field="price" header="price"></Column>

                        {items.at(0).items.length > 0 ? (
                            <Column
                                body={actionBodyTemplate}
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ minWidth: "10rem" }}
                            ></Column>
                        ) : null}
                    </DataTable>
                </div>

                <MealForm
                    visible={visible}
                    setVisible={setVisible}
                    type={addnewDialog}
                    passData={meal}
                />
            </div>

            <DeleteDialog
                data={meal}
                name={"meals"}
                visible={deleteDialog}
                setVisible={setDeleteDialog}
                performingAction={mealState?.performingAction}
                callbackFn={deleteMealFn}
            />
        </div>
    );
}
