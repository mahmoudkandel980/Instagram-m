import { HiBadgeCheck } from "react-icons/hi";

import { DocumentedUsers } from "../../interfaces/interfaces";
import { ClassNameInterface } from "../../interfaces/interfaces";

const DocumentetedUsers = (props: DocumentedUsers & ClassNameInterface) => {
    const { className, userName } = props;
    return (
        <div className="inline-table">
            {userName.toLocaleLowerCase().replaceAll("_", "") ===
                "mahmoudkandel" ||
            userName.toLocaleLowerCase().replaceAll("_", "") ===
                "ismailarame" ||
            userName.toLocaleLowerCase().replaceAll("_", "") ===
                "asseryassen" ||
            userName.toLocaleLowerCase().replaceAll("_", "") ===
                "mohamedsalah" ||
            userName.toLocaleLowerCase().replaceAll("_", "") ===
                "ismailarame434" ||
            userName.toLocaleLowerCase().replaceAll("_", "") ===
                "ahmedhassan" ||
            userName.toLocaleLowerCase().replaceAll("_", "") === "kikatshad" ? (
                <HiBadgeCheck className={`${className} text-lightBlue`} />
            ) : (
                <span className="inline-table"></span>
            )}
        </div>
    );
};

export default DocumentetedUsers;
