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
import { approvalService } from "services";
import { useRef } from "react";
const ApprovalList = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab,setactiveTab]= useState("pending");
  const status= ["pending","approved","rejected"]

  const columnDefs =(e)=> ([
    {
      field: "action",
      headerName: t("action"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 120,
    },
    {
      field: "description",
      headerName: t("description"),
    },
    {
      field: "status",
      headerName: t("status"),
      maxWidth: 120,
    },
    {
      field: "createdBy",
      headerName: t("createdBy"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
    },
    {
      field: "createdAt",
      cellRenderer: (data) => {
        return data.value ? (new Date(data.value)).toLocaleString("vi-VN") : '';
      },
      headerName: t("createdAt"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
    },
    {
      field: "approvalDate",
      cellRenderer: (data) => {
        return data.value ? (new Date(data.value)).toLocaleString("vi-VN") : '';
      },
      headerName: t("approvalDate"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      hide: e!="approved" && e!="rejected"
    },
    {
      field: "id",
      headerName: t("id"),
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
    }, 
  ]);

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
  const getDatasource = (e) => {
    return {
      getRows: (params) => {
        params.request.filterModel.status={
          filterType: "text",
          type: "contains",
          filter:e
        }
        approvalService
          .getList({
            startRow: params.request.startRow,
            endRow: params.request.endRow,
            sortModel: params.request.sortModel,
            filterModel: params.request.filterModel,
          },props.service)
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

  const getData = (e)=>(
    (params) => {
      var datasource = getDatasource(e);
      params.api.setServerSideDatasource(datasource);
    }
  );

  const onRowDoubleClicked = (e) => {
    router.push("/approval/"+props.title+"/"+e.data.id)
  };

  document.title = "Approval List";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0 d-flex"
                    role="tablist"
                  >
                      {status.map((e)=>{return(
                    <NavItem key={e}>
                      <NavLink
                        href="#"
                        className={classnames({ active: activeTab === e })}
                        onClick={() => {
                          setactiveTab(e)
                        }}
                      > 
                        {t(e)}
                      </NavLink>
                    </NavItem>)})}
                  </Nav>
                </CardHeader>
                <CardBody>

                  <TabContent activeTab={activeTab}>
                {status.map((e)=>{return(
                      <TabPane tabId={e} key={e}>
                      <div className="table-card table-responsive">
                      <div
                        className="ag-theme-alpine"
                        style={{ width: "auto", height: 540 }}
                      >
                        <AgGridReact
                          columnDefs={columnDefs(e)}
                          defaultColDef={defaultColDef}
                          rowModelType={"serverSide"}
                          serverSideInfiniteScroll={true}
                          pagination={true}
                          paginationPageSize={10}
                          cacheBlockSize={20}
                          animateRows={true}
                          onRowDoubleClicked={onRowDoubleClicked}
                          onGridReady={getData(e)}
                        />
                      </div>
                    </div>
                    </TabPane>
                    )})}
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
export default ApprovalList;
