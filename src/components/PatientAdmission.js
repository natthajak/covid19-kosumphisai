import { Loading } from "./Loading";
import DatePicker from "./DatePicker";
import { getDiffFields } from "../helper";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../contexts/AuthContext";
import { PatientInfoBrief } from "./PatientInfoBrief";
import { usePatient } from "../contexts/PatientContext";
import { firstTreatmentList, smallMedia } from "../config";
import { Link, useParams, useHistory } from "react-router-dom";
import { Card, Button, Alert, Form, Col, Row, Spinner } from "react-bootstrap";

export const PatientAdmission = () => {
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState();
    const [error, setError] = useState("");
    const [oldAdmission, setOldAdmission] = useState();
    const [formInputs, setFormInputs] = useState();

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

    function handleReset() {
        setFormInputs(oldAdmission);
    }

    async function handleDelete() {
        setLoading(true);
        setError("");

        // Create fields object used for updating
        const fields = {
            admission: {
                admission_date: { date: "", month: "", year: "" },
                first_treatment: ""
            },
            lastUpdate: new Date(),
            updatedBy: user.email,
        };

        // Update the patient
        try {
            await updatePatient(_id, fields);
            return history.push(`/patients/info/${_id}`);
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

        // Create new admission object
        const newAdmission = formInputs;

        // Do not update if there is no changes
        if (getDiffFields(oldAdmission, newAdmission, []).length === 0) {
            setLoading(false);
            return setError("ยกเลิกการบันทึก เนื่องจากข้อมูลไม่มีการเปลี่ยนแปลง")
        }

        // Create fields object used for updating
        const fields = {
            admission: newAdmission,
            lastUpdate: new Date(),
            updatedBy: user.email,
        };

        // Update the patient
        try {
            await updatePatient(_id, fields);
            return history.push(`/patients/info/${_id}`);
        } catch (error) {
            setLoading(false);
            console.log(error);
            return setError("มีข้อผิดพลาดเกิดขึ้นในขณะอัพเดตข้อมูล");
        }
    }

    useEffect(() => {
        const tempPatient = patients.filter(patient => patient._id === _id)[0];
        setOldAdmission(tempPatient.admission);
        setFormInputs(tempPatient.admission);
        setPatient(tempPatient);
    }, [_id, patients]);

    if (!patient) {
        return <Loading />
    }

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center mb-5">บันทึกรับการรักษา</h1>
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
                        <Row className="justify-content-center">
                            <Col md={12} lg={4}>
                                <Form.Label>
                                    <span>วันรับผู้ป่วย:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="admission_date" />
                            </Col>
                        </Row>

                        {/* Row 2 */}
                        <Row className="justify-content-center">
                            <Col md={12} lg={4}>
                                <Form.Label>
                                    <span>สถานที่รับรักษาครั้งแรก:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Select value={formInputs.first_treatment} onChange={onChange} name="first_treatment" required>
                                    <option defaultValue value="">เลือก</option>
                                    {firstTreatmentList.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* Error message */}
                        <Row className="justify-content-center">
                            <Col md={12} lg={4}>
                                <div className="mt-3">
                                    {error && <Alert variant="danger">{error}</Alert>}
                                </div>
                            </Col>
                        </Row>

                        <div className="text-center">
                            <Button variant="success" type="submit" disabled={loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "บันทึก"}
                            </Button>
                            <Link to={`/patients/info/${_id}`}>
                                <Button className={isSmall ? "" : "ms-3"} variant="danger" disabled={loading}>ยกเลิก</Button>
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}
