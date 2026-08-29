import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./PasswordField.css";

function PasswordField({

    value,

    onChange

}){

    const [show,setShow]=useState(false);

    return(

        <div className="input-group">

            <label>Password</label>

            <div className="password-wrapper">

                <input

                    type={show?"text":"password"}

                    value={value}

                    onChange={onChange}

                />

                <button

                    type="button"

                    onClick={()=>setShow(!show)}

                >

                    {

                        show?

                        <FaEyeSlash/>:

                        <FaEye/>

                    }

                </button>

            </div>

        </div>

    );

}

export default PasswordField;