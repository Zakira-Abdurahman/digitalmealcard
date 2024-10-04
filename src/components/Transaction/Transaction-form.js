import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { addTransaction } from "../../store/slices/TransactionSlice";
import { updateTransaction } from "../../store/slices/TransactionSlice";
import { Image } from "primereact/image";
import axios from "axios"; // Import axios for making HTTP requests
import { getStudentPhoto } from "src/store/slices/Studentslice";
import { getMeals } from "src/store/slices/MealSlice";
import { getTransactions } from "src/store/slices/TransactionSlice"; 


export default function AddTransactionForm({ visible, setVisible, passData }) {
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [studentPhotoUrl, setStudentPhotoUrl] = useState(""); // State to store the student photo URL
    const [student,setStudent]=useState();
    const mealState = useSelector((state) => state.meal);
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            universityId: "",
            mealName: null
        }
    });
    useEffect(() => {
        if (passData?.transactionID) {
            setValue("universityId", passData?.universityId);
            setValue("mealName", passData?.mealName);
        } else {
            reset();
        }
    }, [passData, setValue, reset]);












    const Submit = async (data) => {
        const payload = { ...data, transactionID: passData?.transactionID };
        
        // If we are editing an existing transaction
        if (passData?.transactionID) {
            dispatch(updateTransaction(payload))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Transaction updated successfully!"
                    });
                    dispatch(getTransactions());
                    setVisible(false);
                    reset();
                })
                .catch((error) => {
                    console.error("Error updating transaction:", error);
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to update transaction",
                        life: 3000
                    });
                    setVisible(false);
                    reset();
                });
        } else {
            // If we are adding a new transaction
            dispatch(addTransaction(payload))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Transaction added successfully!"
                    });
                    dispatch(getTransactions());
                    setVisible(false);
                    reset();
                })
                .catch((error) => {
                    console.error("Error adding transaction:", error);
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to add transaction",
                        life: 3000
                    });
                    setVisible(false);
                    reset();
                });
        }
    };

    const mealFormFooter = (
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







    
console.log("student",student);
    // Function to fetch student photo based on UniversityID
    // Function to fetch student photo based on UniversityID, handling special characters
    const fetchStudentPhoto = async (universityId) => {
        const encodedUniversityId = encodeURIComponent(universityId);
        dispatch(getStudentPhoto(encodedUniversityId))
            .unwrap()
            .then((res) => {
               setStudent(res)
            })
            .catch(() => {});
        
    };
    useEffect(() => {
        dispatch(getMeals());
    }, []);
    // Handle Enter key press for fetching student photo
    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            // Check if Enter key is pressed
            const universityId = e.target.value;
            setValue("universityId", universityId); // Update the form value
            if (universityId) {
                await fetchStudentPhoto(universityId); // Fetch the student photo
            }
        }
    };
console.log("meal",mealState?.Meals)
    const onSubmit = async (data) => {
      
        try {
            await dispatch(addTransaction(data)).unwrap().then(()=>{
                dispatch(getTransactions());
            }).catch(()=>{})
            toast.current.show({ severity: "success", summary: "Success", detail: "Transaction added successfully." });
            reset();
        } catch (error) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Failed to add transaction" });
        }
    };

    // Function to display error messages for form fields
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="flex gap-4 w-full">
                <div className="card flex flex-column gap-4 w-4">
                    <h2>Add Transaction</h2>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="universityId">University ID</label>
                        <Controller
                            name="universityId"
                            control={control}
                            rules={{ required: "University ID is required." }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="universityId"
                                    className={classNames({ "p-invalid": errors.universityId })}
                                    placeholder="Enter University ID"
                                    onKeyDown={handleKeyDown}
                                />
                            )}
                        />
                        {getFormErrorMessage("universityId")}
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="mealName">meal Name</label>
                        <Controller
                            name="mealName"
                            control={control}
                            rules={{ required: "meal Name is required." }}
                            render={({ field }) => (
                                <Dropdown
                                {...field}
                                    options={mealState?.Meals}
                                    id="mealName"
                                    className={classNames({ "p-invalid": errors.mealName })}
                                    placeholder="Select meal Name"
                                   optionValue="mealName"
                                   optionLabel="mealName"
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {getFormErrorMessage("mealName")}
                    </div>

                    {/* Submit button */}
                    <Button label="Submit" className="p-button-raised" onClick={handleSubmit(onSubmit)} />
                </div>

                <div className="card flex flex-column gap-4 w-4">
                    <h2>Student Information</h2>

                    <div className="flex flex-column gap-2">
                        <div className="flex">
                       
                            <Image
                                src={`data:image/jpeg;base64,${student?.studentPhoto}` || "/image/profile.png"}
                                width={100}
                                height={100}
                                className="border-circle"
                                style={{ borderRadius: "50%" }}
                                preview
                            />
                            <span className="flex flex-column">
                                <span className="mt-3 ml-2">{student?.FirstName}</span>
                                <span className="ml-2 mt-1">{student?.fullName}</span>
                                <span className="flex ml-2 mt-2">
                                    <i className="pi pi-id-card " style={{ color: "green", fontSize: "2rem" }}></i>
                                    <span className="ml-2 mt-1">{student?.universityID}</span>
                                  
                                   

                                 
                                    
                                 
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
