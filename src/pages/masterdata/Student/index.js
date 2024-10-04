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
import StudentForm from "../../../components/student/student-form";

import { addStudent, deleteStudent, getStudents } from "src/store/slices/Studentslice";
import DeleteDialog from "src/components/common/delete";
import { Image } from "primereact/image";



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
    const [student, setStudents] = useState();

    const [positionStatus, setPositionStatus] = useState();
    const studentState = useSelector((state) => state.student);

    const deletePositionFn = async () => {
        debugger
        dispatch(deleteStudent(student?.studentID))
            .unwrap()
            .then(() => {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Student deleted Successfully!"
                });
                setDeleteDialog(false);
                dispatch(getStudents());
            }).catch((err)=>{
             console.log("err",err)
            }
            );
    };


    const changeStatusFn = async (status) => {
        setPositionStatus(status);
        let payload = {
            status: status,
            id: positions?.id
        };
        dispatch(RESET_POSITION_VALUES());
        dispatch(changePositionStatus(payload))
            .unwrap()
            .then(() => {
                setChangeStatusD(false);
            });
    };

    const items = [
        {
            items: [
                {
                    label: "Edit",
                    icon: "pi pi-pencil",
                    command: () => {
                        setVisible(true)
                    }
                },

                {
                    label: "Delete",
                    icon: "pi pi-times",
                    command: () => {
                        setDeleteDialog(true);
                    }
                },
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
                        setStudents(rowData);
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
                    onClick={() => setVisible(true)}
                />
            </div>
        );
    };
    const SearchStudentFn = (data) => {
        dispatch(SearchStudent(data));
        setSearchInput("");
    };
    const SearchBtns = () => {
        return (
            <div className="flex justify-content-between gap-4">
                <InputText
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={"Search Student"}
                />
                <Button
                    icon="pi pi-search"
                    label={"search Student"}
                    disabled={searchInput ? false : true}
                    onClick={() => SearchStudentFn(searchInput)}
                />
                <Button
                    icon="pi pi-refresh"
                    label={"clear"}
                    onClick={() => {
                        setSearchInput("");
                        dispatch(getStudents());
                    }}
                />
            </div>
        );
    };
    const addPositionFn = async (data) => {
        dispatch(addStudent(data));
    };

    useEffect(() => {
        dispatch(getStudents());
    }, []);

    const GraduationStatuses = [
        { name: "NotGraduated", value: 1 },
        { name: "Graduated", value: 2 }
    ];

    const GraduationStatusFilter = (rowData) => {
        const status = GraduationStatuses.find((type) => type.value === rowData?.graduationStatus);
        return status ? status.name : "Unknown";
    };

    const PaymentStatuses = [
        { name: "Pending", value: 1 },
        { name: "Paid", value: 2 }
    ];

    const PaymentStatusFilter = (rowData) => {
        const status = PaymentStatuses.find((type) => type.value === rowData?.paymentStatus);
        return status ? status.name : "Unknown";
    };

    const DocumentStatuses = [
        { name: "Pending", value: 1 },
        { name: "Temporary", value: 2 },
        { name: "Original", value: 3 }
    ];

    const DocumentStatusFilter = (rowData) => {
        const status = DocumentStatuses.find((type) => type.value === rowData?.documentStatus);
        return status ? status.name : "Unknown";
    };

    const RecordStatuses = [
        { name: "Active", value: 1 },
        { name: "Inactive", value: 2 },
        { name: "Deleted", value: 3 }
    ];

    const RecordStatusFilter = (rowData) => {
        const status = RecordStatuses.find((type) => type.value === rowData?.recordStatus);
        return status ? status.name : "Unknown";
    };
    
    const imageBody=(rowData)=>{
        // className="border-circle" 
    return  <Image src={`data:image/jpeg;base64,${rowData?.studentPhoto}`} alt="student Photo"  height="80" width="80" preview/>
    
    }

    
    console.log("visi", visible);
    return (
        <div className="grid">
            <Toast ref={toast} />
            {items.at(0).items.length > 0 ? <Menu popup model={items} ref={menu} /> : null}
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" left={AddNewBtn} right={SearchBtns} />
                    <DataTable
                        value={studentState?.students}
                        tableStyle={{ minWidth: "50rem" }}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        loading={studentState?.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        emptyMessage="No Students Found!"
                        currentPageReportTemplate="List of students"
                    >
                        <Column  header="Student Photo" body={imageBody}></Column>
                        <Column field="firstName" header="First Name"></Column>
                        <Column field="middleName" header="Middle Name"></Column>
                        <Column field="lastName" header="Last Name"></Column>
                        <Column field="universityID" header="University ID"></Column>
                     
                        <Column field="email" header="Email"></Column>
                        <Column field="phone" header="Phone"></Column>
                        <Column field="isCafeStudent" header="Is Cafe Student"></Column>
                        <Column
                            field="graduationStatus"
                            header="GraduationStatus"
                            body={GraduationStatusFilter}
                        ></Column>
                        <Column field="paymentStatus" header="Payment Status" body={PaymentStatusFilter}></Column>
                        <Column field="documentStatus" header="Document Status" body={DocumentStatusFilter}></Column>
                        {/* <Column field="recordStatus" header="Record Status" body={RecordStatusFilter}></Column> */}

                        {items.at(0).items.length > 0 ? (
                            <Column
                                body={actionBodyTemplate}
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ minWidth: "10rem" }}
                            ></Column>
                        ) : null}
                    </DataTable>
                </div>

                 <StudentForm
                    visible={visible}
                    setVisible={setVisible}
                    type={addnewDialog}
                    callBackFun={addPositionFn}
                    Passdata={student}
                />
            </div>


            

            <DeleteDialog
                data={student}
                name={"students"}
                visible={deleteDialog}
                setVisible={setDeleteDialog}
                performingAction={studentState?.performingAction}
                callbackFn={deletePositionFn}
            />
          
        </div>
    );
}
