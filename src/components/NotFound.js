import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { IconContext } from "react-icons";
import { FcHighPriority } from "react-icons/fc";

export const NotFound = () => {
    return (
        <div id="notFoundPage" className="d-flex align-items-center justify-content-center text-center h-auto">
            <div className="mt-5">
                <IconContext.Provider value={{ style: { verticalAlign: "middle" }, size: "10rem" }}>
                    <FcHighPriority className="my-3" />
                </IconContext.Provider>
                <br />
                <h1>404 Not Found</h1>
                <div>
                    <h2>ขออภัย ไม่พบหน้าคุณที่ต้องการ</h2>
                </div>
                <br />
                <div>
                    <Link to="/"><Button className="mx-2" variant="primary" style={{ width: "200px" }}>กลับไปที่หน้าหลัก</Button></Link>
                </div>
            </div>
        </div>
    )
}