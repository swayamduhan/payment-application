import { useEffect, useState } from "react";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import Subheading from "../components/Subheading";
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import {Box, LinearProgress, Alert } from "@mui/material"
import { ErrorMessage } from "../components/ErrorMessage";
import { useSetRecoilState } from "recoil";
import { loggedUserAtom } from "../store/atoms";
import PasswordInput from "../components/PasswordInput";

export default function Signin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [label, setLabel] = useState("This is an Error!")
    const setLoggedUser = useSetRecoilState(loggedUserAtom)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(()=>{
        if(localStorage.getItem("token")) {
            navigate('/dashboard')
        }
    }, [])

    async function handleSignin() {
        try {
            setLoading(true)
            const response = await axios.post("https://payment-application.onrender.com/api/v1/user/signin", {
            email,
            password
            })
            setLoading(false)
            if(response.data.message == "wrong password, try again!"){
                setLabel("Wrong password, Try again!")
                setError(true)
                return
            }
            if(response.data.message == "wrong email id") {
                setLabel("Email ID doesn't exist. Create account?")
                setError(true)
                return
            }
            if(response.data.message == "invalid inputs") {
                setLabel("Invalid inputs!")
                setError(true)
                return
            }
            setError(false)
            localStorage.setItem('token', `Bearer ${response.data.token}`)
            setLoggedUser(response.data.name)
            navigate('/dashboard')
        } catch(e) {
            console.log(e)
        }
    }

    function renderLoading(){
        if(loading) {
            return <Box sx={{ width: '100%', paddingTop : "6px" }}>
            <LinearProgress color="inherit"/>
          </Box>
        }
    }

    return <>
        <ErrorMessage label={label} error={error} setError={setError}/>
        <div className="bg-gray-300 h-screen flex justify-center items-center">
        <div className="rounded-lg bg-white w-80 text-center p-4 h-max px-4 lg:w-1/3">
            <Heading label={"Sign In"} />
            <Subheading label={"enter your credentials here to signin"} />
            <InputBox onChange={(e)=>setEmail(e.target.value)} label={"Email :"} placeholder={"workplace.swayam@gmail.com"} />
            <PasswordInput onChange={(e)=>setPassword(e.target.value)} label={"Password :"} placeholder={"********"} showPassword={showPassword} setShowPassword={setShowPassword}/> 
            <div className="mt-4"><Button label="Sign In" handleClick={handleSignin} /></div>
            <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} path={'/signup'} />
            {renderLoading()}
        </div>
        </div>
    </>
}