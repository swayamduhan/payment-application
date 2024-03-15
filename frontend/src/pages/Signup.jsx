import { useEffect, useState } from "react";
import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import Subheading from "../components/Subheading";
import axios from "axios"
import { ErrorMessage } from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom"
import { Box, LinearProgress } from "@mui/material"
import { useSetRecoilState } from "recoil";
import { loggedUserAtom } from "../store/atoms";
import PasswordInput from "../components/PasswordInput";

export default function Signup() {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [label, setLabel] = useState("error")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const setLoggedUser = useSetRecoilState(loggedUserAtom)

    useEffect(()=>{
        if(localStorage.getItem("token")){
            navigate('/dashboard')
        }
    }, [])

    async function handleSignup(){
        setLoading(true)
        const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
            firstName,
            lastName,
            email,
            username,
            password
        })
        setLoading(false)
        if(response.data.message == "Invalid inputs") {
            setLabel("Invalid Inputs")
            setError(true)
            return
        }
        if(response.data.message == "username already exists") {
            setLabel("Username already exists, choose another username!")
            setError(true)
            return
        }
        if(response.data.message == "Email is already in use. Login instead") {
            setLabel(response.data.message)
            setError(true)
            return
        }
        const token = response.data.token
        localStorage.setItem("token", `Bearer ${token}`)
        setLoggedUser(response.data.name)
        navigate('/dashboard')
    }

    function renderLoading(){
        if(loading){
            return <Box sx={{ width: '100%', paddingTop : "6px" }}>
            <LinearProgress color="inherit"/>
          </Box>
        }
    }

    return <>
    <ErrorMessage label={label} error={error} setError={setError}/>
    <div className="bg-gray-300 h-screen flex justify-center items-center">
        <div className="rounded-lg bg-white w-80 text-center pb-2 h-max px-4 lg:w-1/3">
            <Heading label={"Sign Up"} />
            <Subheading label={"enter your details here to create an account"} />
            <InputBox label={"First Name :"} placeholder={"Swayam"} onChange={(e)=>setFirstName(e.target.value)}/>
            <InputBox label={"Last Name :"} placeholder={"Duhan"} onChange={(e)=>setLastName(e.target.value)}/>
            <InputBox label={"Email Address :"} placeholder={"workplace.swayam@gmail.com"} onChange={(e)=>setEmail(e.target.value)}/>
            <InputBox label={"Username :"} placeholder={"swayam_05"} onChange={(e)=>setUsername(e.target.value)}/>
            <PasswordInput label={"Password :"} placeholder={"******** (min 6 characters)"} onChange={(e)=>setPassword(e.target.value)} showPassword={showPassword} setShowPassword={setShowPassword}/>
            <div className="mt-4"><Button label="Sign Up" handleClick={handleSignup} /></div>
            <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} path={'/signin'} />
            {renderLoading()}
        </div>
    </div></>
}