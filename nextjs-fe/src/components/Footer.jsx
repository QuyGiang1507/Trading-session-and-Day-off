import React from 'react';
import { Col, Container, Row } from 'reactstrap';
const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        <Col sm={6}>
                            {new Date().getFullYear()} © MXV
                        </Col>
                        <Col sm={6}>
                            <div className="text-sm-end d-none d-sm-block">
                                <a className='p-1' href="https://www.facebook.com/mxv.vn/">
                                <i className=" ri-facebook-circle-fill text-secondary"></i>
                                </a>
                                <a className='p-1' href="https://www.youtube.com/channel/UCO8dyoniRZAF6JAck7ne5-g">
                                <i className="ri-youtube-fill text-danger"></i>
                                </a>
                                <a className='p-1' href="https://www.linkedin.com/company/mxv-vn?original_referer=https%3A%2F%2Fmxv.com.vn%2F">
                                <i className="ri-linkedin-box-fill"></i>
                                </a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;