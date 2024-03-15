import { useState } from "react";
import Button from "../components/Button";
import {Topbar} from "../components/Topbar";
import axios from "axios"
import { ErrorMessage } from "../components/ErrorMessage";
import { useSetRecoilState } from "recoil";
import { loggedUserAtom } from "../store/atoms";

export default function Profile(){
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [nameSuccess, setNameSuccess] = useState(false)
    const [label, setLabel] = useState("")
    const setLoggedUser = useSetRecoilState(loggedUserAtom)

    async function changePassword(){
        setPasswordSuccess(false)
        if(!password || password.length < 6) {
            setError(true)
            setLabel("Password should be minimum 6 characters!")
            return
        }
        await axios({
            url : "https://payment-application.onrender.com/api/v1/user/update",
            method : "PUT",
            headers : {
                Authorization : localStorage.getItem("token")
            },
            data : {
                password : password
            }
        })
        setPasswordSuccess(true)
        setError(false)
    }

    async function changeName(){
        setNameSuccess(false)
        if(!firstName){
            setError(true)
            setLabel("First name can't be empty!")
            return
        }
        if(!lastName){
            setError(true)
            setLabel("Last name can't be empty!")
            return
        }
        const response = await axios({
            url : "https://payment-application.onrender.com/api/v1/user/update",
            method : "PUT",
            headers : {
                Authorization : localStorage.getItem("token")
            },
            data : {
                firstName,
                lastName
            }
        })
        setNameSuccess(true)
        setLoggedUser(response.data.name)
        setError(false)
    }


    return <div className="h-screen flex flex-col">
        <Topbar />
        <ErrorMessage label={label} error={error} setError={setError}/>
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center border mt-10 p-4 w-3/4 rounded-xl bg-slate-100 shadow-lg md:w-1/3">
                <div className="m-4 font-bold text-2xl">
                    Change Password
                </div>
                {(()=>{if(passwordSuccess){return <div className="font-bold text-green-600">Password has been changed successfully.</div>}})()}
                <input type="text" placeholder="enter new password" className="border border-slate-200 hover:border-black transition ease-in rounded-lg p-1 text-center mb-4 mt-2" onChange={(e)=>setPassword(e.target.value)}/>
                <div className="ml-4 mr-4 w-2/3">
                    <Button label={"Change Password"} handleClick={changePassword}/>
                </div>
            </div>
            <div className="flex flex-col items-center border mt-6 p-4 w-3/4 rounded-xl bg-slate-100 shadow-lg md:w-1/3">
                <div className="m-4 font-bold text-2xl">Change Name</div>
                {(()=>{if(nameSuccess){return <div className="font-bold text-green-600">Name has been changed successfully.</div>}})()}
                <input type="text" placeholder="enter first name" className="border border-slate-200 hover:border-black transition ease-in rounded-lg p-1 text-center m-2" onChange={(e)=>setFirstName(e.target.value)}/>
                <input type="text" placeholder="enter last name" className="border border-slate-200 hover:border-black transition ease-in rounded-lg p-1 text-center m-2" onChange={(e)=>setLastName(e.target.value)}/>
                <div className="ml-4 mr-4 w-2/3 mt-2">
                    <Button label={"Change Name"} handleClick={changeName}/>
                </div>
            </div>
        </div>
    </div>
}