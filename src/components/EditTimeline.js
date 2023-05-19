import { Loading } from "./Loading";
import DatePicker from "./DatePicker";
import { smallMedia } from "../config";
import { getDiffFields } from "../helper";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../contexts/AuthContext";
import { PatientInfoBrief } from "./PatientInfoBrief";
import { usePatient } from "../contexts/PatientContext";
import { sortTimelinesByDate, trimAllString } from "../helper";
import { Link, useParams, useHistory } from "react-router-dom";
import { Card, Button, Alert, Form, Col, Row, Spinner } from "react-bootstrap";

export const EditTimeline = () => {
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState();
    const [error, setError] = useState("");
    const [oldTimeline, setOldTimeline] = useState();
    const [formInputs, setFormInputs] = useState();

    const { user } = useAuth();
    const { _id, _timeline_id } = useParams();
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

    // Reset the values in the form
    function handleReset() {
        setFormInputs(oldTimeline);
    }

    async function handleDelete() {
        setLoading(true);
        setError("");

        // Filter the timeline entries array
        const newTimelineEntries = patient.timeline_entries.filter(entry => entry.timeline_id !== _timeline_id);

        try {
            await updatePatient(_id, { timeline_entries: newTimelineEntries });
            return history.push(`/patients/timelines/info/${_id}`);
        } catch (error) {
            setLoading(false);
            console.log(error);
            return setError("มีข้อผิดพลาดเกิดขึ้นในขณะอัพเดตข้อมูล");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Trim string values
        setFormInputs(trimAllString(formInputs));

        // Create a new timeline object and populate the values
        const newTimeline = formInputs;

        // If the date_type change from "2" to "1", then reset the date_end value
        if (oldTimeline.date_type === "2" && newTimeline.date_type === "1") {
            newTimeline.date_end = { date: "", month: "", year: "" };
        }

        // Do not update if there is no changes
        if (getDiffFields(oldTimeline, newTimeline, []).length === 0) {
            setLoading(false);
            return setError("ยกเลิกการบันทึก เนื่องจากข้อมูลไม่มีการเปลี่ยนแปลง")
        }

        // Create a new timeline_entries and update it
        const tempArray = patient.timeline_entries.map(timeline => timeline.timeline_id === _timeline_id ? newTimeline : timeline);
        const newTimelineEntries = sortTimelinesByDate(tempArray);

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
        const tempPatient = patients.filter(patient => patient._id === _id)[0];
        const tempTimeline = tempPatient.timeline_entries.find(timeline => timeline.timeline_id === _timeline_id);
        setPatient(tempPatient);
        setOldTimeline(tempTimeline);
        setFormInputs(tempTimeline);
    }, [_id, _timeline_id, patients]);

    if (!patient || !formInputs) {
        return <Loading />
    }

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center mb-5">แก้ไข Timelines</h1>
            <h2 className="text-center mb-5">{`${patient.name_prefix} ${patient.first_name} ${patient.last_name}`}</h2>
            <PatientInfoBrief patient={patient} />
            <div className="my-3">
                <Button variant="warning" onClick={handleReset} disabled={loading}>รีเซ็ต</Button>
                <Button className={isSmall ? "" : "ms-3"} variant="danger" onClick={handleDelete} disabled={loading}>ลบ</Button>
            </div>
            <Card className="p-3 card-form shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Row 1 */}
                        <Row>
                            <Col sm={4}>
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
                                <Row>
                                    {/* Row 3.1 */}
                                    <Col md={12} lg={4}>
                                        <Form.Label>
                                            <span>ถึงวันที่:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="date_end" />
                                    </Col>
                                </Row>
                            </>
                        }

                        {/* Row 4 */}
                        <Row>
                            <Col>
                                <Form.Label>
                                    <span>รายละเอียดการเดินทาง:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Control value={formInputs.activity} onChange={onChange} name="activity" as="textarea" style={{ height: "10rem", whiteSpace: "pre" }} />
                            </Col>
                        </Row>

                        <div className="mt-3">
                            {error && <Alert variant="danger">{error}</Alert>}
                        </div>

                        <div className="text-center">
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
        </div>
    )
}
