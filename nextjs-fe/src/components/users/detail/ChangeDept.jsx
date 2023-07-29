import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Col, Form, Input, Label, Row} from "reactstrap";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {departmentService} from "services";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";
import * as Yup from "yup";

const ChangeDepartment = (props) => {
  const {id, userId} = props;

  const {t} = useTranslation();
  const [departments, setDepartments] = useState(undefined);
  const [department, setDepartment] = useState(undefined);
  const [mode, setMode] = useState("view");

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    setMode("view");
  };

  const formikChangeDept = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      currentDept: "",
    },
    validationSchema: Yup.object({
      targetDept: Yup.string().required("Select 1 department"),
      
    }),
    onSubmit(values) {
      departmentService.changeDept(values.targetDept,userId)
      setMode("view");  
    },
  });

  useEffect(() => {
    departmentService.getDepartments().then((res) => {
      setDepartments(res.payload.data );
    });
    departmentService.getOneDepartment(id).then((res) => {
      console.log(res)
      setDepartment(res.payload.department);
    });
  }, []);

  useEffect(() => {
    if (department) {
      formikChangeDept.setValues({
        currentDept: department.code,
      });
    }
  }, [department]);

  return (
    <>
      {!(department && departments) && (
        <div className="text-center">
          <Image src={loadingGif} alt="" />
        </div>
      )}
      {department && departments && (
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0 flex-grow-1">{t("Change Department")}</h4>
          </CardHeader>
          <CardBody>
            <Form
              className="needs-validation"
              onSubmit={formikChangeDept.handleSubmit}
              action="#"
              autoComplete="off"
            >
              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="currentDeptInput" className="form-label">
                      {t('Current Department')}
                    </Label>
                    <Input
                      name="currentDept"
                      type="text"
                      className="form-control"
                      id={"currentDeptInput"}
                      onChange={formikChangeDept.handleChange}
                      onBlur={formikChangeDept.handleBlur}
                      value={formikChangeDept.values.currentDept}
                      disabled
                      autoComplete="off"
                    />
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="targetDeptInput" className="form-label">
                      {t("Move to")}
                    </Label>
                    <Input
                      name="targetDept"
                      type="select"
                      className="form-control"
                      id={"targetDeptInput"}
                      onChange={formikChangeDept.handleChange}
                      onBlur={formikChangeDept.handleBlur}
                      value={formikChangeDept.values.targetDept}
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                       <option disabled selected value={null}> -- {t("select")} -- </option>
                      {departments.map(function (object, i) {
                        if(object.id!= id)
                        return (
                          <option value={object.id}>
                            {object.code} - {object.name}
                          </option>
                        );
                      })}
                    </Input>
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
        </Card>
      )}
    </>
  );
};

export default ChangeDepartment;
