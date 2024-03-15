import { useEffect, useState } from "react";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import {Topbar} from "../components/Topbar";
import axios from "axios"
import { Box, LinearProgress } from '@mui/material'

export default function Topup() {
    const [amount, setAmount] = useState()
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleAmount(e){
        let input = e.split(".")
        if(input[1] > 99){
            input[1] = input[1].substring(0,2)
        }
        setAmount(input.join("."))
    }

    async function handleClick(){
        try{
            setLoading(true)
            await axios({
               url : "http://localhost:3000/api/v1/account/topup",
                method : "PUT",
                headers : {
                    Authorization : localStorage.getItem("token")
                },
                data : {
                    amount : amount*100
                }
            })
            setLoading(false)
            setSuccess(true)
        } catch (e) {
            setSuccess(false)
        }
    }

    function renderLoading(){
        if(loading){
            return <Box sx={{ width: '100%', paddingTop : "6px" }}>
            <LinearProgress color="inherit"/>
          </Box>
        }
    }

    function renderSuccess(){
        if(success) {
            return <div className="text-green-700 font-bold mt-2">Top Up Success!</div>
        }
    }

    return <div className="flex flex-col h-screen">
        <Topbar />
        <div className="flex justify-center mt-20">
            <div className="flex flex-col h-max w-80 items-center bg-slate-100 rounded-xl shadow-lg p-3 md:w-96">
                <Heading label={"Topup Balance"} />
                {renderSuccess()}
                <input type="number" placeholder="enter amount" value={amount} onChange={(e)=>handleAmount(e.target.value)} className="text-center rounded-lg border border-slate-200 mt-6 w-3/4 hover:border-black transition ease-in p-2"/>
                <div className="text-sm w-3/4 mt-3">
                    <Button label={"Top Up"} handleClick={handleClick}/>
                </div>
                {renderLoading()}
            </div>
        </div>
    </div>
}