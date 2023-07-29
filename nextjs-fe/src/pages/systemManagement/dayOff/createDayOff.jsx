import React, { useState } from "react";
import { addDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
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
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import BreadCrumb from "components/Common/BreadCrumb";
import { dayOffService } from "services";
import { useTranslation } from "react-i18next";

const CreateDayOff = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [dayOffType, setDayOffType] = useState("");

  const pastMonth = new Date(Date.now());
  const defaultSelected = {
    from: pastMonth,
    to: addDays(pastMonth, 0)
  };
  const [range, setRange] = useState(defaultSelected);
  
  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      dayOffType: "",
      description: "",
      day: "",
    },

    validationSchema: Yup.object({
      dayOffType: Yup.string().required("Type of day off mustn't be empty"),
      day: Yup.string().when("dayOffType", {
        is: "fixed-day-off",
        then: Yup.string().required("Day off mustn't be empty").min(1, "Day off mustn't be empty"),
      }),
      description: Yup.string().when("dayOffType", {
        is: "unfixed-day-off",
        then: Yup.string().required("Description mustn't be empty"),
      })
    }),
    
    async onSubmit(values) {
      if(dayOffType === "unfixed-day-off") {
        if(!range) {
          toast(
            "Day off mustn't not be empty",
            { className: "bg-success text-white" },
          );
        } else {
          await dayOffService
            .createUnfixedDayOff({
              days: [range.from, range.to],
              description: values.description,
            })
            .then((res) => {
              if (res.status === 0) {
                toast(res.message, { className: "bg-success text-white" });
              } else {
                toast(
                  "Day off was created and waiting for approval from admin",
                  { className: "bg-success text-white" },
                );
                router.push("/systemManagement/dayOff");
              }
            });
        }
      } else if (dayOffType === "fixed-day-off") {
        await dayOffService
          .createFixedDayOff({
            days: [values.day],
            description: values.description,
          })
          .then((res) => {
            if (res.status === 0) {
              toast(res.message, { className: "bg-success text-white" });
            } else {
              toast(
                "Day off was created and waiting for approval from admin",
                { className: "bg-success text-white" },
              );
              router.push("/systemManagement/dayOff");
            }
          });
      } else {
        toast(
          "Please choose type of day off",
          { className: "bg-success text-white" },
        );
      }
    },
  });
  
  const handleOnChange = (event) => {
      setDayOffType(event.target.value);
  };
  
  document.title = "Create Day Off";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb />
          <Row>
            <Col lg={12} className="m-auto">
              <Card>
                <CardBody className="p-4">
                  <Form
                    className="needs-validation"
                    onSubmit={formik.handleSubmit}
                    action="#"
                    autoComplete="off"
                  >
                    <Row>
                      <Col lg={12}>
                        <div className="mb-3 d-flex flex-column">
                          <div className="d-flex">
                            <Input
                              name="dayOffType"
                              type="radio"
                              className="form-control"
                              id="dayOffType-create-dayoff"
                              onChange={e => {
                                formik.handleChange(e)
                                handleOnChange(e)
                              }}
                              onBlur={formik.handleBlur}
                              value="fixed-day-off"
                              invalid={
                                formik.touched.dayOffType && formik.errors.dayOffType
                                  ? true
                                  : false
                              }
                              style={{padding: "0.5rem", backgroundPosition: "-1px -1px"}}
                            />
                            <Label
                              htmlFor="dayOffType-create-dayoff"
                              className="form-label"
                              style={{ marginLeft: "16px" }}
                            >
                              {t("Fixed day off")}
                            </Label>
                          </div>
                          <div className="d-flex">
                            <Input
                              name="dayOffType"
                              type="radio"
                              className="form-control"
                              id="dayOffType-create-dayoff"
                              onChange={e => {
                                formik.handleChange(e)
                                handleOnChange(e)
                              }}
                              onBlur={formik.handleBlur}
                              value="unfixed-day-off"
                              invalid={
                                formik.touched.dayOffType && formik.errors.dayOffType
                                  ? true
                                  : false
                              }
                              style={{padding: "0.5rem", backgroundPosition: "-1px -1px"}}
                            />
                            <Label
                              htmlFor="dayOffType-create-dayoff"
                              className="form-label"
                              style={{ marginLeft: "16px" }}
                            >
                              {t("Unfixed day off")}
                            </Label>
                          </div>
                          {formik.touched.dayOffType && formik.errors.dayOffType ? (
                            <FormFeedback type="invalid" style={{ display: "block"}}>
                              {formik.errors.dayOffType}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="mb-5">
                          <Label
                            htmlFor="description-create-dayoff"
                            className="form-label"
                          >
                            {t("Description")}
                          </Label>
                          <Input
                            name="description"
                            type="text"
                            className="form-control"
                            id="description-create-dayoff"
                            placeholder="Enter description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            invalid={
                              formik.touched.description && formik.errors.description
                                ? true
                                : false
                            }
                          />
                          {formik.touched.description && formik.errors.description ? (
                            <FormFeedback type="invalid">
                              {formik.errors.description}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      {dayOffType === "unfixed-day-off" ? (
                        <Col lg={12}>
                          <div className="mb-3 d-flex">
                            <Label
                              htmlFor="day-create-dayoff"
                              className="form-label"
                              style={{marginRight: "32px"}}
                            >
                              {t("Days")}
                            </Label>
                            <DayPicker
                              id="day-create-dayoff"
                              mode="range"
                              defaultMonth={pastMonth}
                              selected={range}
                              onSelect={setRange}
                              numberOfMonths={2}
                              disabled={{before: new Date(Date.now())}}
                              className="m-auto"
                              style={{display: "block", overflow: "auto"}}
                            />
                          </div>
                        </Col>) 
                        : dayOffType === "fixed-day-off" ? (
                        <Col lg={12}>
                          <div className="mb-3">
                            <Label
                              htmlFor="day-create-dayoff"
                              className="form-label"
                              style={{marginRight: "32px"}}
                            >
                              {t("Days")}
                            </Label>
                            <Input
                              name="day"
                              type="select"
                              className="form-control"
                              id="day-create-dayoff"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.day}
                              invalid={
                                formik.touched.day && formik.errors.day
                                  ? true
                                  : false
                              }
                            >
                              <option value="">{t("Choose the day off")}</option>
                              <option value="monday">{t("Monday")}</option>
                              <option value="tuesday">{t("Tuesday")}</option>
                              <option value="wednesday">{t("Wednesday")}</option>
                              <option value="thursday">{t("Thursday")}</option>
                              <option value="friday">{t("Friday")}</option>
                              <option value="saturday">{t("Saturday")}</option>
                              <option value="sunday">{t("Sunday")}</option>
                            </Input>
                            {formik.touched.day && formik.errors.day ? (
                              <FormFeedback type="invalid">
                                {formik.errors.day}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>)
                        : ""
                      }
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

export default CreateDayOff;