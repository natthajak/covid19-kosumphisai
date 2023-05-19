import "../PrintTimeline.scss";
import { Loading } from "./Loading";
import { useState, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import { useParams, Link } from "react-router-dom";
import { usePatient } from "../contexts/PatientContext";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const buildTimelinePrint = patient => {
    // Check if the timeline entries array is empty
    if (patient.timeline_entries.length === 0)
        return <h2 className="text-center my-3">ไม่มีข้อมูล</h2>

    return <>
        {/* Header */}
        <div id="timeline-print-header">
            <Container id="timeline-print-container" className="p-2" fluid={true}>
                <Row>
                    <Col className="p-0 row align-items-center">
                        <div>
                            <img className="me-2" width="45%" src="/images/province_symbol.png" alt="symbol" />
                            <img width="45%" src="/images/public_health_symbol.png" alt="symbol" />
                        </div>
                    </Col>
                    <Col className="p-0 row align-items-center" xs={7}>
                        <img className="w-100" src="/images/timeline_print_header.svg" alt="header" />
                    </Col>
                    <Col className="p-0 text-center">
                        <Col className="my-2">
                            {patient.sex === "ชาย" ? <img id="sex-image" src="/images/timeline_print_male.svg" alt="male" /> : <img id="sex-image" src="/images/timeline_print_female.svg" alt="female" />}
                        </Col>
                        <Col className="my-2" style={{ color: "white", fontSize: "1.5rem" }}>
                            {patient.sex === "ชาย" ? <div>เพศชาย / อายุ {patient.age} ปี</div> : <div>เพศหญิง / อายุ {patient.age} ปี</div>}
                        </Col>
                    </Col>
                </Row>
            </Container>
        </div>

        {/* Month and month number */}
        <div className="text-end">
            <span id="timeline-print-month" className="py-2 px-4 my-2">
                {`ระลอก${patient.month} รายที่ ${patient.month_number}`}
            </span>
        </div>

        {/* Timeline entries */}
        <div id="timeline-content">
            <ul className="timeline">
                {
                    patient.timeline_entries.map((entry, index) => {
                        if (entry.date_type === "1") {
                            return <li key={index} className="event" data-date={`${entry.date_begin.date} ${entry.date_begin.month} ${entry.date_begin.year}`}>
                                <h3>{entry.activity}</h3>
                            </li>
                        } else {
                            return <li key={index} className="event" data-date={`${entry.date_begin.date} ${entry.date_begin.month} ${entry.date_begin.year} - ${entry.date_end.date} ${entry.date_end.month} ${entry.date_end.year}`}>
                                <h3>{entry.activity}</h3>
                            </li>
                        }
                    }
                    )
                }
            </ul>
        </div>
    </>
};

export const PrintTimeline = () => {
    const [patient, setPatient] = useState();
    const { _id } = useParams();
    const { patients } = usePatient();

    function handleDownloadImage() {
        htmlToImage
            .toJpeg(document.getElementById("timeline-print"), { quality: 1 })
            .then(function (dataUrl) {
                var link = document.createElement("a");
                link.download = `timeline-${patient.month}-${patient.month_number}.jpeg`;
                link.href = dataUrl;
                link.click();
            });
    }

    useEffect(() => {
        setPatient(patients.filter(patient => patient._id === _id)[0]);
    }, [_id, patients]);

    if (!patient) {
        return <Loading />
    }

    return (
        <div className="h-auto py-5 px-3 d-flex flex-column align-items-center">
            <h1 className="text-center my-4">พิมพ์ Timeline</h1>
            <div className="text-center my-3">
                <Button variant="primary" onClick={handleDownloadImage} disabled={patient.timeline_entries.length === 0}>ดาวน์โหลดรูปภาพ</Button>
            </div>
            <Card className="my-2 text-center shadow-sm">
                <Card.Body className="px-3 py-2">
                    <div>Icons made by <a href="https://www.flaticon.com/authors/payungkead" title="Payungkead">Payungkead</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                </Card.Body>
            </Card>
            <div className="overflow-auto w-100">
                <div className="mx-auto" style={{ width: "1280px" }}>
                    <Card id="timeline-print" className="shadow-sm" >
                        <Card.Body className="p-2">
                            {buildTimelinePrint(patient)}
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <div className="my-3 text-center">
                <Link to={`/patients/timelines/info/${_id}`}><Button variant="secondary">ย้อนกลับ</Button></Link>
            </div>
        </div>
    );
}