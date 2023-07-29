import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Col, Form, Input, Label, Row, FormFeedback} from "reactstrap";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {departmentService} from "services";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";
import {StatefulPinInput} from 'react-input-pin-code';
import * as Yup from "yup";

const ChangePin = (props) => {
  const {userId} = props;

  const {t} = useTranslation();


  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      password: "",
      newPIN: "",
    },
    validationSchema: Yup.object({
        password: Yup.string()
        .required('Please Enter current password')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
        newPIN: Yup.string().required('Please Enter newPin').length(6)
    }),
    onSubmit(values) {
      console.log(values)
      // departmentService.changePin(userId,{
      //   password: values.password,
      //   newPIN: values.newPIN
      // })
    },
  });
  

  return (
    <>
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0 flex-grow-1">{t("Change PIN")}</h4>
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
                    <Label htmlFor="passwordInput" className="form-label">
                      {t('Password')}
                    </Label>
                    <Input
                      name="password"
                      type="password"
                      className="form-control"
                      id={"passwordInput"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      invalid={
                        formik.touched.password && formik.errors.password ? true : false
                      }
                      autoComplete="off"
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <FormFeedback type="invalid">
                        {formik.errors.password}
                      </FormFeedback>
                    ) : null}
                  </div>
              </Col>

              <Col lg={4}>
              <Label>
                {t("New PIN")}
              </Label>
                      <StatefulPinInput
                    length={6}
                    size="md"
                    type="number"
                    autoFocus={true}
                    mask={true}
                    onChange={(value, index, values) => {formik.setFieldValue("newPIN", values.join(''))}} 
                    placeholder=""
                    />
                    {formik.touched.newPIN && formik.errors.newPIN ? (
                      <FormFeedback type="invalid">
                        {formik.errors.newPIN}
                      </FormFeedback>
                    ) : null}
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

export default ChangePin;
