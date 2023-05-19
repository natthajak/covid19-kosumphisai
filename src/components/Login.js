import { useRef, useState } from "react";
import { IconContext } from "react-icons";
import { IoReturnUpBack } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { useHistory, Redirect, Link } from "react-router-dom";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";

export const Login = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const history = useHistory();

    // Use context
    const { isAuth, login } = useAuth();

    // If the user already logged in, redirect them to main menu
    if (isAuth()) {
        return <Redirect to="/mainmenu" />
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        setLoading(true);

        if (email.length === 0 || password.length === 0) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            setLoading(false);
        } else {
            try {
                setError(false);
                await login(email, password);
                history.push("/mainmenu");
            } catch (error) {
                if (error.code === "auth/user-not-found") {
                    setError("ไม่พบบัญชีผู้ใช้ กรุณาลองใหม่อีกครั้ง");
                } else if (error.code === "auth/wrong-password") {
                    setError("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
                } else if (error.code === "auth/too-many-requests") {
                    setError("การเข้าถึงบัญชีถูกระงับชั่วคราวเนื่องจากมีจำนวนการเข้าถึงที่มากเกินไป กรุณารีเซ็ตรหัสผ่านหรือลองใหม่ในภายหลัง");
                } else {
                    setError(error.message);
                }
                setLoading(false);
            }
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center">
            <Card id="loginForm" className="mx-auto p-3 mb-3 card-form shadow-sm">

                <Card.Body>
                    <IconContext.Provider value={{ color: "black", size: "1.5rem" }}>
                        <Link to="/"><Button id="returnBtn" className="position-relative" style={{ boxShadow: "0 0 0 0", left: "-1.5rem", top: "-1.5rem" }} variant="outline-light" disabled={loading}> <IoReturnUpBack /> </Button></Link>
                    </IconContext.Provider>
                    <h1 className="text-center">ลงชื่อเข้าใช้งาน</h1>
                    <p className="text-center">สำหรับเจ้าหน้าที่</p>
                    {error && <Alert className="m-0 mt-2" variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mt-2">
                            <Form.Label>อีเมล</Form.Label>
                            <Form.Control ref={emailRef} type="email" autoComplete="nope" />
                        </Form.Group>

                        <Form.Group className="mt-2">
                            <Form.Label>รหัสผ่าน</Form.Label>
                            <Form.Control ref={passwordRef} type="password" autoComplete="nope" />
                        </Form.Group>

                        <Button className="w-100 mt-4" variant="success" type="submit" disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "เข้าสู่ระบบ"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}
