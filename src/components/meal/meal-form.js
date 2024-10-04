import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addMeal, getMeals, updateMeal } from "../../store/slices/MealSlice";
import { Toast } from "primereact/toast";
import { update } from "lodash";
import { Image } from "primereact/image";

export default function MealForm({ visible, setVisible, passData }) {
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [image, setImage] = useState();

    const {
        handleSubmit,
        reset,
        control,
        setValue,
        getValues,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (passData?.mealID) {
            setValue("MealName", passData?.MealName);
            setValue("mealType", passData?.mealType);
            setValue("price", passData?.price);
            if (passData?.Image) {
                const file = new File([base64ToArrayBuffer(passData?.Image)], "Image.jpg", {
                    type: "image/jpeg"
                });
                setValue("Image", file);
                setImage(file);
            }
        } else {
            reset();
        }
    }, [passData, reset, setValue]);

    const Submit = async (data) => {
        const payload = { ...data, mealID: passData?.mealID };
        if (passData?.mealID) {
            dispatch(updateMeal({ ...payload, mealID: passData?.mealID }))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Meal updated Successfully!"
                    });
                    dispatch(getMeals());
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
            dispatch(addMeal(payload))
                .unwrap()
                .then(() => {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Meal Added Successfully!"
                    });
                    dispatch(getMeals());
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
    const mealTypeOptions = [
        { label: "Breakfast", value: 1 },
        { label: "Lunch", value: 2 },
        { label: "Dinner", value: 3 }
    ];

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    const onFileSelect = (event) => {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1]; // Extract base64 string
                setValue("image", base64String); // Automatically set base64 string in form data
            };
            reader.readAsDataURL(file);
        } else {
            setValue("image", null); // If no image is selected, set image value to null
        }
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
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                style={{ width: "50vw" }}
                header={"Meal"}
                onHide={() => {
                    setVisible(false);
                    reset();
                }}
                modal
                className="p-fluid"
                footer={mealFormFooter}
            >

                <span className="flex justify-content-center">
                {passData?.image && (
                    <Image
                        src={`data:image/jpeg;base64,${passData?.image}`}
                        alt="Meal Image"
                        className="mb-3"
                        height="100"
                        width="100"
                    />
                )}
                </span>

                <div className="flex flex-column gap-2">
                    <div className="p-field">
                        <label htmlFor="mealName">Meal Name</label>
                        <Controller
                            name="mealName"
                            control={control}
                            rules={{ required: "Meal name is required." }}
                            defaultValue={passData?.mealName}
                            render={({ field }) => (
                                <InputText {...field} className={classNames({ "p-invalid": errors.mealName })} />
                            )}
                        />
                        {getFormErrorMessage("mealName")}
                    </div>
                    <div className="p-field">
                        <label htmlFor="price">Price</label>
                        <Controller
                            name="price"
                            control={control}
                            rules={{ required: "Price is required." }}
                            defaultValue={passData?.price || 0} 
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <InputNumber
                                    suffix="Birr"
                                    min={0}
                                    value={value} 
                                    onValueChange={(e) => {
                                       
                                        onChange(e.value !== null ? e.value : 0); 
                                    }}
                                    className={classNames({ "p-invalid": errors.price })}
                                    ref={ref}
                                />
                            )}
                        />
                        {getFormErrorMessage("price")}
                    </div>

                    <div className="p-field">
                        <label htmlFor="image">Image (Optional)</label>
                        <Controller
                            name="image"
                            control={control}
                            defaultValue={passData?.image}
                            render={() => (
                                <FileUpload
                                    name="image"
                                    accept="image/*"
                                    maxFileSize={1000000}
                                    customUpload
                                    auto
                                    onSelect={onFileSelect}
                                    chooseLabel="Choose"
                                />
                            )}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="mealType">Meal Type</label>
                        <Controller
                            name="mealType"
                            control={control}
                            rules={{ required: "Meal type is required." }}
                            defaultValue={passData?.mealType}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={mealTypeOptions}
                                    className={classNames({ "p-invalid": errors.mealType })}
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {getFormErrorMessage("mealType")}
                    </div>
                </div>
            </Dialog>
        </>
    );
}
