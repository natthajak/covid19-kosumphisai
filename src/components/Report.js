import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { smallMedia, thaiMonths } from "../config";
import { usePatient } from "../contexts/PatientContext";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { sortPatientByDate, toStringDate, getCurrentYearRange } from "../helper";

// A function used for downloading a .xlsx file
async function downloadReport(workbook, filename) {
    const buffer = await workbook.xlsx.writeBuffer();
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const fileExtension = ".xlsx";
    const blob = new Blob([buffer], { type: fileType });
    saveAs(blob, filename + fileExtension);
}

const Report1 = ({ patients, isSmall }) => {
    const [message, setMessage] = useState(false);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    function buildReport1() {
        setMessage(false);

        // Create report 1: "ข้อมูลทั่วไปของผู้ติดเชื้อ"
        const workbook1 = new ExcelJS.Workbook();
        const worksheet1 = workbook1.addWorksheet("report1", {
            headerFooter: { firstHeader: "รายงานที่ 1 จัดเก็บข้อมูลทั่วไปของผู้ป่วยโควิด 19 อำเภอโกสุมพิสัยในเดือน" + selectedMonth + " ปี พ.ศ." + selectedYear }, pageSetup: { paperSize: 9 }
        });

        // Get data according to given inputs
        const selectedPatients = patients.filter(patient => patient.year === selectedYear && patient.month === selectedMonth);

        // Check if the array is empty
        if (selectedPatients.length === 0) {
            return setMessage("ไม่มีข้อมูล");
        }

        // Set table headers
        worksheet1.columns = [
            { header: "Code", key: "code", width: 25 },
            { header: "CID (เลขบัตรประชาชน 13 หลัก)", key: "cid", width: 18 },
            { header: "ลำดับของอำเภอ", key: "dist", width: 5 },
            { header: "ลำดับของจังหวัด", key: "prov", width: 5 },
            { header: "ลำดับของเดือน" + selectedMonth, key: "month", width: 5 },
            { header: "คำนำหน้า-ชื่อ-สกุล", key: "name", width: 20 },
            { header: "เพศ", key: "sex", width: 7 },
            { header: "วันเกิด", key: "dob", width: 15 },
            { header: "อายุ", key: "age", width: 5 },
            { header: "ที่อยู่ภูมิลำเนา", key: "addr", width: 20 },
            { header: "ที่อยู่ภูมิลำเนาจริงก่อนเดินทางกลับ", key: "prevaddr", width: 20 },
            { header: "อาชีพ", key: "occup", width: 10 },
            { header: "ที่ทำงาน", key: "workaddr", width: 15 },
            { header: "ตรวจแบบ ATK ครั้งที่ 1 วันที่", key: "atk1", width: 15 },
            { header: "ผลตรวจ ATK ครั้งที่ 1", key: "ratk1", width: 15 },
            { header: "ตรวจแบบ ATK ครั้งที่ 2 วันที่", key: "atk2", width: 15 },
            { header: "ผลตรวจ ATK ครั้งที่ 2", key: "ratk2", width: 15 },
            { header: "ตรวจแบบ PCR พบผลบวกวันที่", key: "pcr", width: 15 },
            { header: "ค่า Ct ผลตรวจ PCR", key: "ct", width: 5 }
        ];

        // Set table rows: Each patient of the selected month
        selectedPatients.forEach((patient) => {
            worksheet1.addRow({
                code: patient._id,
                cid: patient.id_card_number,
                dist: parseInt(patient.district_number),
                prov: parseInt(patient.province_number),
                month: parseInt(patient.month_number),
                name: patient.name_prefix + " " + patient.first_name + " " + patient.last_name,
                sex: patient.sex,
                dob: toStringDate(patient.dob),
                age: patient.age,
                addr: patient.address,
                prevaddr: patient.current_address,
                occup: patient.occupation,
                workaddr: patient.workplace,
                atk1: toStringDate(patient.atk1_date),
                ratk1: patient.atk1_result,
                atk2: toStringDate(patient.atk2_date),
                ratk2: patient.atk2_result,
                pcr: toStringDate(patient.pcrDate),
                ct: parseFloat(patient.pcr_ct)
            }).commit();
        })

        // Start downloading
        downloadReport(workbook1, "ข้อมูลทั่วไปของผู้ติดเชื้อเดือน" + selectedMonth + "ปี พ.ศ." + selectedYear);
    }

    return (
        <Form>
            <Form.Group>
                {message && <Alert className="my-2" variant="primary">{message}</Alert>}
                <Row>
                    <Form.Select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value) }} required>
                        <option defaultValue value="">เลือกปี</option>
                        {getCurrentYearRange(5).map((item, index) => <option value={item} key={index}>{item}</option>)}
                    </Form.Select>
                </Row>
                <Row>
                    <Form.Select value={selectedMonth} onChange={(e) => { setSelectedMonth(e.target.value) }} disabled={selectedYear === ""} required>
                        <option defaultValue value="">เลือกเดือน</option>
                        {thaiMonths.map((item, index) => <option value={item} key={index}>{item}</option>)}
                    </Form.Select>
                </Row>
                <Button className={isSmall ? "w-100" : ""} variant="primary" onClick={buildReport1} disabled={selectedMonth === ""}>ดาวน์โหลดไฟล์</Button>
            </Form.Group>
        </Form>
    )
}

const Report5 = ({ patients, isSmall }) => {
    const idCardNumRef = useRef();
    const [message, setMessage] = useState();
    const [selectedPatient, setSelectedPatient] = useState();

    const colClassName = isSmall ? "text-start" : "text-end";

    function handleSubmit(e) {
        e.preventDefault();
        setMessage(false);
        setSelectedPatient(false);

        // Get the id card number
        const idCardNum = idCardNumRef.current.value;
        // Get the patient
        const temp = patients.find(patient => patient.id_card_number === idCardNum);
        // Check if the patient is found
        if (temp) {
            setSelectedPatient(temp);
        } else {
            setMessage("ไม่พบผู้ป่วยที่มีเลขบัตรประชาชนดังกล่าว");
        }
    }

    async function buildReport5() {
        setMessage(false);

        // Create report 5: "ข้อมูลการดูแลหลังการจำหน่ายจากระบบการรักษา"
        const selectedPatientName = selectedPatient.name_prefix + " " + selectedPatient.first_name + " " + selectedPatient.last_name;
        const selectedPatientId = selectedPatient.id_card_number
        const workbook5 = new ExcelJS.Workbook();
        const worksheet5 = workbook5.addWorksheet("report5", {
            headerFooter: { firstHeader: "รายงานที่ 5 ข้อมูลการดูแลหลังการจำหน่ายจากระบบการรักษาของ " + selectedPatientName + " ID: " + selectedPatientId }
            , pageSetup: { paperSize: 9 }
        });

        // Set table headers
        worksheet5.columns = [
            { header: "วันที่ให้การดูแล", key: "treatmentDate", width: 15 },
            { header: "ประเภทการดูแล", key: "treatmentType", width: 15 },
            { header: "อุณหภูมิ (T)", key: "t", width: 8 },
            { header: "ชีพจร (P)", key: "p", width: 10 },
            { header: "อัตราการหายใจ (R)", key: "r", width: 10 },
            { header: "ความดันโลหิตค่าบน", key: "sbp", width: 20 },
            { header: "ความดันโลหิตค่าล่าง", key: "dbp", width: 20 },
            { header: "ค่าออกซิเจนในเลือด", key: "o2Sat", width: 20 },
            { header: "การประเมินผลการดูแล", key: "assessment", width: 25 },
            { header: "หมายเหตุ", key: "note", width: 20 },
        ];

        // Check if the treatment entries is empty
        if (selectedPatient.treatment_entries.length === 0) {
            return setMessage("ผู้ป่วยไม่มีข้อมูลการดูแลหลังจากการจำหน่าย");
        }

        // Set table rows: Each treatment entry of the selected patient
        selectedPatient.treatment_entries.forEach((treatment_entries) => {
            worksheet5.addRow({
                treatmentDate: toStringDate(treatment_entries.treatment_date),
                treatmentType: treatment_entries.treatment_type,
                t: parseFloat(treatment_entries.temperature),
                p: parseFloat(treatment_entries.pulse),
                r: parseFloat(treatment_entries.heart_rate),
                sbp: parseFloat(treatment_entries.top_blood_pressure),
                dbp: parseFloat(treatment_entries.bottom_blood_pressure),
                o2Sat: parseFloat(treatment_entries.oxygen_level),
                assessment: treatment_entries.assessment,
                note: treatment_entries.note
            }).commit();
        })

        // Start downloading
        downloadReport(workbook5, "ข้อมูลการดูแลหลังการจำหน่ายจากระบบการรักษาของ" + selectedPatientName);
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                {message && <Alert className="m-0 mt-2" variant="primary">{message}</Alert>}
                {
                    isSmall ?
                        <>
                            <Row>
                                <Col className="p-0">
                                    <Form.Control ref={idCardNumRef} type="text" name="idCardNum" placeholder="เลขบัตรประชาชนของผู้ป่วย" required />
                                </Col>
                            </Row>

                            <Row>
                                <Col className="p-0">
                                    <Button className="w-100" variant="primary" type="submit">ค้นหา</Button>
                                </Col>
                            </Row>
                        </>
                        :
                        <Row>
                            <Col md={7} lg={8} className="p-0">
                                <Form.Control ref={idCardNumRef} type="text" name="idCardNum" placeholder="เลขบัตรประชาชนของผู้ป่วย" required />
                            </Col>
                            <Col md={5} lg={4} className="pe-0">
                                <Button className="w-100" variant="primary" type="submit">ค้นหา</Button>
                            </Col>
                        </Row>
                }
            </Form>

            {
                selectedPatient &&
                <>
                    <Card className="mt-2" style={{ fontSize: "1.3rem" }}>
                        <Card.Body>
                            <Row>
                                <Col sm={3} className={colClassName}>
                                    <strong>ID:</strong>
                                </Col>
                                <Col className="text-primary">
                                    {selectedPatient._id}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3} className={colClassName}>
                                    <strong>ชื่อ-นามสกุล:</strong>
                                </Col>
                                <Col className="text-primary">
                                    {`${selectedPatient.name_prefix} ${selectedPatient.first_name} ${selectedPatient.last_name}`}
                                </Col>

                            </Row>
                            <Row>
                                <Col sm={3} className={colClassName}>
                                    <strong>เพศ:</strong>
                                </Col>
                                <Col className="text-primary">
                                    {selectedPatient.sex}
                                </Col>
                                <Col sm={3} className={colClassName}>
                                    <strong>อายุ:</strong>
                                </Col>
                                <Col className="text-primary">
                                    {selectedPatient.age}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3} className={colClassName}>
                                    <strong>ลำดับอำเภอ:</strong>
                                </Col>
                                <Col className="text-primary">
                                    {selectedPatient.district_number}
                                </Col>
                                <Col sm={3} className={colClassName}>
                                    <strong>ลำดับจังหวัด:</strong>
                                </Col>
                                <Col className="text-primary">
                                    {selectedPatient.province_number}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={3} className={colClassName}>
                                    <strong>เดือน:</strong>
                                </Col>
                                <Col className="text-primary">
                                    {selectedPatient.month}
                                </Col>
                                <Col sm={3} className={colClassName}>
                                    <strong>ลำดับเดือน:</strong>
                                </Col>
                                <Col className="text-primary">
                                    {selectedPatient.month_number}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Button className={isSmall ? "mt-2 w-100" : "mt-2"} variant="primary" onClick={buildReport5} disabled={!selectedPatient}>ดาวน์โหลดไฟล์</Button>
                </>
            }
        </>
    )
}

function buildReport2(patients) {
    // Create report 2: "ประวัติเดินทางของผู้ติดเชื้อ"
    const workbook2 = new ExcelJS.Workbook();
    const worksheet2 = workbook2.addWorksheet("report2", {
        headerFooter: { firstHeader: "รายงานที่ 2 ประวัติการเดินทาง Timeline (TL)" }, pageSetup: { paperSize: 9 }
    });

    const header = [{ header: "Code", width: 25 }, { header: "Timeline วันที่ติดเชื้อตามผลตรวจ", width: 15 }];
    header.push({ header: "", width: 30 });
    for (var j = 0; j < 14; j++) {
        header.push({ header: `TL ย้อนหลัง ${j + 1}`, width: 15 });
        header.push({ header: "", width: 30 });
    }

    worksheet2.columns = header;

    const subHeader = [""];
    for (var i = 0; i < 15; i++) {
        subHeader.push("วัน/เดือน/ปี");
        subHeader.push("รายละเอียด");
    }

    worksheet2.addRow(subHeader);

    worksheet2.mergeCells("A1:A2");
    worksheet2.mergeCells("B1:C1");
    worksheet2.mergeCells("D1:E1");
    worksheet2.mergeCells("F1:G1");
    worksheet2.mergeCells("H1:I1");
    worksheet2.mergeCells("J1:K1");
    worksheet2.mergeCells("L1:M1");
    worksheet2.mergeCells("N1:O1");
    worksheet2.mergeCells("P1:Q1");
    worksheet2.mergeCells("R1:S1");
    worksheet2.mergeCells("T1:U1");
    worksheet2.mergeCells("V1:W1");
    worksheet2.mergeCells("X1:Y1");
    worksheet2.mergeCells("Z1:AA1");

    patients.forEach(patient => {
        var timelineEntries = patient.timeline_entries;
        var row = [];

        row[0] = patient._id;
        timelineEntries.forEach(entry => {
            //Check date_type
            if (entry.date_type === "2") {
                row.push(toStringDate(entry.date_begin) + " - " + toStringDate(entry.date_end));
            } else {
                row.push(toStringDate(entry.date_begin));
            }
            row.push(entry.activity);
        });
        worksheet2.addRow(row).commit();
    })

    downloadReport(workbook2, "ประวัติเดินทางของผู้ติดเชื้อ")
}

function buildReport3(patients) {
    // Create report 3: "ข้อมูลการรับเข้ารักษาผู้ป่วยโควิด 19"
    const workbook3 = new ExcelJS.Workbook();
    const worksheet3 = workbook3.addWorksheet("report3", {
        headerFooter: { firstHeader: "รายงานที่ 3 ข้อมูลการรับเข้ารักษาผู้ป่วยโควิด 19" }, pageSetup: { paperSize: 9 }
    });

    // Set table headers
    worksheet3.columns = [
        { header: "วันรับรักษา", key: "admissionDate", width: 15 },
        { header: "ตรวจแบบ PCR พบผลบวกวันที่", key: "pcr", width: 15 },
        { header: "เลขบัตรประชาชน", key: "cid", width: 18 },
        { header: "ชื่อ-สกุล", key: "name", width: 20 },
        { header: "ที่อยู่", key: "addr", width: 20 },
        { header: "สถานที่รักษาครั้งแรก", key: "firstTreatment", width: 20 }
    ];

    const emptyPatients = patients.filter(patient => patient.admission.admission_date.date === "" || patient.admission.admission_date.month === "" || patient.admission.admission_date.year === "");
    const nonEmptyPatients = patients.filter(patient => !(patient.admission.admission_date.date === "" || patient.admission.admission_date.month === "" || patient.admission.admission_date.year === ""));
    const sortedByAdmissionDate = sortPatientByDate(nonEmptyPatients, "admission");
    sortedByAdmissionDate.push(...emptyPatients);

    // Set table rows: Each patient which is sorted by admission date
    sortedByAdmissionDate.forEach((patient) => {
        worksheet3.addRow({
            admissionDate: toStringDate(patient.admission.admission_date),
            pcr: toStringDate(patient.pcrDate),
            cid: patient.id_card_number,
            name: patient.name_prefix + " " + patient.first_name + " " + patient.last_name,
            addr: patient.address,
            firstTreatment: patient.admission.first_treatment
        }).commit();
    })

    downloadReport(workbook3, "ข้อมูลการรับเข้ารับรักษาผู้ป่วยโควิด19");
}

function buildReport4(patients) {
    // Create report 4: "ข้อมูลการจำหน่ายผู้ป่วยโควิด 19"
    const workbook4 = new ExcelJS.Workbook();
    const worksheet4 = workbook4.addWorksheet("report4", {
        headerFooter: { firstHeader: "รายงานที่ 4 ข้อมูลการจำหน่ายผู้ป่วยโควิด 19" }, pageSetup: { paperSize: 9 }
    });

    // Set table headers
    worksheet4.columns = [
        { header: "วันที่จำหน่าย", key: "dischargeDate", width: 15 },
        { header: "เลขบัตรประชาชน", key: "cid", width: 18 },
        { header: "ชื่อ-สกุล", key: "name", width: 20 },
        { header: "ที่อยู่", key: "addr", width: 20 },
        { header: "สถานที่รักษาครั้งสุดท้าย", key: "lastTreatment", width: 20 },
        { header: "จำนวนวันที่รับรักษา", key: "treatmentDuration", width: 20 },
    ];

    const emptyPatients = patients.filter(patient => patient.discharge.discharge_date.date === "" || patient.discharge.discharge_date.month === "" || patient.discharge.discharge_date.year === "");
    const nonEmptyPatients = patients.filter(patient => !(patient.discharge.discharge_date.date === "" || patient.discharge.discharge_date.month === "" || patient.discharge.discharge_date.year === ""));
    const sortedByDischargeDate = sortPatientByDate(nonEmptyPatients, "discharge");
    sortedByDischargeDate.push(...emptyPatients);

    // Set table rows: Each patient which is sorted by admission date
    sortedByDischargeDate.forEach((patient) => {
        worksheet4.addRow({
            dischargeDate: toStringDate(patient.discharge.discharge_date),
            cid: patient.id_card_number,
            name: patient.name_prefix + " " + patient.first_name + " " + patient.last_name,
            addr: patient.address,
            lastTreatment: patient.discharge.last_treatment,
            treatmentDuration: patient.discharge.treatment_duration ? parseInt(patient.discharge.treatment_duration) : ""
        }).commit();
    })

    downloadReport(workbook4, "ข้อมูลการจำหน่ายผู้ป่วยโควิด19");
}

export const Report = () => {
    const { patients } = usePatient();
    const cardStyle = { minWidth: "35remm", maxWidth: "55rem" };
    const isSmall = useMediaQuery(smallMedia);

    // If there is no patients, disable Report
    if (patients.length === 0) {
        return (
            <div className="h-auto py-5 px-3">
                <div>
                    <h1 className="text-center mt-3 mb-4">รายงาน</h1>
                    <h4 className="text-center mt-3 mb-4">ดาวน์โหลดไฟล์ .XLSX</h4>
                </div>
                <Card className="py-3 card-form">
                    <Card.Body>
                        <div className="text-center">
                            <h2>ไม่มีข้อมูลผู้ป่วย</h2>
                        </div>
                    </Card.Body>
                </Card>
            </div >
        )
    }

    return (
        <div className={isSmall ? "h-auto p-3" : "h-auto p-5"}>
            <div className="text-center">
                <h1 className="m-4">รายงาน</h1>
                <h4 className="m-4">ดาวน์โหลดไฟล์ .XLSX</h4>
            </div>

            {/* Report 1 */}
            <Card className="my-3 p-3 mx-auto shadow-sm" style={cardStyle}>
                <Card.Body>
                    <h3 className="mb-3">รายงาน 1: ข้อมูลทั่วไปของผู้ติดเชื้อ</h3>
                    <Report1 patients={patients} isSmall={isSmall} />
                </Card.Body>
            </Card>

            {/* Report 2 */}
            <Card className="my-3 p-3 mx-auto shadow-sm" style={cardStyle}>
                <Card.Body>
                    <h3 className="mb-3">รายงาน 2: ประวัติเดินทางของผู้ติดเชื้อ</h3>
                    <Button className={isSmall ? "w-20 my-1 w-100" : "w-20 my-1"} variant="primary" onClick={() => buildReport2(patients)}>ดาวน์โหลดไฟล์</Button>
                </Card.Body>
            </Card>

            {/* Report 3 */}
            <Card className="my-3 p-3 mx-auto shadow-sm" style={cardStyle}>
                <Card.Body>
                    <h3 className="mb-3">รายงาน 3: ข้อมูลการรับเข้ารับรักษา (Admission)</h3>
                    <Button className={isSmall ? "w-20 my-1 w-100" : "w-20 my-1"} variant="primary" onClick={() => buildReport3(patients)}>ดาวน์โหลดไฟล์</Button>
                </Card.Body>
            </Card>

            {/* Report 4 */}
            <Card className="my-3 p-3 mx-auto shadow-sm" style={cardStyle}>
                <Card.Body>
                    <h3 className="mb-3">รายงาน 4: ข้อมูลการจำหน่าย (Discharge)</h3>
                    <Button className={isSmall ? "w-20 my-1 w-100" : "w-20 my-1"} variant="primary" onClick={() => buildReport4(patients)}>ดาวน์โหลดไฟล์</Button>
                </Card.Body>
            </Card>

            {/* Report 5 */}
            <Card className="my-3 p-3 mx-auto shadow-sm" style={cardStyle}>
                <Card.Body>
                    <h3 className="mb-3">รายงาน 5: ข้อมูลการดูแลหลังการจำหน่ายจากระบบการรักษา (รายบุคคล)</h3>
                    <Report5 patients={patients} isSmall={isSmall} />
                </Card.Body>
            </Card>
        </div >
    )
}