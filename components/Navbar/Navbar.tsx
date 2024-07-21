import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const Navbar = () => {
    const { user, Logout } = useAuth();

    console.log(user);
    return(
        <div>
        <ul className="topnav">
            <li><Link className="active" href="/dashboard">Luna&apos;s Dashboard</Link></li>
            <li><Link  href="/mypage">{user?.email}</Link></li>
            <li className="right"><button className="logout" onClick = { Logout }>Logout</button></li>
        </ul>
            
        </div>
    )
}

export default Navbar;