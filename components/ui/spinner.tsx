import clases from "./spinner.module.css";

import { ClassNameInterface } from "../../interfaces/interfaces";

const Spinner = (props: ClassNameInterface) => {
    const { className } = props;
    return (
        <div className={`${clases.ldsSpinner} ${className}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default Spinner;
