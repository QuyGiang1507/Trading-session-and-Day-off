import React, { useCallback,useState,useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { APIClient } from "helpers/api_helper";
import classnames from "classnames";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "components/Common/BreadCrumb";
import { Link } from "components";
import {useRouter} from "next/router"
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {useFormik} from "formik";
import { commodityService } from "services";
import ShareValues from "components/commodity/ShareValues";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";

const ContractDetail = ({contractId}) => {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
  const router = useRouter();
  console.log(contractId)
  const api = new APIClient();

  const [tabs, setTabs]= useState(undefined)

  const [activeTab, setActiveTab] = useState("Default");
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [contract, setContract] = useState(undefined);
  const [mode, setMode] = useState("view");

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    commodityService.getOneContract(contractId).then((res) => {
      setContract(res.payload);
    });
    setMode("view");
  };
  
  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      code:"",
      name:"",
      status:"",  
      note:"",
      dueMonth: "",
      dueYear:"",
      firstTradingDay: "",
      lastTradingDay: "",
      firstNoticeDay: "",
      lastNoticeDay: "",
      firstDeliveryDay: "",
      lastDeliveryDay: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Please Enter Contract Status")
    }),
    onSubmit(values) {
      console.log(values)
      commodityService.updateContract(contractId,{
        status: values.status,
        note: values.note,
        firstTradingDay: values.firstTradingDay,
        lastTradingDay: values.lastTradingDay,
        firstNoticeDay: values.firstNoticeDay,
        lastNoticeDay: values.lastNoticeDay,
        firstDeliveryDay: values.firstDeliveryDay,
        lastDeliveryDay: values.lastDeliveryDay,
      })
      setMode("view");
    },
  });


  useEffect(() => {
    commodityService.getOneContract(contractId).then((res) => {
      console.log(res)
      setContract(res.payload);
      setTabs(res.payload.instrument)
    });
  }, []);

  useEffect(() => {
    if (contract) {
      formik.setValues(contract);
    }
  }, [contract]);

  
  document.title = "Contract";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
          <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t('Contract')}</h4>
                </CardHeader>
                    
                <CardBody>
                <Form
                className="needs-validation"
                            onSubmit={formik.handleSubmit}
                            action="#"
                            autoComplete="off"
                            >
                        <Row>
                            <Col lg={3}>
                                <div className="mb-3">
                                    <Label htmlFor="codeInput" className="form-label">
                                        {t("Code")}
                                    </Label>
                                    <Input
                                    name="code"
                                    type="text"
                                    className="form-control"
                                    id={"code"}
                                    placeholder="Enter contract code"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.code}
                                    invalid={
                                      formik.touched.code && formik.errors.code
                                        ? true
                                        : false
                                    }
                                    disabled
                                    autoComplete="off"
                                  />
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="nameInput" className="form-label">
                                  {t("Name")}
                                  </Label>
                                  <Input
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    id="nameInput"
                                    placeholder="Enter contract name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    invalid={
                                      formik.touched.name && formik.errors.name
                                        ? true
                                        : false
                                    }
                                    disabled
                                  />
                                  {formik.touched.name && formik.errors.name ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.name}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="statusInput" className="form-label">
                                  {t("Status")}
                                  </Label>
                                  <div className="form-icon right">
                                    <Input
                                      name="status"
                                      type="select"
                                      className="form-control form-control-icon"
                                      id="statusInput"
                                      placeholder="Enter contract status"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      value={formik.values.status}
                                      invalid={
                                        formik.touched.status && formik.errors.status
                                          ? true
                                          : false
                                      }
                                      disabled={mode == "view"}
                                    >
                                      <option value={"active"}>{t("active")}</option>
                                      <option value={"inactive"}>{t("inactive")}</option>
                                    </Input>
                                  </div>
                                  {formik.touched.status && formik.errors.status ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.status}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="noteInput" className="form-label">
                                    Note
                                  </Label>
                                  <Input
                                    name="note"
                                    type="text"
                                    className="form-control"
                                    id="noteInput"
                                    placeholder="Enter contract note"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.note}
                                    invalid={
                                      formik.touched.note && formik.errors.note
                                        ? true
                                        : false
                                    }
                                    disabled={mode == "view"}
                                  />
                                  {formik.touched.note && formik.errors.note ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.note}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="dueMonthInput" className="form-label">
                                    {t("dueMonth")}
                                  </Label>
                                  <Input
                                    name="dueMonth"
                                    type="text"
                                    className="form-control"
                                    id="dueMonthInput"
                                    placeholder="Enter contract dueMonth"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dueMonth}
                                    invalid={
                                      formik.touched.dueMonth && formik.errors.dueMonth
                                        ? true
                                        : false
                                    }
                                    disabled
                                  />
                                  {formik.touched.dueMonth && formik.errors.dueMonth ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.dueMonth}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="dueYearInput" className="form-label">
                                    {t("dueYear")}
                                  </Label>
                                  <Input
                                    name="dueYear"
                                    type="text"
                                    className="form-control"
                                    id="dueYearInput"
                                    placeholder="Enter contract dueYear"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dueYear}
                                    invalid={
                                      formik.touched.dueYear && formik.errors.dueYear
                                        ? true
                                        : false
                                    }
                                    disabled
                                  />
                                  {formik.touched.dueYear && formik.errors.dueYear ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.dueYear}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="firstTradingDayInput" className="form-label">
                                    {t("firstTradingDay")}
                                  </Label>
                                  <Flatpickr
                                    name="firstTradingDay"
                                    className="form-control"
                                    id="lastTradingDayInput"
                                    options={{
                                      dateFormat: "d/m/Y"
                                    }}
                                    invalid={
                                      formik.touched.firstTradingDay && formik.errors.firstTradingDay
                                        ? true
                                        : false
                                    }
                                    value={formik.values.firstTradingDay}
                                    disabled={mode == "view"}
                                    style={mode == "view"?{background: "#eff2f7"}:null}
                                    onChange={e=>formik.setFieldValue("firstTradingDay",e.toLocaleString("vi-VN").slice(9))}
                                  />
                                  {formik.touched.firstTradingDay && formik.errors.firstTradingDay ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.firstTradingDay}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="lastTradingDayInput" className="form-label">
                                    {t("lastTradingDay")}
                                  </Label>
                                  <Flatpickr
                                    name="lastTradingDay"
                                    className="form-control"
                                    id="lastTradingDayInput"
                                    options={{
                                      dateFormat: "d/m/Y"
                                    }}
                                    invalid={
                                      formik.touched.lastTradingDay && formik.errors.lastTradingDay
                                        ? true
                                        : false
                                    }
                                    value={formik.values.lastTradingDay}
                                    disabled={mode == "view"}
                                    style={mode == "view"?{background: "#eff2f7"}:null}
                                    onChange={e=>formik.setFieldValue("lastTradingDay",e.toLocaleString("vi-VN").slice(9))}
                                  />
                                  {formik.touched.lastTradingDay && formik.errors.lastTradingDay ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.lastTradingDay}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="firstNoticeDayInput" className="form-label">
                                    {t("firstNoticeDay")}
                                  </Label>
                                  <Flatpickr
                                    name="firstNoticeDay"
                                    className="form-control"
                                    id="firstNoticeDayInput"
                                    options={{
                                      dateFormat: "d/m/Y"
                                    }}
                                    invalid={
                                      formik.touched.firstNoticeDay && formik.errors.firstNoticeDay
                                        ? true
                                        : false
                                    }
                                    value={formik.values.firstNoticeDay}
                                    disabled={mode == "view"}
                                    style={mode == "view"?{background: "#eff2f7"}:null}
                                    onChange={e=>formik.setFieldValue("firstNoticeDay",e.toLocaleString("vi-VN").slice(9))}
                                  />
                                  {formik.touched.firstNoticeDay && formik.errors.firstNoticeDay ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.firstNoticeDay}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="lastNoticeDayInput" className="form-label">
                                    {t("lastNoticeDay")}
                                  </Label>
                                  <Flatpickr
                                    name="lastNoticeDay"
                                    className="form-control"
                                    id="lastNoticeDayInput"
                                    options={{
                                      dateFormat: "d/m/Y"
                                    }}
                                    invalid={
                                      formik.touched.lastNoticeDay && formik.errors.lastNoticeDay
                                        ? true
                                        : false
                                    }
                                    value={formik.values.lastNoticeDay}
                                    disabled={mode == "view"}
                                    style={mode == "view"?{background: "#eff2f7"}:null}
                                    onChange={e=>formik.setFieldValue("lastNoticeDay",e.toLocaleString("vi-VN").slice(9))}
                                  />
                                  {formik.touched.lastNoticeDay && formik.errors.lastNoticeDay ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.lastNoticeDay}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="firstDeliveryDayInput" className="form-label">
                                    {t("firstDeliveryDay")}
                                  </Label>
                                  <Flatpickr
                                    name="firstDeliveryDay"
                                    className="form-control"
                                    id="firstDeliveryDayInput"
                                    options={{
                                      dateFormat: "d/m/Y"
                                    }}
                                    invalid={
                                      formik.touched.firstDeliveryDay && formik.errors.firstDeliveryDay
                                        ? true
                                        : false
                                    }
                                    value={formik.values.firstDeliveryDay}
                                    disabled={mode == "view"}
                                    style={mode == "view"?{background: "#eff2f7"}:null}
                                    onChange={e=>formik.setFieldValue("firstDeliveryDay",e.toLocaleString("vi-VN").slice(9))}
                                  />
                                  {formik.touched.firstDeliveryDay && formik.errors.firstDeliveryDay ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.firstDeliveryDay}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Label htmlFor="lastDeliveryDayInput" className="form-label">
                                    {t("lastDeliveryDay")}
                                  </Label>
                                  <Flatpickr
                                    name="lastDeliveryDay"
                                    className="form-control"
                                    id="lastDeliveryDayInput"
                                    options={{
                                      dateFormat: "d/m/Y"
                                    }}
                                    invalid={
                                      formik.touched.lastDeliveryDay && formik.errors.lastDeliveryDay
                                        ? true
                                        : false
                                    }
                                    value={formik.values.lastDeliveryDay}
                                    disabled={mode == "view"}
                                    style={mode == "view"?{background: "#eff2f7"}:null}
                                    onChange={e=>formik.setFieldValue("lastDeliveryDay",e.toLocaleString("vi-VN").slice(9))}
                                  />
                                  {formik.touched.lastDeliveryDay && formik.errors.lastDeliveryDay ? (
                                    <FormFeedback type="invalid">
                                      {formik.errors.lastDeliveryDay}
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
            {/* <Col lg={12}>
              <Card>
              <CardHeader>
              <h4 className="card-title mb-0 flex-grow-1">{t('Properties')}</h4>
              </CardHeader>
                <CardBody>
                <TabContent activeTab={activeTab}>

                {contract&&
                  <>
                  {contract.instrument &&(
                      <div>
                      <ShareValues values={contract.instrument} groupName="contract" type="update" parentId={contract.id}></ShareValues>
                    </div>
                  )}
                  {!contract.instrument &&(
                      <div>
                      <ShareValues groupName="contract" type="create" parentId={contract.id}></ShareValues>
                    </div>)}
                    </>
                  }
                  </TabContent>
                </CardBody>
              </Card>
            </Col> */}
            
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export async function getServerSideProps({params}) {
  return {
    props: {
      contractId: params.contractId
  },
  };
}
export default ContractDetail;
