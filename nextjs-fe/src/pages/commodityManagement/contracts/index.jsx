import React, { useCallback, useEffect, useState } from "react";
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { Link } from "components";
import {useRouter} from "next/router"
import { useTranslation } from "react-i18next";
import { commodityService } from "services";
const ContractList = () => {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_URL_COMMODITY_SERVICE;
  const router = useRouter();
  const api = new APIClient();

  

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
      maxWidth: 240,
    },
    {
      field: "commodity.code",
      headerName: t("commodityCode"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 160,
    },
    {
      field: "commodity.name",
      headerName: t("commodityName"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
    },
    {
      field: "item.code",
      headerName: t("itemCode"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 160,
    },
    {
      field: "item.name",
      headerName: t("itemName"),
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
  const getDatasource = () => {
    return {
      getRows: (params) => {
        commodityService
          .getContract({
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
    router.push("/commodityManagement/contracts/" + e.data.id);
  };

  document.title = "Department List";

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
                    <Link href={"/commodityManagement/contracts/createContract"}>
                      <Button
                        color="primary"
                        className="btn-soft-success"
                        style={{ border: "none" }}
                      >
                        {t("Add Contract")}
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
export default ContractList;
