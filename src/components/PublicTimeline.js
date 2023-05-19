import { useState } from "react";
import { getCurrentYearRange } from "../helper";
import { useMediaQuery } from "react-responsive";
import { smallMedia, thaiMonths } from "../config";
import { usePublicPatient } from "../contexts/PublicPatientContext";
import { Card, Button, Form, Row, Col, Table, Alert, ListGroup } from "react-bootstrap";

function buildTimline(timeline_entries) {
    return timeline_entries.map((timeline, index) => {
        return (
            <tr key={index}>
                <td className="text-center" style={{ whiteSpace: "pre" }}>
                    {
                        timeline.date_type === "1" ?
                            `${timeline.date_begin.date} ${timeline.date_begin.month} ${timeline.date_begin.year}`
                            :
                            <>
                                <div>{`จาก: ${timeline.date_begin.date} ${timeline.date_begin.month} ${timeline.date_begin.year}`}</div>
                                <div>{`ถึง: ${timeline.date_end.date} ${timeline.date_end.month} ${timeline.date_end.year}`}</div>
                            </>
                    }
                </td>
                <td className="text-start" style={{ whiteSpace: "pre-wrap" }}>{timeline.activity}</td>
            </tr>
        )
    })
}

function buildSmallTimeline(timeline_entries) {
    return timeline_entries.map((timeline, index) => {
        return (
            <ListGroup.Item key={index} className="text-start">
                <div style={{ fontWeight: "900" }}>
                    {
                        timeline.date_type === "1" ?
                            `${timeline.date_begin.date} ${timeline.date_begin.month} ${timeline.date_begin.year}`
                            :
                            <>
                                <div>{`จาก: ${timeline.date_begin.date} ${timeline.date_begin.month} ${timeline.date_begin.year}`}</div>
                                <div>{`ถึง: ${timeline.date_end.date} ${timeline.date_end.month} ${timeline.date_end.year}`}</div>
                            </>
                    }
                </div>
                <div>
                    {timeline.activity}
                </div>
            </ListGroup.Item>
        )
    })
}

export const PublicTimeline = () => {
    const [error, setError] = useState(false);
    const [patient, setPatient] = useState(false);
    const [formInputs, setFormInputs] = useState({
        number: "",
        searchOption: "",
        month: "",
        year: ""
    });

    const { publicPatients } = usePublicPatient();

    // Media query
    const isSmall = useMediaQuery(smallMedia);

    // Input onChange
    function onChange(e) {
        if (e.target.name === "searchOption") {
            setFormInputs({ year: "", month: "", number: "", searchOption: e.target.value });
        } else if (e.target.name === "year") {
            setFormInputs({ ...formInputs, month: "", number: "", year: e.target.value });
        } else if (e.target.name === "month") {
            setFormInputs({ ...formInputs, number: "", month: e.target.value });
        } else if (e.target.name === "number") {
            setFormInputs({ ...formInputs, number: e.target.value });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        setPatient(false);
        setError(false);

        // Form validation
        // All fields must be filled
        if (formInputs.searchOption === "" || formInputs.number === "")
            return setError("กรุณากรอกข้อมูลให้ครบถ้วน");
        // All values must be in valid ranges
        if (parseInt(formInputs.number) < 1)
            return setError("ลำดับของผู้ป่วยต้องมากกว่า 0");

        // Find the patient in publicPatients array
        let foundPatients = [];
        if (formInputs.searchOption === "month_number") {
            foundPatients = publicPatients.filter(patient =>
                patient.year === formInputs.year
                && patient.month === formInputs.month
                && patient[formInputs.searchOption] === formInputs.number
            );
        } else {
            foundPatients = publicPatients.filter(patient => patient[formInputs.searchOption] === formInputs.number);
        }

        // Check duplicates (For debugging purposes)
        if (foundPatients.length > 1)
            console.log("Found duplicate data!");

        // If found, display the timeline, if not found, display a meesage
        if (foundPatients.length < 1)
            return setError("ไม่พบผู้ป่วยที่มีลำดับดังกล่าว");
        const patient = foundPatients[0];

        // Check if the timeline array of the patient is empty
        if (patient.timeline_entries.length === 0)
            return setError("ผู้ป่วยดังกล่าวไม่มีข้อมูล Timeline")

        // Set the patient
        setPatient(patient);
    }

    return (
        <Card className="text-center my-3 shadow-sm">
            <Card.Body>
                <div className="rounded bg-warning p-2">
                    <h2 className="m-0">เลือกดูไทม์ไลน์ผู้ป่วยยืนยันของอำเภอโกสุมพิสัย</h2>
                </div>
                <div className="my-3">
                    <h5 className="m-0">ระบุลำดับของผู้ป่วยที่ต้องการค้นหา</h5>
                </div>

                {/* Input form */}
                <Form className="text-end my-3" onSubmit={handleSubmit}>
                    <Row>
                        <Col md={{ span: 4, offset: 4 }}>
                            <Form.Select value={formInputs.searchOption} onChange={onChange} name="searchOption">
                                <option defaultValue value="">เลือกลำดับ</option>
                                <option defaultValue value="district_number">ลำดับอำเภอ</option>
                                <option defaultValue value="province_number">ลำดับจังหวัด</option>
                                <option defaultValue value="month_number">ลำดับเดือน</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* Year and month selector */}
                    {
                        formInputs.searchOption === "month_number" &&
                        <>
                            <Row>
                                <Col md={{ span: 4, offset: 4 }}>
                                    <Form.Select value={formInputs.year} onChange={onChange} name="year">
                                        <option defaultValue value="">เลือกปี</option>
                                        {getCurrentYearRange(5).map((item, index) => <option value={item} key={index}>{item}</option>)}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={{ span: 4, offset: 4 }}>
                                    <Form.Select value={formInputs.month} onChange={onChange} name="month" disabled={formInputs.year === ""}>
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
                            <Col md={{ span: 4, offset: 4 }}>
                                <Form.Control
                                    value={formInputs.number}
                                    onChange={onChange}
                                    name="number"
                                    type="number"
                                    placeholder="ใส่ลำดับ"
                                    disabled={formInputs.searchOption === "month_number" && (formInputs.month === "" || formInputs.year === "")}
                                />
                            </Col>
                        </Row>
                    }

                    <Row>
                        <Col md={{ span: 4, offset: 4 }}>
                            <div className="text-center">
                                <Button className="w-100" variant="primary" type="submit">ค้นหา</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>

                {/* Display timeline */}
                {
                    isSmall ? <>
                        {
                            patient &&
                            <ListGroup variant="flush">
                                {patient && buildSmallTimeline(patient.timeline_entries)}
                            </ListGroup>
                        }
                    </> : <>
                        {
                            patient &&
                            <Table className="my-3 mx-auto" striped bordered hover responsive style={{ maxWidth: "45rem", fontSize: "1.2rem" }}>
                                <thead>
                                    <tr className="table-dark">
                                        <th style={{ width: "15rem" }}>วันที่</th>
                                        <th>รายละเอียดการเดินทาง</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patient && buildTimline(patient.timeline_entries)}
                                </tbody>
                            </Table>
                        }
                    </>
                }

                {/* Error message */}
                {error && <Alert className="m-0" variant="danger">{error}</Alert>}
            </Card.Body>
        </Card>
    )
}
