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
import { addUser, searchUsers, updateUser } from "src/store/slices/UserSlice";
import { Password } from 'primereact/password';
export default function UserForm({ visible, setVisible, Passdata }) {
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
        else{
            reset({})
        }
    }, [Passdata]);
console.log("pass",Passdata)
    const Submit = (data) => {
   debugger
        if (Passdata) {
            dispatch(updateUser ({ ...data }))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "User edited Successfully!"
                    });
                    dispatch(searchUsers(Passdata.userName)
                
                
                );
                    setVisible(false);
                    reset();
                })
                .catch((error) => {
                    console.log("error", error);
                    toast.current.show({ severity: "error", summary: "Error", detail: "", life: 3000 });
                    setVisible(false);
                    reset();
                });
        } else {
            dispatch(addUser(data))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "User Added Successfully!"
                    });
                    // dispatch(getUsers());
                    setVisible(false);
                    reset();
                })
                .catch((error) => {
                    console.log("error", error);
                    toast.current.show({ severity: "error", summary: "Error", detail: "", life: 3000 });
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

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                style={{ width: "50vw" }}
                header={"User"}
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
                        <label htmlFor="userName">User Name</label>
                        <Controller
                            name="userName"
                            control={control}
                            rules={{ required: "User name is required." }}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.userName })}/>
                            )}
                        />
                        {getFormErrorMessage("userName")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required.",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Invalid email address"
                                }
                            }}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.email })} />
                            )}
                        />

                        {getFormErrorMessage("email")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            rules={{
                                required: "Phone number is required.",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Invalid phone number, must be 10 digits."
                                }
                            }}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.phoneNumber })} />
                            )}
                        />
                        {getFormErrorMessage("phoneNumber")}
                    </div>

                    {!Passdata&&<div className="p-field">
                        <label htmlFor="password">Password</label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Password {...field} className={classNames({ "p-invalid": errors.phoneNumber })} toggleMask />
                            )}
                        />
                        {getFormErrorMessage("phoneNumber")}
                    </div>}
                </div>
            </Dialog>
        </>
    );
}
