import { thaiMonths } from "../config";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentYearRange } from "../helper";
import { usePatient } from "../contexts/PatientContext";
import { Card, Button, Form, Row, Col, Table, Pagination } from "react-bootstrap";

const buildPatientTable = patients => {
    return <Table bordered hover responsive>
        <thead className="text-center">
            <tr className="table-dark">
                <th>เลขบัตรประชาชน</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>ลำดับจังหวัด</th>
                <th>ลำดับอำเภอ</th>
                <th>ลำดับเดือน</th>
                <th>ตัวเลือก</th>
            </tr>
        </thead>
        <tbody>
            {
                patients.map(patient => {
                    return (
                        <tr key={patient._id}>
                            <td>{patient.id_card_number}</td>
                            <td>{patient.first_name}</td>
                            <td>{patient.last_name}</td>
                            <td>{patient.province_number}</td>
                            <td>{patient.district_number}</td>
                            <td>{`${patient.month} ${patient.month_number}`}</td>
                            <td className="text-center"><Link to={`/patients/info/${patient._id}`}><Button className="p-0 h-100" variant="primary" style={{ fontSize: "20px" }}>ข้อมูลผู้ป่วย</Button></Link></td>
                        </tr>
                    )
                })
            }
        </tbody>
    </Table>
};

const PatientPagination = ({ patients }) => {
    // Current page (start at 1)
    const [currPage, setCurrPage] = useState(1);

    // Patients count
    const patientCnt = patients.length;
    if (patientCnt <= 0)
        return <h2 className="text-center my-3">ไม่มีข้อมูล</h2>

    // Patients per page
    const patientPerPage = 10;
    // Pages count
    const pageCnt = patientCnt % 10 === 0 ? Math.floor(patientCnt / 10) : Math.floor(patientCnt / 10) + 1;

    function toPreviousPage() {
        if (currPage === 1) return;
        setCurrPage(currPage - 1);
    }

    function toNextPage() {
        if (currPage === pageCnt) return;
        setCurrPage(currPage + 1);
    }

    function toFirstPage() {
        setCurrPage(1);
    }

    function toLastPage() {
        setCurrPage(pageCnt);
    }

    // Get patients in the current page
    let lowerBound = (currPage - 1) * patientPerPage + 1;
    let upperBound = currPage * patientPerPage;
    const currPatients = patients.slice(lowerBound - 1, upperBound);

    return (
        <>
            <Pagination className="justify-content-center user-select-none">
                <Pagination.First onClick={toFirstPage} />
                <Pagination.Prev onClick={toPreviousPage} />
                <Pagination.Item>
                    {currPage}
                </Pagination.Item>
                <Pagination.Next onClick={toNextPage} />
                <Pagination.Last onClick={toLastPage} />
            </Pagination>
            {buildPatientTable(currPatients)}
        </>
    )
}

export const FindPatient = () => {
    const [foundPatients, setFoundPatients] = useState([]);
    const { patients } = usePatient();
    const [formInputs, setFormInputs] = useState({
        year: "",
        month: "",
        number: "",
        searchOption: ""
    });

    function onChange(e) {
        if (e.target.name === "searchOption") {
            setFormInputs({ year: "", month: "", number: "", searchOption: e.target.value });
            setFoundPatients(patients);
        } else if (e.target.name === "year") {
            setFormInputs({ ...formInputs, month: "", number: "", year: e.target.value });
            setFoundPatients(patients.filter(patient => patient.year === e.target.value));
        } else if (e.target.name === "month") {
            setFormInputs({ ...formInputs, number: "", month: e.target.value });
            setFoundPatients(patients.filter(patient => patient.month === e.target.value));
        } else if (e.target.name === "number") {
            setFormInputs({ ...formInputs, number: e.target.value });
            if (formInputs.searchOption === "month_number") {
                setFoundPatients(patients.filter(patient =>
                    patient.year === formInputs.year                                // Filter year
                    && patient.month === formInputs.month                           // Filter month
                    && patient[formInputs.searchOption].includes(e.target.value))   // Filter month number
                );
            } else {
                setFoundPatients(patients.filter(patient => patient[formInputs.searchOption].includes(e.target.value)));
            }
        }
    }

    useEffect(() => {
        setFoundPatients(patients);
    }, [patients]);

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center mb-5">ค้นหาผู้ป่วย</h1>
            {/* Form */}
            {
                patients.length > 0 &&
                <Card className="p-3 mb-3 card-form shadow-sm">
                    <Card.Body>
                        {/* Search options selector */}
                        <Form className="text-end">
                            <Row>
                                <Col className="form-label" sm="5">
                                    <span>ค้นหาด้วย:</span>
                                </Col>
                                <Col sm={3}>
                                    <Form.Select value={formInputs.searchOption} onChange={onChange} title="searchOptionSelect" name="searchOption" disabled={patients.length === 0}>
                                        <option defaultValue value="">ตัวเลือก</option>
                                        <option defaultValue value="id_card_number">เลขบัตรประจำตัวประชาชน</option>
                                        <option defaultValue value="district_number">ลำดับของอำเภอ</option>
                                        <option defaultValue value="province_number">ลำดับของจังหวัด</option>
                                        <option defaultValue value="month_number">ลำดับของเดือน</option>
                                    </Form.Select>
                                </Col>
                            </Row>

                            {/* Year and month selector */}
                            {
                                formInputs.searchOption === "month_number" &&
                                <>
                                    <Row>
                                        <Col md={{ span: 3, offset: 5 }}>
                                            <Form.Select value={formInputs.year} onChange={onChange} name="year" disabled={patients.length === 0}>
                                                <option defaultValue value="">เลือกปี</option>
                                                {getCurrentYearRange(5).map((item, index) => <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ span: 3, offset: 5 }}>
                                            <Form.Select value={formInputs.month} onChange={onChange} name="month" disabled={patients.length === 0 || formInputs.year === ""}>
                                                <option defaultValue value="">เลือกเดือน</option>
                                                {thaiMonths.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </>
                            }

                            {/* Number input */}
                            {
                                formInputs.searchOption !== "" &&
                                <Row>
                                    <Col md={{ span: 3, offset: 5 }}>
                                        <Form.Control
                                            style={{ height: "3rem" }}
                                            value={formInputs.number}
                                            onChange={onChange}
                                            name="number"
                                            type="number"
                                            placeholder={formInputs.searchOption === "id_card_number" ? "เลขบัตรประชาชน" : "ลำดับ"}
                                            disabled={patients.length === 0 || (formInputs.searchOption === "month_number" && (formInputs.month === "" || formInputs.year === ""))} />
                                    </Col>
                                </Row>
                            }
                        </Form>
                    </Card.Body>
                </Card>
            }

            {/* Tables */}
            <Card className="p-3 card-form shadow-sm">
                <Card.Body>
                    <PatientPagination patients={foundPatients} />
                </Card.Body>
            </Card>
            <div className="my-3 text-center">
                <Link to="/patients/manage"><Button variant="secondary">ย้อนกลับ</Button></Link>
            </div>
        </div >
    )
}
