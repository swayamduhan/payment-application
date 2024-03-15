import { Link } from "react-router-dom";
import { memo, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loggedUserAtom } from "../store/atoms";
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const Topbar= memo(()=> {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const setLoggedUser = useSetRecoilState(loggedUserAtom)
    useEffect(()=>{
        if(loggedUser == "null" && localStorage.getItem("token")) {
            (async()=>{
                const response = await axios({
                    url : "https://payment-application.onrender.com/api/v1/user/loggedUser",
                    method : "GET",
                    headers : {
                        Authorization : localStorage.getItem("token")
                    }
                })
                setLoggedUser(response.data.name)
            })()
        }
    })
    const navigate = useNavigate()
    return <div className="flex md:text-2xl justify-between items-center p-4 h-24 shadow-md md:text-xl md:h-16">
        <Link to={"/dashboard"} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <div className="ml-3">JaatPay</div>
        </Link>
        <div className="flex items-center">
            <div className="pr-3 fixed right-1 top-6 md:static">
                Hello, {loggedUser}
            </div>
            <Link to={"/profile"}>
            <div className="rounded-full w-12 h-12 bg-slate-200 flex items-center mr-8 md:mr-4 md:static justify-center">
                {loggedUser[0]}
            </div>
            </Link>      
            <button className="underline text-blue-600 text-base ml-3 md:ml-0 md:static relative top-3" onClick={()=>{
                localStorage.removeItem("token")
                setLoggedUser("null")
                navigate('/signin')
            }}>
                Sign Out
            </button>
        </div>
    </div>
})