import { Link } from 'components';
import React, { useEffect, useState } from 'react';
import { authService, alertService } from 'services';
import { Button, Card, CardBody, Col, Container, Row, Form, Input, FormFeedback,Modal  } from 'reactstrap';
import ParticlesAuth from "components/AuthenticationInner/ParticlesAuth";
import logoMxvBig from "../assets/images/mxv-logo-big.png";
import * as Yup from "yup";
import { useFormik } from 'formik';
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Image from 'next/future/image';
import defaultAvatar from '../assets/images/default-avatar.jpg'
import PinModal from 'components/account/PinModal';

export default Lockscreen;

function Lockscreen() {
    useEffect(()=>{
        authService.lockscreen()
    },[])
    const { t } = useTranslation();
    const router = useRouter();

    const [modal_pinModal, setmodal_pinModal] = useState(false);
  function tog_pinModal() {
    setmodal_pinModal(!modal_pinModal);
  }

    const [tooglePassword, setTooglepassword] = useState(false);
    const lockUser = JSON.parse(localStorage.getItem("lockUser"))
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
    
        initialValues: {
          password: "",
        },
        validationSchema: Yup.object({
          password: Yup.string().required("Please Enter Your Password").matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
          ),
        }),
        onSubmit: (values) => {
          console.log(values)
          return authService
            .login(lockUser.email, values.password)
            .then(() => {
              // get return url from query parameters or default to '/'
                // router.push("/");
                tog_pinModal()
            })
            .catch(alertService.error);
        },
      });

    return (
        <React.Fragment>
            {lockUser && 
            <div className="auth-page-content">
                <div className="auth-page-wrapper">
                        <div className="auth-page-content">
                            <Container>
                                <Row>
                                    <Col lg={12}>
                                        <div className="text-center mt-sm-5 mb-4 text-white-50">
                                            <div>
                                                <Link href="/dashboard" className="d-inline-block auth-logo">
                                                    <Image src={logoMxvBig} alt="" height="80" />
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
                                                <div className="text-center mt-2">
                                                    <h5 className="text-primary">Lock Screen</h5>
                                                    <p className="text-muted">Enter your password to unlock the screen!</p>
                                                </div>
                                                <div className="user-thumb text-center">
                                                    <Image src={defaultAvatar} className="rounded-circle img-thumbnail avatar-lg" alt="thumbnail" />
                                                    <h5 className="font-size-15 mt-3">{lockUser.email}</h5>
                                                </div>
                                                <div className="p-2 mt-4">
                                                    <Form
                                                        onSubmit={(e) => {
                                                        e.preventDefault();
                                                        validation.handleSubmit();
                                                        return false;
                                                      }}
                                                    >
                      
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type={tooglePassword ? "text" : "password"}
                          className="form-control pe-5"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password &&
                        validation.errors.password ? (
                          <FormFeedback type="invalid">
                            {validation.errors.password}
                          </FormFeedback>
                        ) : null}
                        <button
                          className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted mx-3"
                          type="button"
                          id="password-addon"
                          onClick={() => setTooglepassword(!tooglePassword)}
                        >
                          <i className="ri-eye-fill align-middle"></i>
                        </button>
                      </div>
                                                        <div className="mb-2 mt-4">
                                                            <Button color="success" className="w-100" type="submit">Unlock</Button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        <div className="mt-4 text-center">
                                            <p className="mb-0">Not you ? return <Link href="/account/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                </div>
            </div>}
            <Modal
        id="pinModals"
        tabIndex="-1"
        isOpen={modal_pinModal}
        toggle={() => {
          tog_pinModal();
        }}
        centered
      >
        <PinModal/>
      </Modal>
        </React.Fragment>
    );
}
