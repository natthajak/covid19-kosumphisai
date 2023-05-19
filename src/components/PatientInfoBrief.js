import { Card, Row, Col } from "react-bootstrap";

export const PatientInfoBrief = (props) => {
    const rowStyle = {
        margin: 0
    }

    return (
        <>
            <Card className="p-3 card-form shadow-sm">
                <Card.Body>
                    {/* Row 1 */}
                    <Row style={rowStyle}>
                        <Col className="form-label" sm="3">
                            <span><strong>ID:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{props.patient._id}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>เลขบัตรประชาชน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{props.patient.id_card_number}</span>
                        </Col>
                    </Row>

                    {/* Row 2 */}
                    <Row style={rowStyle}>
                        <Col className="form-label" sm="3">
                            <span><strong>ชื่อ-นามสกุล:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{props.patient.name_prefix} {props.patient.first_name} {props.patient.last_name}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>เพศ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{props.patient.sex}</span>
                        </Col>
                    </Row>

                    {/* Row 3 */}
                    <Row style={rowStyle}>
                        <Col className="form-label" sm="3">
                            <span><strong>วันเกิด:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{props.patient.dob.date} {props.patient.dob.month} {props.patient.dob.year}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>อายุ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="1">
                            <span>{props.patient.age} ปี</span>
                        </Col>
                    </Row>

                    {/* Row 4 */}
                    <Row style={rowStyle}>
                        <Col className="form-label" sm="3">
                            <span><strong>ลำดับจังหวัด:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{props.patient.province_number}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>ลำดับอำเภอ:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="1">
                            <span>{props.patient.district_number}</span>
                        </Col>
                    </Row>

                    {/* Row 5 */}
                    <Row style={rowStyle}>
                        <Col className="form-label" sm="3">
                            <span><strong>เดือน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="3">
                            <span>{props.patient.month}</span>
                        </Col>
                        <Col className="form-label" sm="2">
                            <span><strong>ลำดับเดือน:</strong></span>
                        </Col>
                        <Col className="form-info text-primary" sm="2">
                            <span>{props.patient.month_number}</span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}
