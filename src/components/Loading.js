import { Spinner } from "react-bootstrap";

export const Loading = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}
