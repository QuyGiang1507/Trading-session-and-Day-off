import React, {useEffect, useState} from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Input,
  Label,
  Row,
  FormFeedback,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {authService, departmentService} from "services";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";

const UserDetails = (props) => {
  const {id, userId, user} = props;
  const {t} = useTranslation();

  const [mode, setMode] = useState("view");

  
  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    setMode("view");
  };
  //reset pwd modal
  const [modal_resetPasswordModals, setmodal_resetPasswordModals] = useState(false);
  function tog_resetPasswordModals() {
    setmodal_resetPasswordModals(!modal_resetPasswordModals);
  }

  const resetPwdSubmit=()=>{
    departmentService.resetPassword(user.id).then((res)=>{
      alert("Your new password has been sent to "+user.email)
      tog_resetPasswordModals()
    })
    .catch()
  }

//reset pin modal
const [modal_resetPinModals, setmodal_resetPinModals] = useState(false);
function tog_resetPinModals() {
  setmodal_resetPinModals(!modal_resetPinModals);
}

const resetPinSubmit=()=>{
  departmentService.resetPin(user.id).then((res)=>{
    alert("Your new PIN has been sent to "+user.email)
    tog_resetPinModals()
  })
  .catch()
}

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: user,

    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your Name"),
    }),
    onSubmit(values) {
      departmentService.updateUser(userId,{
        phone: values.phone,
        name: values.name,  
        status: values.status
      })
      setMode("view");
    },
  });
  const passwordFormik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },

    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Please Enter Your Password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      newPassword: Yup.string()
        .required("Please Enter Your Password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      confirmNewPassword: Yup.string().oneOf(
        [Yup.ref("newPassword"), null],
        "Must match new password"
      ),
    }),
    onSubmit(values) {
      console.log(values);
    },
  });
  
  return (
    <>
      {!user && (
        <div className="text-center">
          <Image src={loadingGif} alt="" />
        </div>
      )}
      {user && (
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0 flex-grow-1">{t("Personal Details")}</h4>
            {user.department.status=="inactive"&&(<div className="text-danger">{t("Note: This department is currently inactive")}</div>)}
          </CardHeader>
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
                    <Label htmlFor="usernameInput" className="form-label">
                      {t("username")}
                    </Label>
                    <Input
                      name="username"
                      type="text"
                      className="form-control"
                      id={"usernameInput"}
                      placeholder="Enter your username"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      invalid={
                        formik.touched.username && formik.errors.username ? true : false
                      }
                      disabled
                      autoComplete="off"
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <FormFeedback type="invalid">
                        {formik.errors.username}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="nameInput" className="form-label">
                      {t("name")}
                    </Label>
                    <Input
                      name="name"
                      type="text"
                      className="form-control"
                      id="nameInput"
                      placeholder="Enter your name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      invalid={
                        formik.touched.name && formik.errors.name ? true : false
                      }
                      disabled={mode == "view"}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <FormFeedback type="invalid">{formik.errors.name}</FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="emailInput" className="form-label">
                      {t("Email Address")}
                    </Label>
                    <div className="form-icon right">
                      <Input
                        name="email"
                        type="email"
                        className="form-control form-control-icon"
                        id="emailInput"
                        placeholder="Enter your email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        invalid={
                          formik.touched.email && formik.errors.email ? true : false
                        }
                        disabled
                      />
                      <i className="ri-mail-line"></i>
                    </div>
                    {formik.touched.email && formik.errors.email ? (
                      <FormFeedback type="invalid">{formik.errors.email}</FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="statusInput" className="form-label">
                      Status
                    </Label>
                    <div className="form-icon right">
                      <Input
                        name="status"
                        type="select"
                        className="form-control"
                        id="statusInput"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.status}
                        disabled={mode == "view"}
                      >
                        <option value="active">{t("active")}</option>
                        <option value="inactive">{t("inactive")}</option>
                        <option value="pending">{t("pending")}</option>
                      </Input>
                    </div>
                    {formik.touched.phone && formik.errors.phone ? (
                      <FormFeedback type="invalid">{formik.errors.phone}</FormFeedback>
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
                      disabled={mode == "view"}
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
                    {mode == "view" && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={editClick}
                      >
                        {t("Edit")}
                      </button>
                    )}

                    {mode == "edit" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-soft-danger"
                          onClick={cancelClick}
                        >
                          {t("Cancel")}
                        </button>
                        <button type="submit" className="btn btn-soft-success">
                          {t("Submit")}
                        </button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
          <CardFooter>
            <span
              className="text-muted mx-2"
              type="button"
              onClick={() => tog_resetPasswordModals()}
              data-bs-toggle="modal"
              data-bs-target="#resetPasswordModals"
            >
              {t("Reset Password")}
            </span>
            
            <Modal
              id="resetPasswordModals"
              tabIndex="-1"
              isOpen={modal_resetPasswordModals}
              toggle={() => {
                tog_resetPasswordModals();
              }}
              centered
            >
              <ModalHeader>{t("Change Password")}</ModalHeader>
              <ModalBody>
                <p>{t("New Password will be sent to")} {user.email}</p>
                <Button className="btn-soft-success" onClick={resetPwdSubmit}>{t("Submit")}</Button>
                <Button className="btn-soft-danger mx-4" onClick={tog_resetPasswordModals}>{t("Cancel")}</Button>
              </ModalBody>  
            </Modal>

            <span
              className="text-muted mx-2"
              type="button"
              onClick={() => tog_resetPinModals()}
              data-bs-toggle="modal"
              data-bs-target="#resetPinModals"
            >
              {t("Change Pin Code")}
            </span>
            
            <Modal
              id="resetPinModals"
              tabIndex="-1"
              isOpen={modal_resetPinModals}
              toggle={() => {
                tog_resetPinModals();
              }}
              centered
            >
              <ModalHeader>{t("Change Pin Code")}</ModalHeader>
              <ModalBody>
                <p>{t("New Pin will be sent to")} {user.email}</p>
                <Button className="btn-soft-success" onClick={resetPinSubmit}>{t("Submit")}</Button>
                <Button className="btn-soft-danger mx-4" onClick={tog_resetPinModals}>{t("Cancel")}</Button>
              </ModalBody>  
            </Modal>


          </CardFooter>
        </Card>


      )}
    </>
  );
};

export default UserDetails;
