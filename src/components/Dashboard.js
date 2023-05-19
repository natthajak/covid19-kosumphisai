import { useState } from "react";
import { DdcApi } from "./DdcApi";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { PublicTimeline } from "./PublicTimeline";
import { DashboardStats } from "./DashboardStats";

export const Dashboard = () => {
    const { isAuth } = useAuth();
    const [mode, setMode] = useState(1); // 1: default, 2: api

    function toggleMode() {
        if (mode === 1)
            return setMode(2);
        if (mode === 2)
            return setMode(1);
    }

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center my-3 mb-5">Dashboard</h1>
            <div className="my-3 text-center" >
                {!isAuth() && <Link to="/"><Button variant="secondary">ย้อนกลับ</Button></Link>}
            </div>
            <div className="my-3 text-center">
                <Button className="px-3" variant="primary" onClick={toggleMode} style={{ height: "auto" }}>
                    {mode === 1 ? "ข้อมูลสถานการณ์โควิด-19 ในประเทศไทย" : "ข้อมูลผู้ป่วยติดเชื้อโควิด-19 อำเภอโกสุมพิสัย"}
                </Button>
            </div>
            {
                mode === 1 ?
                    <>
                        {/* Dashboard Statistics */}
                        < DashboardStats />

                        {/* Public timeline */}
                        < PublicTimeline />
                    </>
                    :
                    <>
                        {/* DDC API */}
                        < DdcApi />
                    </>
            }
        </div>
    )
}