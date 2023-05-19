import { smallMedia } from "../config";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

export const ManagePatient = () => {
    const isSmall = useMediaQuery(smallMedia);

    return (
        <div className={isSmall ? "p-3 text-center h-auto" : "p-5 text-center h-auto"}>
            <Card className="mt-5 mx-auto shadow-sm" style={isSmall ? { width: "100%" } : { width: "25rem" }}>
                <Card.Body className="px-5">
                    <div className="my-4">
                        <h1>จัดการผู้ป่วย</h1>
                    </div>
                    <div className="my-3">
                        <Link to="/patients/add"><Button className="w-100" variant="success">เพิ่มผู้ป่วยใหม่</Button></Link>
                    </div>
                    <div className="my-3">
                        <Link to="/patients/find"><Button className="w-100" variant="primary">ค้นหาผู้ป่วย</Button></Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}
