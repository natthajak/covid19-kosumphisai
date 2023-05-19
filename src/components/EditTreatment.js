import { Loading } from "./Loading";
import DatePicker from "./DatePicker";
import { getDiffFields } from "../helper";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../contexts/AuthContext";
import { PatientInfoBrief } from "./PatientInfoBrief";
import { usePatient } from "../contexts/PatientContext";
import { Link, useParams, useHistory } from "react-router-dom";
import { sortTreatmentsByDate, trimAllString } from "../helper";
import { treatmentTypes, treatmentAssessments, smallMedia } from "../config";
import { Card, Button, Alert, Form, Col, Row, Spinner } from "react-bootstrap";

export const EditTreatment = () => {
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState();
    const [error, setError] = useState("");
    const [oldTreatment, setOldTreatment] = useState();
    const [formInputs, setFormInputs] = useState();

    const { user } = useAuth();
    const { _id, _treatmentId } = useParams();
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
        setFormInputs(oldTreatment);
    }

    async function handleDelete() {
        setLoading(true);
        setError("");

        // Filter the treatment entries array
        const newTreatmentEntries = patient.treatment_entries.filter(entry => entry.treatmentId !== _treatmentId);

        try {
            await updatePatient(_id, { treatment_entries: newTreatmentEntries });
            return history.push(`/patients/treatments/info/${_id}`);
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

        // Create a new treatment object and populate the values
        const newTreatment = formInputs;

        // Do not update if there is no changes
        if (getDiffFields(oldTreatment, newTreatment, []).length === 0) {
            setLoading(false);
            return setError("ยกเลิกการบันทึก เนื่องจากข้อมูลไม่มีการเปลี่ยนแปลง")
        }

        // Create a new treatment_entries and update it
        const tempArray = patient.treatment_entries.map(treatment => treatment.treatmentId === _treatmentId ? newTreatment : treatment);
        const newTreatmentEntries = sortTreatmentsByDate(tempArray);

        // Create a fields array that will be used to update the values
        const fields = {
            lastUpdate: new Date(),
            updatedBy: user.email,
            treatment_entries: newTreatmentEntries
        }

        // Update the patient
        try {
            await updatePatient(_id, fields);
            return history.push(`/patients/treatments/info/${_id}`);
        } catch (error) {
            setLoading(false);
            console.log(error);
            return setError("มีข้อผิดพลาดเกิดขึ้นในขณะอัพเดตข้อมูล");
        }
    }

    useEffect(() => {
        const tempPatient = patients.filter(patient => patient._id === _id)[0];
        const tempTreatment = tempPatient.treatment_entries.find(treatment => treatment.treatmentId === _treatmentId);
        setPatient(tempPatient);
        setOldTreatment(tempTreatment);
        setFormInputs(tempTreatment);
    }, [_id, _treatmentId, patients]);

    if (!patient || !formInputs) {
        return <Loading />
    }

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center mb-5">แก้ไขรายการการดูแล</h1>
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
                            <Col md={12} lg={4}>
                                <Form.Label>
                                    <span>วันที่:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="treatment_date" />
                            </Col>
                        </Row>

                        {/* Row 2 */}
                        <Row>
                            <Col md={12} lg={4}>
                                <Form.Label>
                                    <span>ประเภทการดูแล:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Select value={formInputs.treatment_type} onChange={onChange} name="treatment_type" required>
                                    <option defaultValue value="">เลือก</option>
                                    {treatmentTypes.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* Row 3 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>อุณหภูมิ (T):</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control className={formInputs.temperature >= 37.5 ? "text-danger" : ""} value={formInputs.temperature} onChange={onChange} name="temperature" type="number" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ชีพจร (P):</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.pulse} onChange={onChange} name="pulse" type="number" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>อัตราหายใจ (R):</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control className={formInputs.heart_rate >= 24 ? "text-danger" : ""} value={formInputs.heart_rate} onChange={onChange} name="heart_rate" type="number" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>อุณหภูมิ (T):</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control className={formInputs.temperature >= 37.5 ? "text-danger" : ""} value={formInputs.temperature} onChange={onChange} name="temperature" type="number" autoComplete="nope" required />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ชีพจร (P):</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.pulse} onChange={onChange} name="pulse" type="number" autoComplete="nope" required />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>อัตราหายใจ (R):</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control className={formInputs.heart_rate >= 24 ? "text-danger" : ""} value={formInputs.heart_rate} onChange={onChange} name="heart_rate" type="number" autoComplete="nope" required />
                                    </Col>
                                </Row>
                        }

                        {/* Row 4 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ความดันโลหิตค่าบน:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.top_blood_pressure} onChange={onChange} name="top_blood_pressure" type="number" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ความดันโลหิตค่าล่าง:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.bottom_blood_pressure} onChange={onChange} name="bottom_blood_pressure" type="number" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ค่าออกซิเจนในเลือด:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.oxygen_level} onChange={onChange} name="oxygen_level" type="number" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>ความดันโลหิตค่าบน:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.top_blood_pressure} onChange={onChange} name="top_blood_pressure" type="number" autoComplete="nope" required />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ความดันโลหิตค่าล่าง:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.bottom_blood_pressure} onChange={onChange} name="bottom_blood_pressure" type="number" autoComplete="nope" required />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ค่าออกซิเจนในเลือด:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.oxygen_level} onChange={onChange} name="oxygen_level" type="number" autoComplete="nope" required />
                                    </Col>
                                </Row>
                        }

                        {/* Row 9 */}
                        <Row>
                            <Col md={12} lg={4}>
                                <Form.Label>
                                    <span>การประเมินผลการดูแล:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Select value={formInputs.assessment} onChange={onChange} name="assessment" required>
                                    <option defaultValue value="">เลือก</option>
                                    {treatmentAssessments.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* Row 6 */}
                        <Row>
                            <Col>
                                <Form.Label>
                                    <span>หมายเหตุ:</span>
                                </Form.Label>
                                <Col className="ps-0">
                                    <Form.Control value={formInputs.note} onChange={onChange} name="note" type="text" autoComplete="nope" />
                                </Col>
                            </Col>
                        </Row>

                        <div className="mt-3">
                            {error && <Alert variant="danger">{error}</Alert>}
                        </div>

                        <div className="text-center">
                            <Button variant="success" type="submit" disabled={loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "บันทึก"}
                            </Button>
                            <Link to={`/patients/treatments/info/${_id}`}>
                                <Button className={isSmall ? "" : "ms-3"} variant="danger" disabled={loading}>ยกเลิก</Button>
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}
