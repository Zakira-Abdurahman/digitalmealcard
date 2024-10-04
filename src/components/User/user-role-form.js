import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addStudent, getStudents, updateStudent } from "../../store/slices/Studentslice";
import { Toast } from "primereact/toast";
import { update } from "lodash";
import { Image } from "primereact/image";
import { addUser, assignRoleUser, searchUsers, updateUser } from "src/store/slices/UserSlice";

export default function UserRoleForm({ visible, setVisible, Passdata }) {
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [image, setImage] = useState();

    const {
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            userName: "",
            password: "",
            email: "",
            phoneNumber: ""
        }
    });

    console.log("pass", Passdata);
    useEffect(() => {
        if (Passdata) {
            setValue("userName", Passdata.userName);
            setValue("password", Passdata.password);
            setValue("email", Passdata.email);
            setValue("phoneNumber", Passdata.phoneNumber);
        }
    }, [Passdata]);
    console.log("pass", Passdata);
    const Submit = (data) => {
        if (Passdata) {
            dispatch(assignRoleUser({ ...data,userId:Passdata?.userId }))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "User Role Updated Successfully!"
                    });
                    dispatch(searchUsers(Passdata.userName));
                    setVisible(false);
                    reset();
                })
                .catch((error) => {
                    console.log("error", error);
                    toast.current.show({ severity: "error", summary: "Error", detail: error[0], life: 3000 });
                    setVisible(false);
                    reset();
                });
        } 
    };

    const userFormFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-raised"
                onClick={() => {
                    setVisible(false);
                    reset();
                }}
            />
            <Button label="Submit" icon="pi pi-check" className="p-button-raised" onClick={handleSubmit(Submit)} />
        </>
    );

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };
    const roles = [
        { name: "Admin", value: 1 },
        { name: "Manager", value: 2 },
        { name: "User", value: 3 }
    ];
    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                style={{ width: "30vw" }}
                header={"User Role"}
                onHide={() => {
                    setVisible(false);
                    reset();
                }}
                modal
                className="p-fluid"
                footer={userFormFooter}
            >
                <div className="flex flex-column gap-2">
                    <div className="p-field">
                        <label htmlFor="role">Role</label>
                        <Controller
                            name="role"
                            control={control}
                            rules={{ required: "Role is required." }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    className={classNames({ "p-invalid": errors.role })}
                                   options={roles}
                                   optionLabel="name"
                                   optionValue="name"

                                />
                            )}
                        />
                        {getFormErrorMessage("userName")}
                    </div>

                  
                </div>
            </Dialog>
        </>
    );
}
