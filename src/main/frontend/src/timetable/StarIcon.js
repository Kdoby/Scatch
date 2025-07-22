import {useState} from "react";

export default function StarIcon ({isMain, updateIsMain}) {
    const handleClick = () => {
        if(isMain){
            return;
        }
        updateIsMain(true);
    }
    return (
        <img style={{width: "30px"}} src={isMain ? "/truestar.png" : "/falsestar.png"} alt={"Star"} onClick={handleClick}/>
    )
}