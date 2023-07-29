import React, { useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
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
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { tradingSessionService } from "services";

const TradingSessionList = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const columnDefsMain = [
    {
      field: "name",
      headerName: t("name"),
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      valueGetter: (params) => {
        if (!params.value) {
          return t("General trading session");
        }
        return params.value;
      },
      maxWidth: 240,
    },
    {
      field: "startTime",
      headerName: t("Start time"),
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 200,
    },
    {
      field: "endTime",
      headerName: t("End time"),
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 200,
    },
  ];

  const columnDefs = [
    {
      field: "commodity",
      headerName: t("Commodity"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 240,
    },
    {
      field: "item",
      headerName: t("Item"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 280,
    },
    {
      field: "tradingPeriods.preOpen",
      headerName: t("Pre-Open"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 200,
    },
    {
      field: "tradingPeriods.open",
      headerName: t("Open"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 200,
    },
    {
      field: "tradingPeriods.pause",
      headerName: t("Pause"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 200,
    },
    {
      field: "tradingPeriods.close",
      headerName: t("Close"),
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 200,
    },
    {
      field: "tradingPeriods.maintenancePeriod",
      headerName: t("Maintenance"),
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 200,
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
    filter: true,
    resizable: true,
    menuTabs: false,
  };

  const getDataGeneralSource = () => {
    return {
      getRows: (params) => {
        tradingSessionService
          .getSessions({
            isGeneralSession: true,
            isApproved: "approved",
            tempFor: "null",
          })
          .then((response) => {
            params.successCallback(
              response.payload.data,
              response.payload.rowCount,
            );
          })
          .catch((error) => {
            console.log(error);
          });
      },
    };
  };

  const getGeneralData = useCallback(
    (params) => {
      var datasource = getDataGeneralSource();
      params.api.setServerSideDatasource(datasource);
    },
    [getDataGeneralSource],
  );

  const getDataSource = () => {
    return {
      getRows: (params) => {
        tradingSessionService
          .getSessions({
            isGeneralSession: false,
            isApproved: "approved",
            tempFor: "null",
            sortModel: params.request.sortModel,
          })
          .then((response) => {
            params.successCallback(
              response.payload.data,
              response.payload.rowCount,
            );
          })
          .catch((error) => {
            console.log(error);
          });
      },
    };
  };

  const getData = useCallback(
    (params) => {
      var datasource = getDataSource();
      params.api.setServerSideDatasource(datasource);
    },
    [getDataSource],
  );

  const onRowDoubleClicked = (e) => {
    router.push("/systemManagement/tradingSession/" + e.data.id);
  };

  document.title = t("Trading session");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t("List")}</h4>
                  <div className="flex-shrink-0">
                    <Link
                      href={"/systemManagement/tradingSession/createSession"}
                    >
                      <Button
                        color="primary"
                        className="btn-soft-success"
                        style={{ border: "none" }}
                      >
                        {t("Add Trading Session")}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-card table-responsive">
                    <div
                      className="ag-theme-alpine"
                      style={{ width: "auto", height: 100 }}
                    >
                      <AgGridReact
                        columnDefs={columnDefsMain}
                        defaultColDef={defaultColDef}
                        rowModelType={"serverSide"}
                        serverSideInfiniteScroll={true}
                        pagination={false}
                        paginationPageSize={1}
                        cacheBlockSize={1}
                        animateRows={false}
                        onRowDoubleClicked={onRowDoubleClicked}
                        onGridReady={getGeneralData}
                      />
                    </div>
                  </div>
                </CardBody>
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
export default TradingSessionList;