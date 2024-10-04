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

export default function StudentForm({ visible, setVisible, Passdata }) {
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [image, setImage] = useState();

    const {
        handleSubmit,
        reset,
        control,
        setValue,
        formState: { errors }
    } = useForm({});

    console.log("pass", Passdata);
    useEffect(() => {
        if (Passdata?.studentID) {
            setValue("firstName", Passdata?.firstName);
            setValue("middleName", Passdata?.middleName);
            setValue("lastName", Passdata?.lastName);
            setValue("email", Passdata?.email);
            setValue("phone", Passdata?.phone);
            setValue("universityID", Passdata?.universityID);
            setValue("graduationStatus", Passdata?.graduationStatus);
            setValue("paymentStatus", Passdata?.paymentStatus);
            setValue("documentStatus", Passdata?.documentStatus);
            setValue("recordStatus", Passdata?.recordStatus);
            setValue("isCafeStudent", Passdata?.isCafeStudent);
        }
        if (Passdata?.studentPhoto) {
            setValue("studentPhoto", file);
            const file = new File([base64ToArrayBuffer(Passdata?.studentPhoto)], "student-photo.jpg", {
                type: "image/jpeg"
            });
            setImage(file);
        }
    }, [Passdata]);
    const Submit = (data) => {
        const payload = { ...data, isCafeStudent: data?.isCafeStudent ?? false };
        if (Passdata?.studentID) {
            dispatch(updateStudent({ ...payload, studentID: Passdata?.studentID }))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Student edited Successfully!"
                    });
                    dispatch(getStudents());
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
            dispatch(addStudent(payload))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Student Added Successfully!"
                    });
                    dispatch(getStudents());
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

    const studentFormFooter = (
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

    const graduationStatusOptions = [
        { label: "Not Graduated", value: 1 },
        { label: "Graduated", value: 2 }
    ];

    const paymentStatusOptions = [
        { label: "pending", value: 1 },
        { label: "Paid", value: 2 }
    ];

    const documentStatusOptions = [
        { label: "Pending", value: 1 },
        { label: "Tempoarary", value: 2 },
        { label: "Original", value: 3 }
    ];

    const recordStatusOptions = [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 2 }
    ];

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    const onFileSelect = (event) => {
        const file = event.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(",")[1]; // Extract base64 string
            setValue("studentPhoto", base64String); // Automatically set base64 string in form data
        };
        reader.readAsDataURL(file);
    };
    const base64ToArrayBuffer = (base64) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };
    console.log("image", image);
    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                style={{ width: "50vw" }}
                header={"Student"}
                onHide={() => {
                    setVisible(false);
                    reset();
                }}
                modal
                className="p-fluid"
                footer={studentFormFooter}
            >
                <div className="flex flex-column gap-2">
                    <div className="p-field">
                        <div className="flex justify-content-center rounded">
                            <Image
                                src={`data:image/jpeg;base64,${Passdata?.studentPhoto}`}
                                alt="Student Photo"
                                width="150"
                            />
                        </div>
                        <Controller
                            name="studentPhoto"
                            control={control}
                            rules={{ required: "Student photo is required." }}
                            render={() => (
                                <FileUpload
                                    name="studentPhoto"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    customUpload
                                    auto
                                    onSelect={onFileSelect}
                                    chooseLabel="Choose"
                                />
                            )}
                        />
                        {getFormErrorMessage("studentPhoto")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="firstName">First Name</label>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: "First name is required." }}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.firstName })} />
                            )}
                        />
                        {getFormErrorMessage("firstName")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="middleName">Middle Name</label>
                        <Controller
                            name="middleName"
                            control={control}
                            rules={{ required: "Middle name is required." }}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.middleName })} />
                            )}
                        />
                        {getFormErrorMessage("middleName")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="lastName">Last Name</label>
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{ required: "Last name is required." }}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.lastName })} />
                            )}
                        />
                        {getFormErrorMessage("lastName")}
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
                        <label htmlFor="phone">Phone</label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: "Phone number is required.",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Invalid phone number, must be 10 digits."
                                }
                            }}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.phone })} />
                            )}
                        />
                        {getFormErrorMessage("phone")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="universityID">University ID</label>
                        <Controller
                            name="universityID"
                            control={control}
                            rules={{ required: "University ID is required." }}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.universityID })} />
                            )}
                        />
                        {getFormErrorMessage("universityID")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="graduationStatus">Graduation Status</label>
                        <Controller
                            name="graduationStatus"
                            control={control}
                            rules={{ required: "Graduation status is required." }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={graduationStatusOptions}
                                    className={classNames({ "p-invalid": errors.graduationStatus })}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {getFormErrorMessage("graduationStatus")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="paymentStatus">Payment Status</label>
                        <Controller
                            name="paymentStatus"
                            control={control}
                            rules={{ required: "Payment status is required." }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={paymentStatusOptions}
                                    className={classNames({ "p-invalid": errors.paymentStatus })}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {getFormErrorMessage("paymentStatus")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="documentStatus">Document Status</label>
                        <Controller
                            name="documentStatus"
                            control={control}
                            rules={{ required: "Document status is required." }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={documentStatusOptions}
                                    className={classNames({ "p-invalid": errors.documentStatus })}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {getFormErrorMessage("documentStatus")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="recordStatus">Record Status</label>
                        <Controller
                            name="recordStatus"
                            control={control}
                            rules={{ required: "Record status is required." }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={recordStatusOptions}
                                    className={classNames({ "p-invalid": errors.recordStatus })}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {getFormErrorMessage("recordStatus")}
                    </div>

                    <div className="p-field-checkbox">
                        <Controller
                            name="isCafeStudent"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    {...field}
                                    onChange={(e) => field.onChange(e.checked)}
                                    checked={field.value}
                                />
                            )}
                        />
                        <label htmlFor="isCafeStudent">Is Cafe Student</label>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
