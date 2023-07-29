import React, { useCallback,useState,useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { APIClient } from "helpers/api_helper";
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
  FormFeedback
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { Link } from "components";
import {useRouter} from "next/router"
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {useFormik} from "formik";
import { departmentService } from "services";


const DepartmentDetail = ({deptId}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [department, setDepartment] = useState(undefined);
  const [mode, setMode] = useState("view");

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    departmentService.getOneDepartment(deptId).then((res) => {
      setDepartment(res.data);
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
      code: Yup.string().required("Please Enter Department Code"),
      name: Yup.string().required("Please Enter Department Name"),
    }),
    onSubmit(values) {
      departmentService.updateDepartment(deptId,{
        code: values.code,
        name: values.name,
        status: values.status,
        note: values.note
      })
      setMode("view");
    },
  });

  useEffect(() => {
    departmentService.getOneDepartment(deptId).then((res) => {
      setDepartment(res.payload.department);
    });
  }, []);

  useEffect(() => {
    if (department) {
      formik.setValues(department);
    }
  }, [department]);

  const columnDefs = [
    {
      field: "username",
      headerName: "username",
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
    },
    {
      field: "email",
      headerName: "Email",
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
    },
    {
      field: "name",
      headerName: t("name"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
    },
    {
        field: "phone",
        headerName: t("phone"),
        sortable: true,
        filter: "agTextColumnFilter",
        filterParams: {
          filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
          suppressAndOrCondition: true,
        },
      },
    {
      field: "status",
      headerName: t("Status"),
      sortable: true,
    },
    {
        field: "createdAt",
        headerName: t("createdAt"),
        sortable: true,
        cellRenderer: (data) => {
            return data.value ? (new Date(data.value)).toLocaleDateString() : '';
       }
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
  const getDatasource = () => {
    return {
      getRows: (params) => {
        departmentService.getOneDepartment(deptId, {
            startRow: params.request.startRow,
            endRow: params.request.endRow,
            sortModel: params.request.sortModel,
            filterModel: params.request.filterModel,
          })
          .then((response) => {
            console.log(response);
            params.successCallback(response.payload.users.data, response.payload.users.rowCount);
          })
          .catch((error) => {
            console.log(error);
          });
      },
    };
  };

  const getData = useCallback(
    (params) => {
      var datasource = getDatasource();
      params.api.setServerSideDatasource(datasource);
    },
    [getDatasource()]
  );

  const onRowDoubleClicked = (e) => {
    router.push("/adminUserManagement/departments/" + department.id+"/"+e.data.id);
  };

  document.title = t("Department");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
          <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t('Department Detail')}</h4>
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
                                    placeholder="Enter department code"
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
                                    placeholder="Enter department name"
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
                                      placeholder="Enter department status"
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
                                    placeholder="Enter department note"
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
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t('Users')}</h4>
                  <div className="flex-shrink-0">
                    <Link href={"/adminUserManagement/departments/"+deptId+"/createAdminUser"}>
                      <Button
                        color="primary"
                        className="btn-soft-success"
                        style={{ border: "none" }}
                      >
                        Add User
                      </Button>
                    </Link>
                  </div>
                </CardHeader>

                <CardBody>
                  <div className="table-card table-responsive">
                    <div
                      className="ag-theme-alpine"
                      style={{ width: "auto", height: 540 }}
                    >
                      <AgGridReact
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowModelType={"serverSide"}
                        serverSideInfiniteScroll={true}
                        pagination={true}
                        paginationPageSize={10}
                        cacheBlockSize={20}
                        animateRows={true}
                        onRowDoubleClicked={onRowDoubleClicked}
                        onGridReady={getData}
                      />
                    </div>
                  </div>
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
      props: {deptId: params.deptId},
    };
  }
export default DepartmentDetail;
