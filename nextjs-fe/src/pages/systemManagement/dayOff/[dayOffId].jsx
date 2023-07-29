import React, { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormFeedback,
  Label,
  Input,
} from "reactstrap";
import { toast } from "react-toastify";
import BreadCrumb from "components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { dayOffService } from "services";

const DayOffDetail = ({ dayOffId }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Default");
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const [dayOffType, setDayOffType] = useState("");

  const [pastMonth, setPastMonth] = useState(new Date(Date.now()));
  const defaultSelected = {
    from: pastMonth,
    to: addDays(pastMonth, 0)
  };
  const [range, setRange] = useState(defaultSelected);
  const [disableCelendar, setDisableCelendar] = useState({from: new Date("1900-11-20T10:36:01.516Z"), to: new Date("2999-11-20T10:36:01.516Z")});

  const [dayOff, setDayOff] = useState(undefined);
  const [mode, setMode] = useState("view");

  const [selected, setSelected] = useState(undefined);

  const editClick = () => {
    setMode("edit");
    setDisableCelendar({before: new Date(Date.now())});
  };
  const cancelClick = () => {
    setMode("view");
    setDisableCelendar({from: new Date("1900-11-20T10:36:01.516Z"), to: new Date("2999-11-20T10:36:01.516Z")});
  };

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      dayOffType: "",
      description: "",
      day: "",
    },

    validationSchema: Yup.object({
      day: Yup.string().when("dayOffType", {
        is: "fixed-day-off",
        then: Yup.string().required("Day off must not be empty").min(1, "Day off must not be empty"),
      })
    }),

    async onSubmit(values) {
      if (values.dayOffType === "fixed-day-off") {
        await dayOffService.updateFixedDayOff({
          DayOffId: dayOffId,
          updateData: {
            days: values.day,
            description: "Fixed day off",
          }
        })
        .then((res) => {
          if (res.status === 0) {
            toast(res.message, { className: "bg-success text-white" });
          } else {
            setMode("view");
            toast(
              "Your update was recorded and waiting for approval from admin",
              { className: "bg-success text-white" },
            );
          }
        })
        .catch((error) => console.log(error));
      } else if (values.dayOffType === "unfixed-day-off") {
        if (range) {
          await dayOffService.updateUnfixedDayOff({
            DayOffId: dayOffId,
            updateData: {
              days: [range.from ? new Date(range.from).toISOString() : "", range.to ? new Date(range.to).toISOString() : null],
              description: values.description,
            }
          })
          .then((res) => {
            if (res.status === 0) {
              toast(res.message, { className: "bg-success text-white" });
            } else {
              setDisableCelendar({from: new Date("1900-11-20T10:36:01.516Z"), to: new Date("2999-11-20T10:36:01.516Z")});
              setMode("view");
              toast(
                "Your update was recorded and waiting for approval from admin",
                { className: "bg-success text-white" },
              );
            }
          })
          .catch((error) => console.log(error));
        } else {
          toast(
            "Day off must not not be empty",
            { className: "bg-success text-white" },
          );
        }
      } else {
        toast(
          "Something went wrong!",
          { className: "bg-success text-white" },
        );
      }
    },
  });

  useEffect(() => {
    dayOffService.getDayOff(dayOffId).then((res) => {
      setDayOff(res.payload);
    });
  }, []);

  useEffect(() => {
    if (dayOff) {
      formik.setValues({
        dayOffType: dayOff.description === "Fixed day off" ? "fixed-day-off" : "unfixed-day-off",
        description: dayOff.description !== "Fixed day off" ? dayOff.description : "",
        day: dayOff.description === "Fixed day off" ? dayOff.days[0] : "",
      });
      if (dayOff.description !== "Fixed day off") {
        setDayOffType("unfixed-day-off");
        setSelected("unfixed-day-off");
        setPastMonth(Date.parse(dayOff.days[0]));
        setRange({
          from: Date.parse(dayOff.days[0]),
          to: Date.parse(dayOff.days[1]),
        });
      } else {
        setDayOffType("fixed-day-off");
        setSelected("fixed-day-off");
      }
    }
  }, [dayOff]);

  const handleOnChange = (event) => {
    setDayOffType(event.target.value);
  };
  
  document.title = "Day off";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">
                    {t("Commodity")}
                  </h4>
                </CardHeader>

                <CardBody>
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
                              disabled
                              className="form-control"
                              id="dayOffType-create-dayoff"
                              onChange={e => {
                                formik.handleChange(e)
                                handleOnChange(e)
                              }}
                              checked={selected === "fixed-day-off"}
                              onBlur={formik.handleBlur}
                              value="fixed-day-off"
                              style={{padding: "0.5rem 0.5rem"}}
                            >

                            </Input>
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
                              disabled
                              className="form-control"
                              id="dayOffType-create-dayoff"
                              onChange={e => {
                                formik.handleChange(e)
                                handleOnChange(e)
                              }}
                              checked={selected === "unfixed-day-off"}
                              onBlur={formik.handleBlur}
                              value="unfixed-day-off"
                              style={{padding: "0.5rem 0.5rem"}}
                            />
                            <Label
                              htmlFor="dayOffType-create-dayoff"
                              className="form-label"
                              style={{ marginLeft: "16px" }}
                            >
                              {t("Unfixed day off")}
                            </Label>
                          </div>
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
                            disabled
                            className="form-control"
                            id="description-create-dayoff"
                            placeholder="Enter description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                          />
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
                              disabled={disableCelendar}
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
                              disabled={mode == "view"}
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
                          {mode == "view" && (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={editClick}
                            >
                              Edit
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
                              <button
                                type="submit"
                                className="btn btn-soft-success"
                              >
                                Submit
                              </button>
                            </>
                          )}
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

export async function getServerSideProps({ params }) {
  return {
    props: {
      dayOffId: params.dayOffId,
    },
  };
};

export default DayOffDetail;