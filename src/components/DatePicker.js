import { thaiMonths } from "../config";
import { Form, Row, Col } from "react-bootstrap";
import { getCurrentYearRange, getDateInMonth } from "../helper";

export default function DatePicker({ formInputs, onChangeDate, dateType, required = true, disabled = false }) {
    return (
        <Row>
            <Col className="ps-0">
                <Form.Select value={formInputs[dateType].date} onChange={onChangeDate(dateType)} name="date" required={required} disabled={disabled}>
                    <option defaultValue value="">วันที่</option>
                    {getDateInMonth().map((item, index) => <option value={item} key={index}>{item}</option>)}
                </Form.Select>
            </Col>
            <Col className="px-0">
                <Form.Select value={formInputs[dateType].month} onChange={onChangeDate(dateType)} name="month" required={required} disabled={disabled}>
                    <option defaultValue value="">เดือน</option>
                    {thaiMonths.map((item, index) => <option value={item} key={index}>{item}</option>)}
                </Form.Select>
            </Col>
            <Col className="pe-0">
                < Form.Select value={formInputs[dateType].year} onChange={onChangeDate(dateType)} name="year" required={required} disabled={disabled}>
                    <option defaultValue value="">ปี</option>
                    {getCurrentYearRange(150).map((item, index) => <option value={item} key={index}>{item}</option>)}
                </Form.Select>
            </Col>
        </Row >
    )
}
