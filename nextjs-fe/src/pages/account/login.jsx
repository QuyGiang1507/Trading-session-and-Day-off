import {useRouter} from "next/router";
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
  Modal,
} from "reactstrap";
import Image from "next/future/image";
import {Link} from "components";
import {authService, alertService} from "services";

import React from "react";
import logoMxvBig from "../../assets/images/mxv-logo-big.png";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {useState, useEffect} from "react";
import {MicrosoftSignIn} from "components/Common/MicrosoftSignIn";
import {useIsAuthenticated, useMsal} from "@azure/msal-react";
import PinModal from "components/account/PinModal";
export default Login;

function Login() {
  const router = useRouter();
  const {t} = useTranslation();
  const isAuthenticated = useIsAuthenticated();
  const [tooglePassword, setTooglepassword] = useState(false);

  const [modal_pinModal, setmodal_pinModal] = useState(false);
  function tog_pinModal() {
    setmodal_pinModal(!modal_pinModal);
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
    },
    // validationSchema: Yup.object({
    //   email: Yup.string().required("Please Enter Your Email").email("Please enter a valid email"),
    //   password: Yup.string().required("Please Enter Your Password").matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    //     "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    //   ),
    // }),
    onSubmit: (values) => {
      return authService
        .login(values.email, values.password)
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
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link href="/" className="d-inline-block auth-logo">
                    <Image src={logoMxvBig} height="60" alt="" />
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
                    <h5 className="text-primary">{t("Welcome Back !")}</h5>
                    <p className="text-muted">{t("Sign in to continue to MXV site.")}</p>
                  </div>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="mb-3">
                      <div className="mb-3">
                        <Label htmlFor="email" className="form-label">
                          {t("Email")}
                        </Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="float-end">
                        <Link href="/account/forgotpwd" className="text-muted">
                          {t("Forgot password?")}
                        </Link>
                      </div>
                      <Label className="form-label" htmlFor="password-input">
                        {t("Password")}
                      </Label>
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
                            validation.touched.password && validation.errors.password
                              ? true
                              : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
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
                    </div>

                    <div className="form-check position-relative">
                      <div className="float-end">
                        <Link href="/account/register">{t("Register")}</Link>
                      </div>
                      <Input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="auth-remember-check"
                      />
                      <Label className="form-check-label" htmlFor="auth-remember-check">
                      {t("Remember me")}
                      </Label>
                    </div>
                    <div className="mt-4">
                      <Button
                        color="success"
                        type="submit"
                        className="btn btn-success w-100"
                      >
                        {t("Sign In")}
                      </Button>
                    </div>
                    {/* <div className="mt-4">
                      <MicrosoftSignIn />
                    </div> */}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
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
