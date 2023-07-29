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

const ItemDetail = ({itemId}) => {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
  const router = useRouter();
  const api = new APIClient();

  

  const [item, setItem] = useState(undefined);
  const [mode, setMode] = useState("view");

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    commodityService.getOneItem(itemId).then((res) => {
      setItem(res.payload);
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
      code: Yup.string().required("Please Enter Item Code").min(3, 'Too short'),
      name: Yup.string().required("Please Enter Item Name"),
    }),
    onSubmit(values) {
      commodityService.updateItem(itemId,{
        name: values.name,
        status: values.status,
        note: values.note
      })
      setMode("view");
    },
  });


  useEffect(() => {
    commodityService.getOneItem(itemId).then((res) => {
      setItem(res.payload);
    });
  }, []);

  useEffect(() => {
    if (item) {
      formik.setValues(item);
    }
  }, [item]);

  const columnDefs = [
    {
      field: "code",
      headerName: t("Code"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 160,
    },
    {
      field: "name",
      headerName: t("Name"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 360,
    },
    {
      field: "status",
      headerName: t("Status"),
      sortable: true,
      maxWidth: 120,
      filter: 'agSetColumnFilter',
      filterParams: { 
        values: ["active","inactive"]
      }
    },
    {
      field: "note",
      headerName: t("Note"),
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
    sortable: true,
    filter: true,
    resizable: true,
    menuTabs: ["filterMenuTab"],
  };
  

  const onRowDoubleClicked = (e) => {
    router.push("/commodityManagement/commodity/"+e.data.id);
  };

  document.title = "Item";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
          <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t('Item Detail')}</h4>
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
                                    placeholder="Enter item code"
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
                                    placeholder="Enter item name"
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
                                      placeholder="Enter item status"
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
                                    placeholder="Enter item note"
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
                <CardBody>
                  {item&&
                  <>
                  {item.instrument &&(
                      <div>
                      <ShareValues values={item.instrument} groupName="item" type="update" parentId={item.id}></ShareValues>
                    </div>
                  )}
                  {!item.instrument &&(
                      <div>
                      <ShareValues groupName="item" type="create" parentId={item.id}></ShareValues>
                    </div>)}
                    </>
                  }
                </CardBody>
              </Card>
            </Col>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t('Commodity')}</h4>
                  <div className="flex-shrink-0">
                    <Link href={"/commodityManagement/items/"+itemId+"/createCommodity"}>
                      <Button
                        color="primary"
                        className="btn-soft-success"
                        style={{ border: "none" }}
                      >
                        {t("Add Commodity")}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>

                <CardBody>
                {!item && (
                  <div className="text-center">
                    <Image src={loadingGif} alt="" />
                  </div>
                )}
                {item&&
                  <div className="table-card table-responsive">
                    <div
                      className="ag-theme-alpine"
                      style={{ width: "auto", height: 360 }}
                    >
                      <AgGridReact
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowData={item.commodity}
                        animateRows={true}
                        onRowDoubleClicked={onRowDoubleClicked}
                      />
                    </div>
                  </div>}
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
      props: {itemId: params.itemId},
    };
  }
export default ItemDetail;
