import { smallMedia } from "../config";
import { Card, Button } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../contexts/AuthContext";
import { useHistory, Link } from "react-router-dom";

export const MainMenu = () => {
    const history = useHistory();
    const { user, logout } = useAuth();
    const isSmall = useMediaQuery(smallMedia);

    async function handleLogout() {
        try {
            await logout();
            history.push("/login");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={isSmall ? "p-3 text-center h-100" : "p-5 text-center h-100"}>
            <div style={{ fontSize: "36px" }}>ระบบจัดเก็บข้อมูลผู้ป่วยโควิด-19 อำเภอโกสุมพิสัย</div>
            <Card className="my-5 card-form mx-auto shadow-sm" style={isSmall ? { width: "100%" } : { width: "25rem" }}>
                <Card.Body className="px-5">
                    <div className="my-3">
                        <h1>เมนูหลัก</h1>
                    </div>
                    <div className="my-3">
                        <strong>บัญชีเจ้าหน้าที่: </strong>{user.email}
                    </div>
                    <div className="my-3">
                        <Link to="/patients/manage"><Button className="w-100" variant="primary">จัดการผู้ป่วย</Button></Link>
                    </div>
                    <div className="my-3">
                        <Link to="/report"><Button className="w-100" variant="primary">รายงาน</Button></Link>
                    </div>
                    <div className="my-3">
                        <Link to="/dashboard"><Button className="w-100" variant="primary">Dashboard</Button></Link>
                    </div>
                    <div className="my-3">
                        <Button className="w-100" variant="danger" onClick={handleLogout}>ออกจากระบบ</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}
