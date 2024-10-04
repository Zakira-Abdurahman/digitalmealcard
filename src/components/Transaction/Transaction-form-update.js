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
import { Dialog } from "primereact/dialog";


export default function TransactionFormUpdate({ visible, setVisible, passData }) {
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [studentPhotoUrl, setStudentPhotoUrl] = useState(""); // State to store the student photo URL
    const [student,setStudent]=useState();
    const mealState = useSelector((state) => state.meal);
    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {}
    });

    
    useEffect(() => {
        if (passData?.transactionID) {
           
            setValue("universityId", passData?.universityID);
            setValue("mealID", passData?.mealID); 
            setValue("mealStatus",passData?.mealStatus)
             
            
        } else {
            reset();
        }
    }, [passData]);



console.log("mealID",getValues("mealID"))








 

    const MealStatus = [
        { name: "NotTaken", value: 1 },
        { name: "Taken", value: 2 },
       
    ];






    

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

    const onSubmit = async (data) => {
       
        const payload = { ...data, studentID: passData?.studentID ,transactionID:passData?.transactionID};
        if (passData?.transactionID) {
            dispatch(updateTransaction(payload))
                .unwrap()
                .then(() => {
                    setTimeout(() => {
                        setVisible(false)
                        
                        reset(); 
                    }, 1000); 
                  
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Transaction updated successfully!"
                    });  
                    dispatch(getTransactions());
                  
                })
                .catch((error) => {
                  
                })
                .finally(() => {
                  
                 
                });
        }
        
    };

    // Function to display error messages for form fields
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <Dialog visible={visible} onHide={() => setVisible(false)} header="Update Transaction">
            <Toast ref={toast} />
            <div className="flex gap-4 w-full">
                <div className="card flex flex-column gap-4" style={{width:"50%"}}>
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
                        <label htmlFor="mealID">Meal Name</label>
                        <Controller
                            name="mealID"
                            control={control}
                            rules={{ required: "meal Name is required." }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={mealState?.Meals}
                                    className={classNames({ "p-invalid": errors.mealName })}
                                    placeholder="Select meal Name"
                                    optionLabel="mealName"
                                    optionValue="mealID"
                                
                                />
                            )}
                        />
                        {getFormErrorMessage("mealName")}
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="mealStatus">Meal Status</label>
                        <Controller
                            name="mealStatus"
                            control={control}
                            rules={{ required: "meal status is required." }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={MealStatus}
                                    className={classNames({ "p-invalid": errors.mealName })}
                                    placeholder="Select meal status"
                                    optionLabel="name"
                                    optionValue="value"
                                
                                />
                            )}
                        />
                        {getFormErrorMessage("mealName")}
                    </div>

                    {/* Submit button */}
                    <Button label="Submit" className="p-button-raised" onClick={handleSubmit(onSubmit)} />
                </div>

                <div className="card flex flex-column gap-4" style={{width:"50%"}}>
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
        </Dialog>
    );
}
