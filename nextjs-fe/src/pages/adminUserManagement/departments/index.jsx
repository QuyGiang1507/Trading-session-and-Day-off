import React, { useCallback } from "react";
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
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { Link } from "components";
import {useRouter} from "next/router"
import { useTranslation } from "react-i18next";
import { departmentService } from "services";

const DepartmentList = () => {
  const { t } = useTranslation();
  const router = useRouter();
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
    },
    {
      field: "status",
      headerName: t("Status"),
      sortable: true,
      filter: 'agSetColumnFilter',
      filterParams: { 
        values: ["active","inactive"]
      }
    },
    {
        field: "note",
        headerName: t("Note"),
        sortable: true,
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
        departmentService.getDepartments({
            startRow: params.request.startRow,
            endRow: params.request.endRow,
            sortModel: params.request.sortModel,
            filterModel: params.request.filterModel,
          })
          .then((response) => {
            console.log(response);
            params.successCallback(response.payload.data, response.payload.rowCount);
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
    router.push("/adminUserManagement/departments/" + e.data.id);
  };

  document.title = t("Department List");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t('List')}</h4>
                  <div className="flex-shrink-0">
                    <Link href="/adminUserManagement/departments/createDept">
                      <Button
                        color="primary"
                        className="btn-soft-success"
                        style={{ border: "none" }}
                      >
                        {t('Add Department')}
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

          {/* <Row className="mb-3 pb-1">
            <Col xs={12}>
              <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                <div className="mt-3 mt-lg-0">
                  <Row className="g-3 mb-0 align-items-center">
                    <div className="col-auto">
                      <Link to="/users/create">
                        <Button className="mt-2 btn-soft-success">
                          {t('Add user')}
                        </Button>
                      </Link>
                    </div>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
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
            </Col>
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};
export default DepartmentList;
