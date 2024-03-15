import { useState, useCallback } from "react";
import {Topbar} from "../components/Topbar";
import { useSearchParams } from "react-router-dom";
import axios from "axios"
import { ErrorMessage } from "../components/ErrorMessage";
import { Box, LinearProgress } from "@mui/material"

export default function SendMoney() {
    const [amount, setAmount] = useState()
    const [searchParams] = useSearchParams()
    const [label, setLabel] = useState("")
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const id = searchParams.get("id")
    const name = searchParams.get("fname") + " " + searchParams.get("lname")

    // function to allow only 2 decimal places
    function inputFormatter(input) {
        let inputArray = input.split(".");
        console.log(amount)
        if(inputArray[1] > 99) {
            inputArray[1] = inputArray[1].substring(0,2)
        }
        setAmount(inputArray.join("."));
    }

    function renderSuccess(){
        if(success) {
            return <div className="font-bold text-green-600 text-center mt-2">Transaction Success!</div>
        }
    }

    function renderLoading(){
        if(loading){
            return <Box sx={{ width: '100%', paddingTop : "12px" }}>
            <LinearProgress color="success"/>
          </Box>
        }
    }


    return <div className="flex flex-col h-screen">
    <Topbar />
        <ErrorMessage label={label} error={error} setError={setError}/>
        <div className="flex flex-grow justify-center items-center">
        <div className="p-4 bg-slate-100 h-max w-80 rounded-lg flex flex-col shadow-xl">
            <div className="font-bold text-3xl text-center">Transfer Money</div>
            <div className="flex justify-center mt-2"><div className="w-5/6 border-b border-slate-300 h-1"></div></div>
            {renderSuccess()}
            <div className="flex items-center mt-8 w-full pl-4">
                <div className="bg-green-400 w-8 h-8 rounded-full flex justify-center items-center font-semibold text-lg text-slate-200">{name[0]}</div>
                <div className="pl-2 text-lg font-semibold">{name}</div>
            </div>
            <div className="m-4">
                <input id="money-input" className="text-center w-full p-2 border border-slate-400 hover:border-black transition ease-in rounded-lg" type="number" placeholder="enter amount (in Rs.)" value={amount} onChange={(e)=>inputFormatter(e.target.value)}/>
            </div>
            <div className="ml-4 mr-4">
                <button className="font-semibold text-lg border border-green-600 text-white bg-green-400 p-2 w-full rounded-md hover:bg-green-500 transition ease-in" onClick={async function sendAmount(){
        try{   
            setLoading(true)
            setSuccess(false)
            const response = await axios({
                url : "https://payment-application.onrender.com/api/v1/account/transfer",
                method : "POST",
                headers : {
                    Authorization : localStorage.getItem("token")
                },
                data : {
                    to : id,
                    amount : amount*100
                }
            })
            setLoading(false)
            setSuccess(true)
        } catch(err) {
            console.log(err)
            setError(true)
            setLabel(err.response.data.message)
        }
    }}>Send</button>
            </div>
            {renderLoading()}
        </div>
    </div>
    <div className="h-44"></div>
    </div>
}

