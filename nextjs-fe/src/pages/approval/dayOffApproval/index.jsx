import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import classnames from "classnames";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { dayOffService  } from "services";

const DayOffApproval = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setactiveTab] = useState("pending");
  const status = ["pending", "approved", "rejected"];

  const columnDefs = (e) => [
    {
      headerName: t("action"),
      cellRenderer: (data) => {
        return data.data.updatedAt ? "Update" : "Create";
      },
      sortable: false,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 160,
    },
    {
      field: "description",
      headerName: t("Description"),
      cellRenderer: (data) => {
        return data.data.description ? data.data.description : "Fixed day off";
      },
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 280,
    },
    {
      field: "status",
      headerName: t("status"),
      maxWidth: 120,
    },
    {
      field: "days",
      headerName: t("Day"),
      cellRenderer: (data) => {
        return data.data.days.length > 1 && data.data.days[1] !== null ? `From ${new Date(data.data.days[0]).toLocaleString("en-GB").slice(0, 10)} to ${new Date(data.data.days[1]).toLocaleString("en-GB").slice(0, 10)}` : data.data.days.length > 0 && data.data.days[1] === null ? `${new Date(data.data.days[0]).toLocaleString("en-GB").slice(0, 10)}` : data.data.days[0];
      },
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 240,
    },
    {
      field: "createdAt",
      cellRenderer: (data) => {
        return data.data.createdAt ? new Date(data.data.createdAt).toLocaleString("vi-VN").slice(0, 20) : data.data.updatedAt ? new Date(data.data.updatedAt).toLocaleString("vi-VN").slice(0, 20) : "";
      },
      headerName: t("createdAt"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 160,
    },
    {
      field: "approvalDate",
      cellRenderer: (data) => {
        return data.data.approvalDate ? new Date(data.data.approvalDate).toLocaleString("vi-VN").slice(0, 20) : "";
      },
      headerName: t("approvalDate"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      hide: e != "approved" && e != "rejected",
      maxWidth: 200,
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
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    resizable: true,
    menuTabs: false,
  };
  
  const getDatasource = (e) => {
    return {
      getRows: (params) => {
        params.request.filterModel.status = {
          filterType: "text",
          type: "contains",
          filter: e,
        };
        dayOffService
          .getDayOffs({
            status: params.request.filterModel.status.filter,
            sortModel: params.request.sortModel,
          })
          .then((response) => {
            params.successCallback(
              response.payload.rowData,
              response.payload.rowCount,
            );
          })
          .catch((error) => {
            console.log(error);
          });
      },
    };
  };

  const getData = (e) => (params) => {
    var datasource = getDatasource(e);
    params.api.setServerSideDatasource(datasource);
  };

  const onRowDoubleClicked = (e) => {
    router.push("/approval/dayOffApproval/" + e.data.id);
  };
  
  document.title = "Approval List";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0 d-flex"
                    role="tablist"
                  >
                    {status.map((e) => {
                      return (
                        <NavItem key={e}>
                          <NavLink
                            href="#"
                            className={classnames({ active: activeTab === e })}
                            onClick={() => {
                              setactiveTab(e);
                            }}
                          >
                            {t(e)}
                          </NavLink>
                        </NavItem>
                      );
                    })}
                  </Nav>
                </CardHeader>
                <CardBody>
                  <TabContent activeTab={activeTab}>
                    {status.map((e) => {
                      return (
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
                      );
                    })}
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

export default DayOffApproval;