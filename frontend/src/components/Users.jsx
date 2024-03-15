import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Stack, Skeleton } from "@mui/material"
import { useSetRecoilState } from "recoil";

export default function Users(){
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    
    function loadUsers(){
        if(loading){
            return <Stack spacing={2} marginTop={2}>
                    <Skeleton variant="rounded" width={"100%"} height={60}/>
                    <Skeleton variant="rounded" width={"100%"} height={60}/>
                    <Skeleton variant="rounded" width={"100%"} height={60}/>
                </Stack>
        } else if(error){
            return <div>Error in fetching {":("}</div>
        } else {
            return <div className="mt-4">{users.map(user=> <User user={user} key={user._id}/>)}</div>
        }
    }
    
    // filtering along with debouncing
    const [filter, setFilter] = useState("")
    let timer = useRef(null)
    useEffect(()=>{
        clearTimeout(timer.current)
        timer.current = setTimeout(async()=>{
            try {
                setLoading(true)
                const response = await axios({
                    url : `http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
                    method : "GET",
                    headers : {
                        Authorization : localStorage.getItem("token")
                    }
                })
                setUsers(response.data.user)
                setLoading(false)
            } catch(err) {
                setError(true)
            }
        }, 300)

        return ()=>clearTimeout(timer.current)
    }, [filter])
    
    return <div 
    className="p-4 flex flex-col flex-grow">
        <div className="font-bold text-2xl md:text-xl">Users</div>
        <div className="pt-2 md:pt-2">
            <input className="border border-slate-200 w-full rounded-lg p-2 hover:border-slate-400 transition duration-75 ease-in" type="text" placeholder="search for recipient here" onChange={(e)=>setFilter(e.target.value)}/>
        </div>
        {loadUsers()}
    </div>
}

function User({user}) {
    const navigate = useNavigate()
    return <div className="flex justify-between items-center border-b-2 border-slate-100 pb-2 mb-2">
        <div className="flex items-center">
            <div className="bg-slate-200 rounded-full w-8 h-8 flex justify-center items-center"><div>{user.firstName[0]}</div></div>
            <div className="ml-2 text-lg md:text-base">{user.firstName} {user.lastName}</div>
        </div>
        <div className="text-xs flex flex-col justify-center items-center w-24">
            <Button handleClick={()=>{
                navigate(`/transfer?id=${user._id}&fname=${user.firstName}&lname=${user.lastName}`)
            }} label={"Send Money"}/>
        </div>
    </div>
}