import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
export default function DeleteDialog({
    data,
    name,
    optionalName,
    visible,
    setVisible,
    performingAction,
    callbackFn,
    value
}) {


    const deleteDialogFooter = (
        <>
            <Button
                label="cancel"
                icon="pi pi-times"
                className="p-button-raised"
                onClick={() => setVisible(false)}
            />
            {performingAction ? (
                <Button
                    label="deleting"
                    icon="pi pi-spin pi-spinner"
                    className="p-button-raised"
                    disabled
                ></Button>
            ) : (
                <Button label="yes" icon="pi pi-check" className="p-button-raised" onClick={callbackFn} />
            )}
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: "450px" }}
            header="Confirmation"
            modal
            footer={deleteDialogFooter}
            onHide={() => setVisible(false)}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                Are you to delete this data?
            </div>
        </Dialog>
    );
}
