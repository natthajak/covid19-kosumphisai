import { IconContext } from "react-icons";
import { getNameFromEmail } from "../helper";
import { useAuth } from "../contexts/AuthContext";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { BsPerson, BsClipboardData, BsBoxArrowLeft, BsDisplay, BsList } from "react-icons/bs";

export const MainNavbar = () => {
    const history = useHistory();
    const location = useLocation();
    const { logout, user, isAuth } = useAuth();
    const ignoredPages = ["/mainmenu", "/notfound"];

    if (!isAuth() || ignoredPages.includes(location.pathname)) {
        return <></>
    }

    async function handleLogout() {
        try {
            await logout();
            history.push("/login");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <IconContext.Provider value={{ color: "white", size: "1.5rem" }}>
                <Navbar bg="dark" variant="dark" expand="xl">
                    <Container>
                        <Navbar.Brand className="user-select-none">ระบบจัดเก็บข้อมูลผู้ป่วยโควิด-19</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <LinkContainer to="/mainmenu">
                                    <Nav.Link><BsList /> เมนูหลัก</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/patients/manage">
                                    <Nav.Link ><BsPerson /> จัดการผู้ป่วย</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/report">
                                    <Nav.Link><BsClipboardData /> รายงาน</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/dashboard">
                                    <Nav.Link><BsDisplay /> Dashboard</Nav.Link>
                                </LinkContainer>
                                <Nav.Link onClick={handleLogout}><BsBoxArrowLeft /> ออกจากระบบ</Nav.Link>
                            </Nav>
                            <Navbar.Text>
                                เจ้าหน้าที่: {getNameFromEmail(user.email)}
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </IconContext.Provider>
        </>
    )
}
