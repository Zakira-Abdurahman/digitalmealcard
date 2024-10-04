import React from "react";

function NotFound() {
    return (
        <div className="flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <span>
                <p className="font-bold text-3xl">404 | NOT FOUND</p>
                <span className="flex justify-content-center">
                    <a href="/">Home</a>
                </span>
            </span>{" "}
        </div>
    );
}

NotFound.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            {/* <AppConfig minimal /> */}
        </React.Fragment>
    );
};

export default NotFound;
