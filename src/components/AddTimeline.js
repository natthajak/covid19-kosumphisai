import { nanoid } from "nanoid";
import { Loading } from "./Loading";
import DatePicker from "./DatePicker";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../contexts/AuthContext";
import { PatientInfoBrief } from "./PatientInfoBrief";
import { usePatient } from "../contexts/PatientContext";
import { timelinePlaceholder, smallMedia } from "../config";
import { Link, useParams, useHistory } from "react-router-dom";
import { sortTimelinesByDate, trimAllString } from "../helper";
import { Card, Button, Alert, Form, Col, Row, Spinner } from "react-bootstrap";

export const AddTimeline = () => {
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState();
    const [error, setError] = useState("");
    const [formInputs, setFormInputs] = useState(timelinePlaceholder);

    const { user } = useAuth();
    const { _id } = useParams();
    const history = useHistory();
    const { patients, updatePatient } = usePatient();

    // Media query
    const isSmall = useMediaQuery(smallMedia);

    // Help setting formInputs
    function setFormVal(key, val) {
        setFormInputs({ ...formInputs, [key]: val });
    }

    // Input onChange
    function onChange(e) {
        setFormVal(e.target.name, e.target.value);
    }

    // Date input onChange
    const onChangeDate = dateType => e => {
        setFormVal(dateType, { ...formInputs[dateType], [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Trim string values
        setFormInputs(trimAllString(formInputs));

        // Create a new timeline object and populate the values
        const newTimeline = { ...formInputs, timeline_id: nanoid() };

        // Create a new timeline_entries array
        const newTimelineEntries = sortTimelinesByDate([...patient.timeline_entries, newTimeline]);

        // Create a fields array that will be used to update the values
        const fields = {
            lastUpdate: new Date(),
            updatedBy: user.email,
            timeline_entries: newTimelineEntries
        }

        // Update the patient
        try {
            await updatePatient(_id, fields);
            return history.push(`/patients/timelines/info/${_id}`);
        } catch (error) {
            setLoading(false);
            console.log(error);
            return setError("มีข้อผิดพลาดเกิดขึ้นในขณะอัพเดตข้อมูล");
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
            <h1 className="text-center mb-5">เพิ่ม Timelines</h1>
            <h2 className="text-center mb-5">{`${patient.name_prefix} ${patient.first_name} ${patient.last_name}`}</h2>
            <PatientInfoBrief patient={patient} />
            <Card className="p-3 mt-3 card-form shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Row 1 */}
                        <Row>
                            <Col md={12} lg={4}>
                                <Form.Label>
                                    <span>ช่วงเวลา:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Select value={formInputs.date_type} onChange={onChange} name="date_type" required>
                                    <option defaultValue value="1">1 วัน</option>
                                    <option value="2">มากกว่า 1 วัน</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* Row 2 */}
                        <Row>
                            <Col md={12} lg={4}>
                                <Form.Label>
                                    <span>{formInputs.date_type === "1" ? "วันที่:" : "จากวันที่:"}</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="date_begin" />
                            </Col>
                        </Row>

                        {/* Row 3 */}
                        {
                            formInputs.date_type === "2" &&
                            <>
                                {/* Row 5.1 */}
                                <Row>
                                    <Col md={12} lg={4}>
                                        <Form.Label>
                                            <span>ถึงวันที่:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="date_end" />
                                    </Col>
                                </Row>
                            </>
                        }

                        {/* Row 6 */}
                        <Row>
                            <Col>
                                <Form.Label>
                                    <span>รายละเอียดการเดินทาง:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Control className="p-2" value={formInputs.activity} onChange={onChange} name="activity" as="textarea" style={{ height: "10rem", whiteSpace: "pre" }} />
                            </Col>
                        </Row>

                        <div className="mt-3">
                            {error && <Alert variant="danger">{error}</Alert>}
                        </div>

                        <div className="pt-3 text-center">
                            <Button variant="success" type="submit" disabled={loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "บันทึก"}
                            </Button>
                            <Link to={`/patients/timelines/info/${_id}`}>
                                <Button className={isSmall ? "" : "ms-3"} variant="danger" disabled={loading}>ยกเลิก</Button>
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div >
    )
}
