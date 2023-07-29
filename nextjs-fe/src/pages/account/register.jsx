import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Form,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { userService } from "services";
import { Link } from "components";
import logoMxvBig from "../../assets/images/mxv-logo-big.png";
import Image from "next/future/image";

const CreateNewUser = () => {
  const router = useRouter();

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
      email: Yup.string()
        .required("Please Enter Your Email")
        .email("Please enter a valid email"),
      password: Yup.string()
        .required("Please Enter Your Password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    }),
    onSubmit(values) {
      console.log(values);
      userService.createUser(values)
      router.push({
        pathname:"/account/verification",
        query: {email: values.email}
      })
    },
  });

  document.title = "Register Page";

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
                  <div className="p-2">
                      
                  <Form
                    className="needs-validation"
                    onSubmit={formik.handleSubmit}
                    action="#"
                    autoComplete="off"
                  >
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="email-create-user" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            type="text"
                            className="form-control"
                            id="email-create-user"
                            placeholder="Enter your email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            invalid={
                              formik.touched.email && formik.errors.email
                                ? true
                                : false
                            }
                            autoComplete="off"
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <FormFeedback type="invalid">
                              {formik.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="password-create-user" className="form-label">
                            Password
                          </Label>
                          <Input
                            name="password"
                            type="password"
                            className="form-control"
                            id="password-create-user"
                            placeholder="Enter your password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            invalid={
                              formik.touched.password && formik.errors.password
                                ? true
                                : false
                            }
                            autoComplete="new-password"
                          />
                          {formik.touched.password && formik.errors.password ? (
                            <FormFeedback type="invalid">
                              {formik.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label
                            htmlFor="firstname-create-user"
                            className="form-label"
                          >
                            First Name
                          </Label>
                          <Input
                            name="firstName"
                            type="text"
                            className="form-control"
                            id="firstname-create-user"
                            placeholder="Enter your firstname"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.firstName}
                            invalid={
                              formik.touched.firstName &&
                              formik.errors.firstName
                                ? true
                                : false
                            }
                          />
                          {formik.touched.firstName &&
                          formik.errors.firstName ? (
                            <FormFeedback type="invalid">
                              {formik.errors.firstName}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="lastname-create-user" className="form-label">
                            Last Name
                          </Label>
                          <Input
                            name="lastName"
                            type="text"
                            className="form-control"
                            id="lastname-create-user"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lastName}
                            invalid={
                              formik.touched.lastName && formik.errors.lastName
                                ? true
                                : false
                            }
                          />
                          {formik.touched.lastName && formik.errors.lastName ? (
                            <FormFeedback type="invalid">
                              {formik.errors.lastName}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="submit"
                            className="btn btn-soft-success"
                          >
                            Submit
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">Wait, I already have an account... <Link href="/account/login" className="fw-semibold text-primary text-decoration-underline"> Click here </Link> </p>
              </div>

            </Col>
          </Row>
        </Container>
          </div>
    </React.Fragment>
  );
};

export default CreateNewUser;
