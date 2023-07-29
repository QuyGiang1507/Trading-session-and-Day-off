import { useRouter } from "next/router";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
} from "reactstrap";
import Image from "next/future/image";
import { Link } from "components";
import { authService, alertService } from "services";

import React from "react";
import logoMxvBig from "../../assets/images/mxv-logo-big.png";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useState,useEffect } from "react";
import { userService } from "services";
export default ForgotPwd;

function ForgotPwd() {

    const validation = useFormik({
      // enableReinitialize : use this flag when initial values needs to be changed
      enableReinitialize: true,
  
      initialValues: {
        email: '',
      },
      validationSchema: Yup.object({
        email: Yup.string().required("Please Enter Your Email").email("Please enter a valid email"),
      }),
      onSubmit: (values) => {
        console.log(values);
      }
    });
    
  return (
    <React.Fragment>
      
          <div className="auth-page-content">
          <Container>
          <Row>
                <Col lg={12}>
                  <div className="text-center mt-sm-5 mb-4 text-white-50">
                    <div>
                      <Link href="/" className="d-inline-block auth-logo">
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
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Forgot Password?</h5>
                    <p className="text-muted">Reset password</p>

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                      >
                    </lord-icon>

                  </div>

                  <Alert className="alert-borderless alert-warning text-center mb-2 mx-2" role="alert">
                    Enter your email and instructions will be sent to you!
                  </Alert>
                  <div className="p-2">
                      
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        <button className="btn btn-success w-100" type="submit">Send Reset Link</button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">Wait, I remember my password... <Link href="/account/login" className="fw-semibold text-primary text-decoration-underline"> Click here </Link> </p>
              </div>

            </Col>
          </Row>
        </Container>
          </div>
    </React.Fragment>
  );
}
