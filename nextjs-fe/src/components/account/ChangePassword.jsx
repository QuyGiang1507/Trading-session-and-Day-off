import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Col, Form, Input, Label, Row, FormFeedback} from "reactstrap";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {departmentService} from "services";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";
import * as Yup from "yup";

const ChangePassword = (props) => {
  const {userId} = props;

  const {t} = useTranslation();

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPwd:"",
    },
    validationSchema: Yup.object({
        oldPassword: Yup.string()
        .required('Please Enter current password')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
        newPassword: Yup.string()
        .required('Please Enter new password')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
        confirmNewPwd: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        ,
    }),
    onSubmit(values) {
      departmentService.changePassword(userId,{
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })
    },
  });


  return (
    <>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0 flex-grow-1">{t("Change Password")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              className="needs-validation"
              onSubmit={formik.handleSubmit}
              action="#"
              autoComplete="off"
            >
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="oldPasswordInput" className="form-label">
                      {t('Old Password')}
                    </Label>
                    <Input
                      name="oldPassword"
                      type="password"
                      className="form-control"
                      id={"oldPasswordInput"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.oldPassword}
                      invalid={
                        formik.touched.oldPassword && formik.errors.oldPassword ? true : false
                      }
                      autoComplete="off"
                    />
                    {formik.touched.oldPassword && formik.errors.oldPassword ? (
                      <FormFeedback type="invalid">
                        {formik.errors.oldPassword}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="newPasswordInput" className="form-label">
                      {t('New Password')}
                    </Label>
                    <Input
                      name="newPassword"
                      type="password"
                      className="form-control"
                      id={"newPasswordInput"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newPassword}
                      invalid={
                        formik.touched.newPassword && formik.errors.newPassword ? true : false
                      }
                      autoComplete="off"
                    />
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                      <FormFeedback type="invalid">
                        {formik.errors.newPassword}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="confirmNewPwdInput" className="form-label">
                      {t('Confirm New Password')}
                    </Label>
                    <Input
                      name="confirmNewPwd"
                      type="password"
                      className="form-control"
                      id={"confirmNewPwdInput"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmNewPwd}
                      invalid={
                        formik.touched.confirmNewPwd && formik.errors.confirmNewPwd ? true : false
                      }
                      autoComplete="off"
                    />
                    {formik.touched.confirmNewPwd && formik.errors.confirmNewPwd ? (
                      <FormFeedback type="invalid">
                        {formik.errors.confirmNewPwd}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col lg={12}>
                  <div className="hstack gap-2 justify-content-end">
                    
                        <button type="submit" className="btn btn-soft-success">
                          {t("Submit")}
                        </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
    </>
  );
};

export default ChangePassword;
