import { smallMedia } from "../config";
import { Button, Card } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const LandingPage = () => {
    const { isAuth } = useAuth();

    // Media query
    const isSmall = useMediaQuery(smallMedia);

    if (isAuth()) {
        return <Redirect to="/mainmenu" />
    }

    return (
        <div className="d-flex flex-column landing-page">
            <Card id="landing-page-card" className="my-auto mx-auto text-center shadow-sm p-3">
                <Card.Body>
                    <div id="landing-page-title" className="mb-4">ระบบจัดเก็บข้อมูลผู้ป่วยโควิด-19 อำเภอโกสุมพิสัย</div>
                    <div className={isSmall ? "row" : "col"}>
                        <Link to="/dashboard"><Button variant="primary">Dashboard</Button></Link>
                        <Link to="/login"><Button className={isSmall ? "" : "ms-3"} variant="success">เข้าสู่ระบบ</Button></Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}
