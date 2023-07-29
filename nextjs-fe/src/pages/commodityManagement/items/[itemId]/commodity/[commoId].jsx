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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
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

const ItemDetail = ({itemId,commoId}) => {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
  const router = useRouter();
  const api = new APIClient();

  const [tabs, setTabs]= useState(undefined)

  const [activeTab, setActiveTab] = useState("Default");
  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [commo, setCommo] = useState(undefined);
  const [mode, setMode] = useState("view");

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    commodityService.getOneCommo(commoId).then((res) => {
      setCommo(res.payload);
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
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Please Enter Commo Code").min(3, 'Too short'),
      name: Yup.string().required("Please Enter Commo Name"),
    }),
    onSubmit(values) {
      commodityService.updateCommo(commoId,{
        code: values.code,
        name: values.name,
        status: values.status,
        note: values.note
      })
      setMode("view");
    },
  });


  useEffect(() => {
    commodityService.getOneCommo(commoId).then((res) => {
      setCommo(res.payload);
      setTabs(res.payload.instrument)
    });
  }, []);

  useEffect(() => {
    if (commo) {
      formik.setValues(commo);
    }
  }, [commo]);

  
  document.title = "Commodity";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
          <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t('Commodity')}</h4>
                </CardHeader>
                    
                <CardBody>
                <Form
                className="needs-validation"
                            onSubmit={formik.handleSubmit}
                            action="#"
                            autoComplete="off"
                            >
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label htmlFor="codeInput" className="form-label">
                                        {t("Code")}
                                    </Label>
                                    <Input
                                    name="code"
                                    type="text"
                                    className="form-control"
                                    id={"code"}
                                    placeholder="Enter commo code"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.code}
                                    invalid={
                                      formik.touched.code && formik.errors.code
                                        ? true
                                        : false
                                    }
                                    disabled={mode == "view"}
                                    autoComplete="off"
                                  />
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="mb-3">
                                  <Label htmlFor="nameInput" className="form-label">
                                  {t("Name")}
                                  </Label>
                                  <Input
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    id="nameInput"
                                    placeholder="Enter commo name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    invalid={
                                      formik.touched.name && formik.errors.name
                                        ? true
                                        : false
                                    }
                                    disabled={mode == "view"}
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
                                  <Label htmlFor="statusInput" className="form-label">
                                  {t("Status")}
                                  </Label>
                                  <div className="form-icon right">
                                    <Input
                                      name="status"
                                      type="select"
                                      className="form-control form-control-icon"
                                      id="statusInput"
                                      placeholder="Enter commo status"
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
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Label htmlFor="noteInput" className="form-label">
                                    Note
                                  </Label>
                                  <Input
                                    name="note"
                                    type="text"
                                    className="form-control"
                                    id="noteInput"
                                    placeholder="Enter commo note"
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
            <Col lg={12}>
              <Card>
              <CardHeader>
              <h4 className="card-title mb-0 flex-grow-1">{t('Share Values')}</h4>
              </CardHeader>
              <CardHeader>
                  <Nav
                      className="nav-tabs-custom rounded card-header-tabs border-bottom-0 d-flex"
                      role="tablist"
                    >
                      {commo&&commo.instrument.map((e,index)=>{
                        return(
                        <NavItem key={e.id}>
                        <NavLink
                          href="#"
                          className={classnames({ active: activeTab === e.name })}
                          onClick={() => {
                            tabChange(e.name);
                          }}
                        > 
                          {e.name}
                        </NavLink>
                      </NavItem>
                        )
                      })}
                      <div className="ms-auto my-auto">
                    </div>
                    </Nav>
                </CardHeader>
                <CardBody>
                <TabContent activeTab={activeTab}>

                {commo&&
                  <>
                  {commo.instrument &&commo.instrument.map((e,index)=>{
                        return(
                      <TabPane tabId={e.name} key={e.id}>
                        <ShareValues values={e} groupName="commo" type="update" parentId={commo.id} instrumentType= {activeTab}></ShareValues>
                      </TabPane>
                  )})}
                  {!commo.instrument &&(
                      <div>
                        <ShareValues groupName="commodity" type="create" parentId={commo.id} instrumentType= {activeTab}></ShareValues>
                      </div>)}
                    </>
                  }
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export async function getServerSideProps({params}) {
    return {
      props: {
        itemId: params.itemId,
        commoId: params.commoId
    },
    };
  }
export default ItemDetail;
