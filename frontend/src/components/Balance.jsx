import Button from "./Button";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios"
import { ErrorMessage } from "./ErrorMessage";

export default function Balance(){
    const [balance, setBalance] = useState()
    const [loading, setLoading] = useState(false)
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
            (async()=>{
                try{setLoading(true)
                    const response = await axios({
                        url : "https://payment-application.onrender.com/api/v1/account/balance",
                        method : 'GET',
                        headers : {
                            Authorization : localStorage.getItem("token")
                        }
                    })
                    setBalance(response.data.balance)
                    setLoading(false)}catch(e){setShowError(true)}
            })()
    }, [])

    function loadBalance(){
        if(loading){
            return <div>Fetching Balance ...</div>
        }
        return <div className="flex">
        <div className="font-bold">Your Balance : </div>
        <div className="pl-3 font-medium">Rs. {balance}</div>
        </div>
    }

    return <>
    <ErrorMessage label={"Please sign in again."} error={showError} />
    <div className="md:flex md:justify-around md:items-center p-4 text-2xl grid grid-rows-2 md:pb-2">
        {loadBalance()}
        <div className="md:pl-10 text-base w-1/2 md:w-1/4">
            <Button label={"Top Up"} handleClick={()=>navigate("/topup")}/>
        </div>
    </div>
    </>
}