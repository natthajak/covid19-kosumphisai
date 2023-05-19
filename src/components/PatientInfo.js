import { Loading } from "./Loading";
import { mediumMedia } from "../config";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Link, useParams } from "react-router-dom";
import { usePatient } from "../contexts/PatientContext";
import { Card, Button, Alert, Form, Col, Row, Dropdown, DropdownButton, Container } from "react-bootstrap";

function buildMenu(_id, loading, handleDelete) {
    return (
        <div className="my-3">
            <Link to={`/patients/edit/${_id}`}><Button variant="warning" disabled={loading}>แก้ไข</Button></Link>
            <Link to={`/patients/timelines/info/${_id}`}><Button className="ms-3" variant="primary" disabled={loading}>Timeline</Button></Link>
            <DropdownButton id="dropdown-basic-button" className="d-inline ms-3" variant="primary" title="การรักษา">
                <Dropdown.Item as={Link} to={`/patients/admission/${_id}`} disabled={loading}>บันทึกรับการรักษา</Dropdown.Item>
                <Dropdown.Item as={Link} to={`/patients/discharge/${_id}`} disabled={loading}>บันทึกการจำหน่าย</Dropdown.Item>
            </DropdownButton>
            <Link to={`/patients/treatments/info/${_id}`}><Button className="ms-3 px-3" variant="primary" disabled={loading}>การดูแลหลังการจำหน่าย</Button></Link>
            <Button className="ms-3" variant="danger" onClick={handleDelete} disabled={loading}>ลบ</Button>
        </div>
    );
}

function buildDropDownMenu(_id, loading, handleDelete) {
    return (
        <Dropdown className="my-3">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                ตัวเลือก
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/patients/edit/${_id}`} disabled={loading}>แก้ไข</Dropdown.Item>
                <Dropdown.Item as={Link} to={`/patients/timelines/info/${_id}`} disabled={loading}>Timeline</Dropdown.Item>
                <Dropdown.Item as={Link} to={`/patients/admission/${_id}`} disabled={loading}>บันทึกรับการรักษา</Dropdown.Item>
                <Dropdown.Item as={Link} to={`/patients/discharge/${_id}`} disabled={loading}>บันทึกการจำหน่าย</Dropdown.Item>
                <Dropdown.Item as={Link} to={`/patients/treatments/info/${_id}`} disabled={loading}>การดูแลหลังการจำหน่าย</Dropdown.Item>
                <Dropdown.Item onClick={handleDelete} disabled={loading}>ลบ</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

function buildInfo(patient) {
    return (
        <Card className="p-3 card-form shadow-sm">
            <Card.Body>
                <Form>
                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ID:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="6">
                            <span>{patient._id}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>เลขบัตรประชาชน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="6">
                            <span>{patient.id_card_number}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ลำดับอำเภอ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="1">
                            <span>{patient.district_number}</span>
                        </Col>
                        <Col className="form-label" sm="3">
                            <span><strong>ลำดับจังหวัด:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{patient.province_number}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>เป็นผู้ป่วยในปี:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.year}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>เป็นผู้ป่วยในเดือน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.month}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ลำดับเดือน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{patient.month_number}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ชื่อ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.name_prefix} {patient.first_name}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>สกุล:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.last_name}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>เพศ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.sex}</span>
                        </Col>

                        <Col className="form-label" sm="2">
                            <span><strong>อายุ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.age} ปี</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>วันเกิด:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.dob.date} {patient.dob.month} {patient.dob.year}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ที่อยู่ภูมิลำเนา:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="8">
                            <span>{patient.address}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ที่อยู่ที่อาศัยจริง:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="8">
                            <span>{patient.current_address}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>อาชีพ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="8">
                            <span>{patient.occupation}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ที่ทำงาน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="8">
                            <span>{patient.workplace}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>โทรศัพท์มือถือ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="8">
                            <span>{patient.phone_number}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ประเภทผู้ป่วย:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="8">
                            <span>{patient.patient_type}</span>
                        </Col>

                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>หมายเหตุ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="8">
                            <span>{patient.note}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ATK ครั้งที่ 1 วันที่:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{patient.atk1_date.date} {patient.atk1_date.month} {patient.atk1_date.year}</span>
                        </Col>
                        <Col className="form-label" sm="1">
                            <span><strong>ผลตรวจ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{patient.atk1_result}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ATK ครั้งที่ 2 วันที่:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{patient.atk2_result === "ไม่ได้ตรวจ" && "ไม่ได้ตรวจ"} {patient.atk2_date.date} {patient.atk2_date.month} {patient.atk2_date.year}</span>
                        </Col>
                        <Col className="form-label" sm="1">
                            <span><strong>ผลตรวจ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{patient.atk2_result}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>PCR พบผลบวกวันที่:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.pcrDate.date} {patient.pcrDate.month} {patient.pcrDate.year}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>ค่า Ct ผลตรวจ PCR:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{patient.pcr_ct}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    < Row>
                        <Col className="form-label" sm="4">
                            <span><strong>วันรับผู้ป่วย:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.admission.admission_date.date !== "" ? `${patient.admission.admission_date.date} ${patient.admission.admission_date.month} ${patient.admission.admission_date.year}` : "-"}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>สถานที่รับรักษาครั้งแรก:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.admission.first_treatment !== "" ? patient.admission.first_treatment : "-"}</span>
                        </Col>
                    </Row>

                    < Row>
                        <Col className="form-label" sm="4">
                            <span><strong>วันจำหน่ายผู้ป่วย:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.discharge.discharge_date.date !== "" ? `${patient.discharge.discharge_date.date} ${patient.discharge.discharge_date.month} ${patient.discharge.discharge_date.year}` : "-"}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>สถานที่รับรักษาครั้งสุดท้าย:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.discharge.last_treatment !== "" ? patient.discharge.last_treatment : "-"}</span>
                        </Col>
                    </Row>

                    < Row>
                        <Col className="form-label" sm="4">
                            <span><strong>จำนวนวันรักษา:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="8">
                            <span>{patient.discharge.treatment_duration !== "" ? `${patient.discharge.treatment_duration} วัน` : "-"}</span>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}

function buildSmallInfo(patient) {
    return (
        <Card className="p-3 card-form shadow-sm">
            <Card.Body>
                <Container>
                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ID:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient._id}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>เลขบัตรประชาชน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.id_card_number}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ลำดับอำเภอ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.district_number}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ลำดับจังหวัด:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.province_number}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>เป็นผู้ป่วยในปี:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{patient.year}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>เป็นผู้ป่วยในเดือน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.month}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ลำดับเดือน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.month_number}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ชื่อ-สกุล:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.name_prefix} {patient.first_name} {patient.last_name}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>เพศ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.sex}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>อายุ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.age} ปี</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>วันเกิด:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.dob.date} {patient.dob.month} {patient.dob.year}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ที่อยู่ภูมิลำเนา:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.address}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ที่อยู่ที่อาศัยจริง:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.current_address}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>อาชีพ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.occupation}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ที่ทำงาน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.workplace}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>โทรศัพท์มือถือ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.phone_number}</span>
                        </Col>
                    </Row>
                    <hr className="shortHr" />

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ประเภทผู้ป่วย:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.patient_type}</span>
                        </Col>

                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>หมายเหตุ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.note}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ตรวจแบบ ATK ครั้งที่ 1 วันที่:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.atk1_date.date} {patient.atk1_date.month} {patient.atk1_date.year}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ผลตรวจ ATK ครั้งที่ 1:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.atk1_result}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ตรวจแบบ ATK ครั้งที่ 2 วันที่:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.atk2_result === "ไม่ได้ตรวจ" && "ไม่ได้ตรวจ"} {patient.atk2_date.date} {patient.atk2_date.month} {patient.atk2_date.year}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ผลตรวจ ATK ครั้งที่ 2:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.atk2_result}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>PCR พบผลบวกวันที่:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.pcrDate.date} {patient.pcrDate.month} {patient.pcrDate.year}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>ค่า Ct ผลตรวจ PCR:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.pcr_ct}</span>
                        </Col>
                    </Row>

                    <hr className="shortHr" />

                    < Row>
                        <Col className="form-label" sm="4">
                            <span><strong>วันรับผู้ป่วย:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.admission.admission_date.date !== "" ? `${patient.admission.admission_date.date} ${patient.admission.admission_date.month} ${patient.admission.admission_date.year}` : "-"}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>สถานที่รับรักษาครั้งแรก:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.admission.first_treatment !== "" ? patient.admission.first_treatment : "-"}</span>
                        </Col>
                    </Row>

                    < Row>
                        <Col className="form-label" sm="4">
                            <span><strong>วันจำหน่ายผู้ป่วย:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.discharge.discharge_date.date !== "" ? `${patient.discharge.discharge_date.date} ${patient.discharge.discharge_date.month} ${patient.discharge.discharge_date.year}` : "-"}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="form-label" sm="4">
                            <span><strong>สถานที่รับรักษาครั้งสุดท้าย:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.discharge.last_treatment !== "" ? patient.discharge.last_treatment : "-"}</span>
                        </Col>
                    </Row>

                    < Row>
                        <Col className="form-label" sm="4">
                            <span><strong>จำนวนวันรักษา:</strong></span>
                        </Col>
                        <Col className="form-info text-primary">
                            <span>{patient.discharge.treatment_duration !== "" ? `${patient.discharge.treatment_duration} วัน` : "-"}</span>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}

export const PatientInfo = () => {
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState();
    const [error, setError] = useState("");
    const { _id } = useParams();
    const history = useHistory();
    const { deletePatient, patients } = usePatient();
    const isMedium = useMediaQuery(mediumMedia);

    async function handleDelete() {
        setLoading(true);
        setError("");

        try {
            await deletePatient(_id);
            return history.push("/patients/find");
        } catch (error) {
            setLoading(false);
            console.log(error);
            return setError("เกิดข้อผิดพลาดขึ้นระหว่างการลบข้อมูล");
        }
    }

    useEffect(() => {
        setPatient(patients.filter(patient => patient._id === _id)[0]);
    }, [_id, patients]);

    if (!patient) {
        return <Loading />
    }

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center mb-5">ข้อมูลผู้ป่วย</h1>
            <h2 className="text-center mb-5">{`${patient.name_prefix} ${patient.first_name} ${patient.last_name}`}</h2>

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Menu */}
            {isMedium ? buildDropDownMenu(_id, loading, handleDelete) : buildMenu(_id, loading, handleDelete)}

            {/* Info */}
            {isMedium ? buildSmallInfo(patient) : buildInfo(patient)}

            <div className="my-3 text-center">
                <Link to="/patients/find"><Button variant="secondary">ย้อนกลับ</Button></Link>
            </div>
        </div>
    )
}
