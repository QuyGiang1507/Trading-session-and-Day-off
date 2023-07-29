import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row, Button } from 'reactstrap';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { userService } from "services";
import { Link } from "components";
import logoMxvBig from "../../assets/images/mxv-logo-big.png";
import {toast} from "react-toastify"
import Image from "next/future/image";

const CreateNewUser = () => {
  const router = useRouter();

  const [countdown,setCountdown] = useState(0)
  
  const sendEmail = () =>{
    const i =5
    toast("Email sent! Check your inbox", { className: "bg-success text-white" });
    const interval = setInterval(() => {
        i--
        setCountdown(i)
        if(i==0){
            clearInterval(interval)
        }
      }, 1000);
  } 

  document.title = "Verification Page";

  return (
    <React.Fragment>
      
          <div className="auth-page-content">
          <Container>
                            <Row>
                                <Col lg={12}>
                                    <div className="text-center mt-sm-5 mb-4 text-white-50">
                                        <div>
                                            <Link href="/dashboard" className="d-inline-block auth-logo">
                                                <Image src={logoMxvBig} alt="" height="60" />
                                            </Link>
                                        </div>
                                        <p className="mt-3 fs-15 fw-medium">MXV</p>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col md={8} lg={6} xl={5}>
                                    <Card className="mt-4">
                                        <CardBody className="p-4">
                                            <div className="mb-4">
                                                <div className="avatar-lg mx-auto">
                                                    <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                                                        <i className="ri-mail-line"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2 mt-4">
                                                <div className="text-muted text-center mb-4 mx-lg-3">
                                                    <h4 className="">Verify Your Email</h4>
                                                    <p>Please enter the 4 digit code sent to <span className="fw-semibold">{router.query.email}</span></p>
                                                </div>

                                                <form>
                                                    <Row>
                                                        <Col className="col-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="digit1-input" className="visually-hidden">Dight 1</label>
                                                                <input type="text"
                                                                    className="form-control form-control-lg bg-light border-light text-center"
                                                                    maxLength="1"
                                                                    id="digit1-input" />
                                                            </div>
                                                        </Col>

                                                        <Col className="col-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="digit2-input" className="visually-hidden">Dight 2</label>
                                                                <input type="text"
                                                                    className="form-control form-control-lg bg-light border-light text-center"
                                                                    maxLength="1"
                                                                    id="digit2-input" />
                                                            </div>
                                                        </Col>

                                                        <Col className="col-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="digit3-input" className="visually-hidden">Dight 3</label>
                                                                <input type="text"
                                                                    className="form-control form-control-lg bg-light border-light text-center"
                                                                    maxLength="1"
                                                                    id="digit3-input" />
                                                            </div>
                                                        </Col>

                                                        <Col className="col-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="digit4-input" className="visually-hidden">Dight 4</label>
                                                                <input type="text"
                                                                    className="form-control form-control-lg bg-light border-light text-center"
                                                                    maxLength="1"
                                                                    id="digit4-input" />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </form>
                                                <div className="mt-3">
                                                    <Button color="success" className="w-100">Confirm</Button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <div className="mt-4 text-center">
                                        {countdown==0 &&
                                            <p className="mb-0">Didn&apos;t receive a code ? <a href="#" onClick={sendEmail} className="fw-semibold text-primary text-decoration-underline">Resend</a></p>
                                        }
                                        {countdown>0 &&
                                            <p className="mb-0">You have to wait {countdown}s to send another email</p>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Container>
          </div>
    </React.Fragment>
  );
};

export default CreateNewUser;
