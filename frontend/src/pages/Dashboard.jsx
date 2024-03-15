import Balance from "../components/Balance";
import {Topbar} from "../components/Topbar";
import Users from "../components/Users";

export default function Dashboard() {
    return <div className="flex flex-col h-screen">
        <Topbar />
        <div className="flex-grow flex flex-col">
            <Balance/>
            <Users />
        </div>
    </div>
}