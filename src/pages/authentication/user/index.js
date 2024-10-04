import { useSession } from "next-auth/react";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, RESET_USER_VALUE, revokeRoleUser, searchUsers } from "src/store/slices/UserSlice";
import UserForm from "../../../components/User/user-form";


import UserRoleForm from "src/components/User/user-role-form";
import DeleteDialog from "src/components/common/delete";

import { deleteUser } from "src/store/slices/UserSlice";
import RevokeDialog from "src/components/common/revoke-role";

export default function index() {
    const dispatch = useDispatch();
    const menu = useRef(null);
    const toast = useRef(null);

    const { data: session } = useSession();

    const [addnewDialog, setAddNewDialog] = useState(false);
    const [visible, setVisible] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [roleForm, setRoleForm] = useState(false);
    const [revokeForm,setRevokeForm]=useState(false)
    const [searchInput, setSearchInput] = useState("");
    const [user, setUsers] = useState();

    const [positionStatus, setPositionStatus] = useState();
    const UserState = useSelector((state) => state.user);

    const deleteUserFn = async () => {
        dispatch(deleteUser(user?.userName))
            .unwrap()
            .then(() => {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "User deleted Successfully!"
                });
                setDeleteDialog(false);
                dispatch(getUsers());
            });
    };

    const revokeUserRoleFn = async () => {
        const role=roles.find((role)=>role.value===user.role)
        dispatch(revokeRoleUser({userId:user.userId,roleName:role.name}))
            .unwrap()
            .then(() => {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "User Role Revoked Successfully!"
                });
                setRevokeForm(false);
                dispatch(searchUsers(user.userName))
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
                    icon: "pi pi-trash",
                    command: () => {
                        setDeleteDialog(true);
                    }
                },
                {
                    label: "Assign-role",
                    icon: "pi pi-user-plus",
                    command: () => {
                        setRoleForm(true);
                    }
                },
                {
                    label: "Revoke-role",
                    icon: "pi pi-user-minus",
                    command: () => {
                        setRevokeForm(true);
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
                       
                        setUsers(rowData);
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
                    label={"Register"}
                    onClick={() => {
                        setVisible(true);
                        setUsers(null);
                    }}
                />
            </div>
        );
    };
    const SearchUserFn = (data) => {
        dispatch(searchUsers(data));
        setSearchInput("");
    };
    const SearchBtns = () => {
        return (
            <div className="flex justify-content-between gap-4">
                <InputText
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={"Search User"}
                />
                <Button
                    icon="pi pi-search"
                    label={"search User"}
                    disabled={searchInput ? false : true}
                    onClick={() => SearchUserFn(searchInput)}
                />
                <Button
                    icon="pi pi-refresh"
                    label={"clear"}
                    onClick={() => {
                        setSearchInput("");
                        dispatch(RESET_USER_VALUE());
                    }}
                />
            </div>
        );
    };
    const addPositionFn = async (data) => {
        dispatch(addPosition(data));
    };

    const assignRole = async (data) => {
        dispatch(addPosition(data));
    };
    const roles = [
        { name: "Admin", value: 1 },
        { name: "Manager", value: 2 },
        { name: "User", value: 3 },
        { name: "NoRoleAssigned", value: 4 }
    ];

    const roleFilter = (rowData) => {
        const status = roles.find((type) => type.value === rowData?.role);

        return status ? status.name : "Unknown";
    };

    console.log("visi", UserState);

    return (
        <div className="grid">
            <Toast ref={toast} />
            {items && items.length > 0 ? <Menu popup model={items} ref={menu} /> : null}
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" left={AddNewBtn} right={SearchBtns} />
                    <DataTable
                        value={UserState?.users}
                        tableStyle={{ minWidth: "50rem" }}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        loading={UserState && UserState.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        emptyMessage="No Users Found!"
                        currentPageReportTemplate="List of Users"
                    >
                        <Column field="userName" header="User Name"></Column>
                        <Column field="phoneNumber" header="Phone Number"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="role" header="Role" body={roleFilter}></Column>

                        {items.at(0).items.length > 0 ? (
                            <Column
                                body={actionBodyTemplate}
                                style={{ minWidth: "10rem" }}
                                headerStyle={{ minWidth: "10rem" }}
                            ></Column>
                        ) : null}
                    </DataTable>
                </div>
                <UserRoleForm visible={roleForm} setVisible={setRoleForm}  Passdata={user} />
                <UserForm
                    visible={visible}
                    setVisible={setVisible}
                    type={addnewDialog}
                    Passdata={user}
                />
            </div>
            <DeleteDialog
                data={user}
                name={"users"}
                visible={deleteDialog}
                setVisible={setDeleteDialog}
                performingAction={UserState?.performingAction}
                callbackFn={deleteUserFn}
            />
            <RevokeDialog visible={revokeForm} setVisible={setRevokeForm} callbackFn={revokeUserRoleFn}/>
        </div>
    );
}
