import React, { useState, useEffect } from "react";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import { tradingSessionService } from "services";

const SessionDetail = ({ sessionId }) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("Default");
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [session, setSession] = useState(undefined);
  const [mode, setMode] = useState("view");

  const [isGeneral, setIsGeneral] = useState(undefined);

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    setMode("view");
  };

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      isGeneralSession: false,
      commodity: "",
      item: "",
      startTime: "",
      endTime: "",
      preOpenStartTime: "",
      preOpenEndTime: "",
      openStartTime: "",
      openEndTime: "",
      pauseStartTime: "",
      pauseEndTime: "",
      closeStartTime: "",
      closeEndTime: "",
      maintenanceStartTime: "",
      maintenanceEndTime: "",
    },

    validationSchema: Yup.object({
      startTime: Yup.string().when("isGeneralSession", {
        is: true,
        then: Yup.string().required("Start time mustn't be empty")
      }),
      endTime: Yup.string().when("isGeneralSession", {
        is: true,
        then: Yup.string().required("End time mustn't be empty")
      }),
      preOpenStartTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Pre-Open Time mustn't be empty")
      }),
      preOpenEndTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Pre-Open Time mustn't be empty")
      }),
      openStartTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Open Time mustn't be empty")
      }),
      openEndTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Open Time mustn't be empty")
      }),
      pauseStartTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Pause Time mustn't be empty")
      }),
      pauseEndTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Pause Time mustn't be empty")
      }),
      closeStartTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Close Time mustn't be empty")
      }),
      closeEndTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Close Time mustn't be empty")
      }),
      maintenanceStartTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Maintenance Time mustn't be empty")
      }),
      maintenanceEndTime: Yup.string().when("isGeneralSession", {
        is: false,
        then: Yup.string().required("Maintenance Time mustn't be empty")
      }),
    }),

    async onSubmit(values) {
      setMode("view");
      await tradingSessionService.updateSession({
        tradingSessionId: sessionId,
        updateData: {
          commodity: values.commodity,
          item: values.item,
          startTime: values.startTime,
          endTime: values.endTime,
          isGeneralSession: values.isGeneralSession,
          tradingPeriods: {
            preOpen: {
              startTime: values.preOpenStartTime,
              endTime: values.preOpenEndTime,
            },
            open: {
              startTime: values.openStartTime,
              endTime: values.openEndTime,
            },
            pause: {
              startTime: values.pauseStartTime,
              endTime: values.pauseEndTime,
            },
            close: {
              startTime: values.closeStartTime,
              endTime: values.closeEndTime,
            },
            maintenancePeriod: {
              startTime: values.maintenanceStartTime,
              endTime: values.maintenanceEndTime,
            },
          },
        }
      })
      .then((res) => {
        if (res.status === 0) {
          toast(res.message, { className: "bg-success text-white" });
        } else {
          toast(
            "Your update was recorded and waiting for approval from admin",
            { className: "bg-success text-white" },
          );
        }
      });
    },
  });

  useEffect(() => {
    tradingSessionService.getOneSession(sessionId).then((res) => {
      setSession(res.payload);
      setIsGeneral(res.payload.isGeneralSession);
    });
  }, []);

  useEffect(() => {
    if (session) {
      formik.setValues({
        isGeneralSession: session.isGeneralSession,
        commodity: session.commodity,
        item: session.item,
        startTime: session.startTime,
        endTime: session.endTime,
        preOpenStartTime: session.tradingPeriods.preOpen.startTime,
        preOpenEndTime: session.tradingPeriods.preOpen.endTime,
        openStartTime: session.tradingPeriods.open.startTime,
        openEndTime: session.tradingPeriods.open.endTime,
        pauseStartTime: session.tradingPeriods.pause.startTime,
        pauseEndTime: session.tradingPeriods.pause.endTime,
        closeStartTime: session.tradingPeriods.close.startTime,
        closeEndTime: session.tradingPeriods.close.endTime,
        maintenanceStartTime: session.tradingPeriods.maintenancePeriod.startTime,
        maintenanceEndTime: session.tradingPeriods.maintenancePeriod.endTime,
      });
    }
  }, [session]);

  document.title = "Trading session";

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
                        <div className="mb-3 d-flex">
                          <Label
                            htmlFor="isGeneralSession-create-session"
                            className="form-label"
                            style={{ marginRight: "16px" }}
                          >
                            {t("General trading session")}
                          </Label>
                          <Input
                            name="isGeneralSession"
                            type="checkbox"
                            className="form-control"
                            id="isGeneralSession-create-session"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.isGeneralSession}
                            checked={formik.values.isGeneralSession}
                            disabled
                          />
                        </div>
                      </Col>
                      {!isGeneral && (
                        <>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="commodity-create-session"
                                className="form-label"
                              >
                                {t("Commodity")}
                              </Label>
                              <Input
                                name="commodity"
                                type="text"
                                className="form-control"
                                id="commodity-create-session"
                                placeholder=""
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.commodity}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="item-create-session"
                                className="form-label"
                              >
                                {t("Item")}
                              </Label>
                              <Input
                                name="item"
                                type="text"
                                className="form-control"
                                id="item-create-session"
                                placeholder=""
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.item}
                                disabled
                              />
                            </div>
                          </Col>
                        </>
                      )}
                      {isGeneral && (
                        <>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="startTime-create-session"
                                className="form-label"
                              >
                                {t("Start time")}
                              </Label>
                              <Input
                                name="startTime"
                                type="time"
                                className="form-control"
                                id="startTime-create-session"
                                placeholder="Enter start time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.startTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.startTime && formik.errors.startTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.startTime && formik.errors.startTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.startTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="endTime-create-session"
                                className="form-label"
                              >
                                {t("End time")}
                              </Label>
                              <Input
                                name="endTime"
                                type="time"
                                className="form-control"
                                id="endTime-create-session"
                                placeholder="Enter end time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.endTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.endTime && formik.errors.endTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.endTime && formik.errors.endTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.endTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </>
                      )}
                      {!isGeneral && (
                        <>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="preOpen-startTime-create-session"
                                className="form-label"
                              >
                                {t("Pre-Open start time")}
                              </Label>
                              <Input
                                name="preOpenStartTime"
                                type="time"
                                className="form-control"
                                id="preOpen-startTime-create-session"
                                placeholder="Enter pre-Open start time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.preOpenStartTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.preOpenStartTime && formik.errors.preOpenStartTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.preOpenStartTime && formik.errors.preOpenStartTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.preOpenStartTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="preOpen-endTime-create-session"
                                className="form-label"
                              >
                                {t("Pre-Open end time")}
                              </Label>
                              <Input
                                name="preOpenEndTime"
                                type="time"
                                className="form-control"
                                id="preOpen-endTime-create-session"
                                placeholder="Enter pre-Open end time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.preOpenEndTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.preOpenEndTime && formik.errors.preOpenEndTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.preOpenEndTime && formik.errors.preOpenEndTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.preOpenEndTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="open-startTime-create-session"
                                className="form-label"
                              >
                                {t("Open start time")}
                              </Label>
                              <Input
                                name="openStartTime"
                                type="time"
                                className="form-control"
                                id="open-startTime-create-session"
                                placeholder="Enter open start timee"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.openStartTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.openStartTime && formik.errors.openStartTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.openStartTime && formik.errors.openStartTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.openStartTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="open-endTime-create-session"
                                className="form-label"
                              >
                                {t("Open end time")}
                              </Label>
                              <Input
                                name="openEndTime"
                                type="time"
                                className="form-control"
                                id="open-endTime-create-session"
                                placeholder="Enter open end time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.openEndTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.openEndTime && formik.errors.openEndTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.openEndTime && formik.errors.openEndTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.openEndTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="pause-startTime-create-session"
                                className="form-label"
                              >
                                {t("Pause start time")}
                              </Label>
                              <Input
                                name="pauseStartTime"
                                type="time"
                                className="form-control"
                                id="pause-startTime-create-session"
                                placeholder="Enter pause start time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.pauseStartTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.pauseStartTime && formik.errors.pauseStartTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.pauseStartTime && formik.errors.pauseStartTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.pauseStartTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="pause-endTime-create-session"
                                className="form-label"
                              >
                                {t("Pause end time")}
                              </Label>
                              <Input
                                name="pauseEndTime"
                                type="time"
                                className="form-control"
                                id="pause-endTime-create-session"
                                placeholder="Enter pause end time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.pauseEndTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.pauseEndTime && formik.errors.pauseEndTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.pauseEndTime && formik.errors.pauseEndTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.pauseEndTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="close-startTime-create-session"
                                className="form-label"
                              >
                                {t("Close start time")}
                              </Label>
                              <Input
                                name="closeStartTime"
                                type="time"
                                className="form-control"
                                id="close-startTime-create-session"
                                placeholder="Enter close start time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.closeStartTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.closeStartTime && formik.errors.closeStartTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.closeStartTime && formik.errors.closeStartTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.closeStartTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="close-endTime-create-session"
                                className="form-label"
                              >
                                {t("Close end time")}
                              </Label>
                              <Input
                                name="closeEndTime"
                                type="time"
                                className="form-control"
                                id="close-endTime-create-session"
                                placeholder="Enter item name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.closeEndTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.closeEndTime && formik.errors.closeEndTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.closeEndTime && formik.errors.closeEndTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.closeEndTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="maintenance-startTime-create-session"
                                className="form-label"
                              >
                                {t("Maintenance start time")}
                              </Label>
                              <Input
                                name="maintenanceStartTime"
                                type="time"
                                className="form-control"
                                id="maintenance-startTime-create-session"
                                placeholder="Enter maintenance start time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.maintenanceStartTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.maintenanceStartTime && formik.errors.maintenanceStartTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.maintenanceStartTime && formik.errors.maintenanceStartTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.maintenanceStartTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="maintenance-endTime-create-session"
                                className="form-label"
                              >
                                {t("Maintenance end time")}
                              </Label>
                              <Input
                                name="maintenanceEndTime"
                                type="time"
                                className="form-control"
                                id="maintenance-endTime-create-session"
                                placeholder="Enter maintenance end time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.maintenanceEndTime}
                                disabled={mode == "view"}
                                invalid={
                                  formik.touched.maintenanceEndTime && formik.errors.maintenanceEndTime
                                    ? true
                                    : false
                                }
                              />
                              {formik.touched.maintenanceEndTime && formik.errors.maintenanceEndTime ? (
                                <FormFeedback type="invalid">
                                  {formik.errors.maintenance-endTime}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </>
                      )}
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
      sessionId: params.tradingSessId,
    },
  };
};

export default SessionDetail;