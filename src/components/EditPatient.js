import { Loading } from "./Loading";
import DatePicker from "./DatePicker";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../contexts/AuthContext";
import { usePatient } from "../contexts/PatientContext";
import { useHistory, useParams } from "react-router-dom";
import { Card, Form, Col, Row, Button, Alert, Spinner } from "react-bootstrap";
import { patientTypes, thaiMonths, atkTestResults, sexTypes, namePrefix, smallMedia } from "../config";
import { idCardNumberValidate, phoneNumberValidate, checkDuplicate, getDiffFields, trimAllString, getAge, getCurrentYearRange } from "../helper";

export const EditPatient = () => {
    const { _id } = useParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formInputs, setFormInputs] = useState();
    const [oldPatient, setOldPatient] = useState();
    const [useValidation, setUseValidation] = useState(true);

    const { user } = useAuth();
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
        // If there is no art2 result, clear the atk2 datepicker and disable it
        if (e.target.name === "atk2_result" && e.target.value === "ไม่ได้ตรวจ") {
            setFormInputs({ ...formInputs, "atk2_result": e.target.value, "atk2_date": { date: "", month: "", year: "" } });
        } else {
            setFormVal(e.target.name, e.target.value);
        }
    }

    // Date input onChange
    const onChangeDate = dateType => e => {
        setFormVal(dateType, { ...formInputs[dateType], [e.target.name]: e.target.value });
    }

    // Copy address to current address
    function copyAddress() {
        setFormVal("current_address", formInputs.address);
    }

    // Calculate age from input date of birth
    function calculateAge() {
        setFormVal("age", getAge(formInputs.dob));
    }

    // Toggle form validation
    function toggleValidation() {
        setUseValidation(!useValidation);
    }

    // Reset the values in the form
    function handleReset() {
        setFormInputs(oldPatient);
    }

    // Handle submit
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Trim string values
        setFormInputs(trimAllString(formInputs));

        // Create a new patient object and update the values
        const newPatient = {
            ...formInputs,
            lastUpdate: new Date(),
            updatedBy: user.email
        };

        // Validation
        if (useValidation) {
            // ID Card Number validation
            const tempId = idCardNumberValidate(newPatient.id_card_number);
            if (!tempId.result) {
                setLoading(false);
                return setError(tempId.errorMessage);
            }

            // Phone Number validation
            const tempPhone = phoneNumberValidate(newPatient.phone_number);
            if (!tempPhone.result) {
                setLoading(false);
                return setError(tempPhone.errorMessage);
            }
        }

        // Checking for duplicates
        const tempDup = checkDuplicate(patients.filter(patient => patient._id !== _id), newPatient);
        if (!tempDup.result) {
            setLoading(false);
            return setError(tempDup.errorMessage);
        }

        // Do not update if there is no changes
        if (getDiffFields(oldPatient, newPatient, ["lastUpdate", "updatedBy"]).length === 0) {
            setLoading(false);
            return setError("ยกเลิกการบันทึก เนื่องจากข้อมูลไม่มีการเปลี่ยนแปลง")
        }

        // Get changed fields
        const fields = {};
        const diffFields = getDiffFields(oldPatient, newPatient, []);
        diffFields.forEach(field => fields[field] = newPatient[field]);

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
        // Populate formInputs and PatientInfo objects
        const temp = patients.filter(patient => patient._id === _id)[0];
        setOldPatient(temp);
        setFormInputs(temp);
    }, [_id, patients]);

    if (!formInputs) {
        return <Loading />
    }

    return (
        <div className="h-auto py-5 px-3">
            <h1 className="text-center mb-5">แก้ไขข้อมูลผู้ป่วย</h1>
            <div className="my-3">
                <Button variant="warning" onClick={handleReset} disabled={loading}>รีเซ็ต</Button>
            </div>
            <Card className="p-3 card-form shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Row 0 */}
                        <Row>
                            <Col>
                                <Form.Label>
                                    <span>ID:</span>
                                </Form.Label>
                                <Form.Control value={formInputs._id} disabled type="text" required />
                            </Col>
                        </Row>

                        {/* Row 1 */}
                        <Row>
                            <Col>
                                <Form.Label>
                                    <span>เลขบัตรประชาชน:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Control value={formInputs.id_card_number} onChange={onChange} name="id_card_number" type="text" required />
                            </Col>
                        </Row>

                        {/* Row 2 */}
                        <Row>
                            <Col>
                                <Form.Label>
                                    <span>ลำดับอำเภอ:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Control value={formInputs.district_number} onChange={onChange} name="district_number" min={1} type="number" autoComplete="nope" required />
                            </Col>
                            <Col>
                                <Form.Label>
                                    <span>ลำดับจังหวัด:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Control value={formInputs.province_number} onChange={onChange} name="province_number" min={1} type="number" autoComplete="nope" required />
                            </Col>
                        </Row>

                        {/* Row 3 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>เป็นผู้ป่วยในปี:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Select value={formInputs.year} onChange={onChange} name="year" required>
                                                <option defaultValue value="">เลือก</option>
                                                {getCurrentYearRange(5).map((item, index) => <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>เดือน:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Select value={formInputs.month} onChange={onChange} name="month" required>
                                                <option defaultValue value="">เลือก</option>
                                                {thaiMonths.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ลำดับเดือน:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.month_number} onChange={onChange} name="month_number" min={1} type="number" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>เป็นผู้ป่วยในปี:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Select value={formInputs.year} onChange={onChange} name="year" required>
                                            <option defaultValue value="">เลือก</option>
                                            {getCurrentYearRange(5).map((item, index) => <option value={item} key={index}>{item}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>เป็นผู้ป่วยในเดือน:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Select value={formInputs.month} onChange={onChange} name="month" required>
                                            <option defaultValue value="">เลือก</option>
                                            {thaiMonths.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ลำดับเดือน:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.month_number} onChange={onChange} name="month_number" min={1} type="number" autoComplete="nope" required />
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
                                                <span>คำนำหน้าชื่อ:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Select value={formInputs.name_prefix} onChange={onChange} name="name_prefix" required>
                                                <option defaultValue value="" >เลือก</option>
                                                {namePrefix.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ชื่อ:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.first_name} onChange={onChange} name="first_name" type="text" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>สกุล:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.last_name} onChange={onChange} name="last_name" type="text" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>คำนำหน้าชื่อ:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Select value={formInputs.name_prefix} onChange={onChange} name="name_prefix" required>
                                            <option defaultValue value="" >เลือก</option>
                                            {namePrefix.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ชื่อ:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.first_name} onChange={onChange} name="first_name" type="text" autoComplete="nope" required />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>สกุล:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.last_name} onChange={onChange} name="last_name" type="text" autoComplete="nope" required />
                                    </Col>
                                </Row>
                        }

                        {/* Row 5 */}
                        <Row>
                            <Col>
                                <Form.Label>
                                    <span>วันเกิด:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="dob" />
                            </Col>
                        </Row>

                        {/* Row 6 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>เพศ:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Select value={formInputs.sex} onChange={onChange} name="sex" required>
                                                <option defaultValue value="">เลือก</option>
                                                {sexTypes.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>อายุ:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.age} onChange={onChange} name="age" type="number" min={0} max={200} autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button className="w-100" onClick={calculateAge} disabled={formInputs.dob.date === "" || formInputs.dob.month === "" || formInputs.dob.year === ""} variant="secondary">คำนวณอายุ</Button>
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>เพศ:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Select value={formInputs.sex} onChange={onChange} name="sex" required>
                                            <option defaultValue value="">เลือก</option>
                                            {sexTypes.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>อายุ:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <div className="d-flex">
                                            <Form.Control value={formInputs.age} onChange={onChange} name="age" type="number" min={0} max={200} autoComplete="nope" required />
                                            <Button className="p-1 ms-3" onClick={calculateAge} disabled={formInputs.dob.date === "" || formInputs.dob.month === "" || formInputs.dob.year === ""} variant="secondary">คำนวณอายุ</Button>
                                        </div>
                                    </Col>
                                </Row>
                        }

                        {/* Row 7 */}
                        <Row>
                            <Col>
                                <Form.Label>
                                    <span>ที่อยู่ภูมิลำเนา:</span><span style={{ "color": "red" }}>*</span>
                                </Form.Label>
                                <Form.Control value={formInputs.address} onChange={onChange} name="address" type="text" autoComplete="nope" required />
                            </Col>
                        </Row>

                        {/* Row 8 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ที่อยู่ที่อาศัยจริง:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.current_address} onChange={onChange} name="current_address" type="text" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button className="w-100" onClick={copyAddress} variant="secondary" disabled={formInputs.address === ""}>ใช้ที่อยู่ภูมิลำเนา</Button>
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>ที่อยู่ที่อาศัยจริง:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <div className="d-flex">
                                            <Form.Control value={formInputs.current_address} onChange={onChange} name="current_address" type="text" autoComplete="nope" required />
                                            <Button className="p-1 ms-3" onClick={copyAddress} variant="secondary" disabled={formInputs.address === ""}>ใช้ที่อยู่ภูมิลำเนา</Button>
                                        </div>
                                    </Col>
                                </Row>
                        }

                        {/* Row 9 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>อาชีพ:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.occupation} onChange={onChange} name="occupation" type="text" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ที่ทำงาน:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.workplace} onChange={onChange} name="workplace" type="text" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>โทรศัพท์มือถือ:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.phone_number} onChange={onChange} name="phone_number" type="text" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>อาชีพ:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.occupation} onChange={onChange} name="occupation" type="text" autoComplete="nope" required />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ที่ทำงาน:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.workplace} onChange={onChange} name="workplace" type="text" autoComplete="nope" required />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>โทรศัพท์มือถือ:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.phone_number} onChange={onChange} name="phone_number" type="text" autoComplete="nope" required />
                                    </Col>
                                </Row>
                        }

                        {/* Row 10 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ประเภทผู้ป่วย:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Select value={formInputs.patient_type} onChange={onChange} name="patient_type" required>
                                                <option defaultValue value="">เลือก</option>
                                                {patientTypes.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>หมายเหตุ:</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.note} onChange={onChange} name="note" type="text" autoComplete="nope" />
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>ประเภทผู้ป่วย:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Select value={formInputs.patient_type} onChange={onChange} name="patient_type" required>
                                            <option defaultValue value="">เลือก</option>
                                            {patientTypes.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>หมายเหตุ:</span>
                                        </Form.Label>
                                        <Form.Control value={formInputs.note} onChange={onChange} name="note" type="text" autoComplete="nope" />
                                    </Col>
                                </Row>
                        }

                        {/* Row 11 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ตรวจแบบ ATK ครั้งที่ 1 วันที่:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="atk1_date" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ผลตรวจ:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Row>
                                                <Form.Select value={formInputs.atk1_result} onChange={onChange} name="atk1_result" required>
                                                    <option defaultValue value="">เลือก</option>
                                                    {atkTestResults.map((item, index) => item !== "ไม่ได้ตรวจ" && <option value={item} key={index}>{item}</option>)}
                                                </Form.Select>
                                            </Row>
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>ตรวจแบบ ATK ครั้งที่ 1 วันที่:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="atk1_date" />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ผลตรวจ:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Row>
                                            <Form.Select value={formInputs.atk1_result} onChange={onChange} name="atk1_result" required>
                                                <option defaultValue value="">เลือก</option>
                                                {atkTestResults.map((item, index) => item !== "ไม่ได้ตรวจ" && <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Row>
                                    </Col>
                                </Row>
                        }

                        {/* Row 12 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ตรวจแบบ ATK ครั้งที่ 2 วันที่:</span>{formInputs.atk2_result !== "ไม่ได้ตรวจ" && <span style={{ "color": "red" }}>*</span>}
                                            </Form.Label>
                                            <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="atk2_date" required={formInputs.atk2_result !== "ไม่ได้ตรวจ"} disabled={formInputs.atk2_result === "ไม่ได้ตรวจ"} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ผลตรวจ:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Row>
                                                <Form.Select value={formInputs.atk2_result} onChange={onChange} name="atk2_result" required>
                                                    <option defaultValue value="">เลือก</option>
                                                    {atkTestResults.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                                </Form.Select>
                                            </Row>
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>ตรวจแบบ ATK ครั้งที่ 2 วันที่:</span>{formInputs.atk2_result !== "ไม่ได้ตรวจ" && <span style={{ "color": "red" }}>*</span>}
                                        </Form.Label>
                                        <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="atk2_date" required={formInputs.atk2_result !== "ไม่ได้ตรวจ"} disabled={formInputs.atk2_result === "ไม่ได้ตรวจ"} />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ผลตรวจ:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Row>
                                            <Form.Select value={formInputs.atk2_result} onChange={onChange} name="atk2_result" required>
                                                <option defaultValue value="">เลือก</option>
                                                {atkTestResults.map((item, index) => <option value={item} key={index}>{item}</option>)}
                                            </Form.Select>
                                        </Row>
                                    </Col>
                                </Row>
                        }

                        {/* Row 13 */}
                        {
                            isSmall ?
                                <>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ตรวจแบบ PCR พบผลบวกวันที่:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="pcrDate" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>
                                                <span>ค่า Ct ผลตรวจ PCR:</span><span style={{ "color": "red" }}>*</span>
                                            </Form.Label>
                                            <Form.Control value={formInputs.pcr_ct} onChange={onChange} name="pcr_ct" type="number" autoComplete="nope" required />
                                        </Col>
                                    </Row>
                                </>
                                :
                                <Row>
                                    <Col>
                                        <Form.Label>
                                            <span>ตรวจแบบ PCR พบผลบวกวันที่:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <DatePicker formInputs={formInputs} onChangeDate={onChangeDate} dateType="pcrDate" />
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <span>ค่า Ct ผลตรวจ PCR:</span><span style={{ "color": "red" }}>*</span>
                                        </Form.Label>
                                        <Form.Control className="my-2" value={formInputs.pcr_ct} onChange={onChange} name="pcr_ct" type="number" autoComplete="nope" required />
                                    </Col>
                                </Row>
                        }

                        {/* Toggle validation */}
                        <Form.Check className="d-flex justify-content-center my-3" type="switch" id="validation-switch" label="ตรวจสอบข้อมูลอัตโนมัติ" checked={useValidation} onChange={toggleValidation} />

                        {/* Error message */}
                        <div className="mt-3">
                            {error && <Alert variant="danger">{error}</Alert>}
                        </div>

                        <div className="text-center">
                            <Button variant="success" type="submit" disabled={loading} className="mx-0">
                                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "บันทึก"}
                            </Button>
                            <Link to="/patients/manage">
                                <Button className={isSmall ? "" : "ms-3"} variant="danger" disabled={loading}>ยกเลิก</Button>
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div >
    )
}
