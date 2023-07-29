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
import BreadCrumb from "components/Common/BreadCrumb";
import { departmentService } from "services";
import { useTranslation } from "react-i18next";

const CreateUser = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {deptId} =router.query
  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
      name: "",
      username:"",
      phone:""
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Name"),
      username: Yup.string().required("Please Enter Your Username"),
      phone: Yup.string().required("Please Enter Your Phone Number"),
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
        departmentService.createUser({
            email:values.email,
            password: values.password,
            name: values.name,
            username: values.username,
            phone: values.phone,
            department: deptId,
        }).then((res)=>{if(!res.errors) router.push("/adminUserManagement/departments")})
      
    },
  });

  document.title = t("Create User");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody className="p-4">
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
                            {t("email")}
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
                          <Label
                            htmlFor="username-create-user"
                            className="form-label"
                          >
                            {t("username")}
                          </Label>
                          <Input
                            name="username"
                            type="text"
                            className="form-control"
                            id="username-create-user"
                            placeholder="Enter your username"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            invalid={
                              formik.touched.username &&
                              formik.errors.username
                                ? true
                                : false
                            }
                          />
                          {formik.touched.username &&
                          formik.errors.username ? (
                            <FormFeedback type="invalid">
                              {formik.errors.username}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="password-create-user" className="form-label">
                            {t("password")}
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
                          <Label htmlFor="name-create-user" className="form-label">
                            {t("name")}
                          </Label>
                          <Input
                            name="name"
                            type="text"
                            className="form-control"
                            id="name-create-user"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            invalid={
                              formik.touched.name && formik.errors.name
                                ? true
                                : false
                            }
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <FormFeedback type="invalid">
                              {formik.errors.name}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="phone-create-user" className="form-label">
                            {t("phone")}
                          </Label>
                          <Input
                            name="phone"
                            type="text"
                            className="form-control"
                            id="phone-create-user"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                            invalid={
                              formik.touched.phone && formik.errors.phone
                                ? true
                                : false
                            }
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <FormFeedback type="invalid">
                              {formik.errors.phone}
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateUser;
