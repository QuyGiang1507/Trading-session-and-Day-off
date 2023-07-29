import React, { useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";
import { tradingSessionService } from "services";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ApprovalDetail = ({ id }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState("pending");
  const [updatedAt, setUpdatedAt] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [approvedAt, setApprovedAt] = useState("");
  const columnDefs = [
    {
      field: "property",
      headerName: t("Property"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 280,
    },
    {
      field: "oldValue",
      headerName: t("Old Value"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 560,
    },
    {
      field: "pendingValue",
      headerName: t("Pending Value"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      maxWidth: 560,
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

  const getDataSource = () => {
    return {
      getRows: (params) => {
        tradingSessionService
          .getApprovalSession(id)
          .then((response) => {
            setStatus(response.payload.status);
            setUpdatedAt(response.payload.updatedAt ? new Date(response.payload.updatedAt).toLocaleString("vi-VN").slice(0, 20) : "");
            setCreatedAt(response.payload.createdAt ? new Date(response.payload.createdAt).toLocaleString("vi-VN").slice(0, 20) : response.payload.updatedAt ? new Date(response.payload.updatedAt).toLocaleString("vi-VN").slice(0, 20) : "");
            setApprovedAt(response.payload.approvedAt ? new Date(response.payload.approvedAt).toLocaleString("vi-VN").slice(0, 20) : "");
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

  const getData = useCallback(
    (params) => {
      var datasource = getDataSource();
      params.api.setServerSideDatasource(datasource);
    },
    [getDataSource],
  );

  const approveSubmit = async () => {
    await tradingSessionService
      .approveSession({
        tradingSessionId: id,
        approvalStatus: "approved",
      })
      .then((res) => {
        if (res.status === 1) {
          toast(
            "The record has been approved",
            { className: "bg-success text-white" },
          );
          router.push("/approval/sessionApproval");
        }
      })
      .catch((e) => console.log(e));
  };

  const rejectSubmit = async () => {
    await tradingSessionService
      .approveSession({
        tradingSessionId: id,
        approvalStatus: "rejected",
      })
      .then((res) => {
        if (res.status === 1) {
          toast(
            "The record has been rejected",
            { className: "bg-success text-white" },
          );
          router.push("/approval/sessionApproval");
        }
      })
      .catch((e) => console.log(e));
  };

  document.title = "Appoval Form";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h5>{t("ApprovalInfo")}</h5>
                  <hr />
                  <Row className="align-center">
                    <Col lg={6} className={"d-flex justify-content-center"}>
                      <Label className="font-weight-bold">{t("id")}: </Label>
                      <div>&nbsp;{id}</div>
                    </Col>
                    <Col lg={6} className={"d-flex justify-content-center"}>
                      <Label>{t("action")}: </Label>
                      <div>&nbsp;{updatedAt ? t("Update") : t("Create")}</div>
                    </Col>

                    <Col lg={6} className={"d-flex justify-content-center"}>
                      <Label className="font-weight-bold">
                        {t("createdAt")}:{" "}
                      </Label>
                      <div>&nbsp;{createdAt}</div>
                    </Col>
                    <Col lg={6} className={"d-flex justify-content-center"}>
                      <Label>{t("status")}:{" "}</Label>
                      <div>&nbsp;{status}</div>
                    </Col>
                    <>
                      <Col lg={6} className={"d-flex justify-content-center"}>
                        <Label className="font-weight-bold">
                          {t("updatedAt")}:{" "}
                        </Label>
                        <div>&nbsp;{updatedAt}</div>
                      </Col>
                      <Col lg={6} className={"d-flex justify-content-center"}>
                        <Label>{t("approvedAt")}:</Label>
                        <div>&nbsp;{approvedAt}</div>
                      </Col>
                    </>
                  </Row>
                  <h5>{t("ApprovalInfo")}</h5>
                  <div className="table-responsive">
                    <div
                      className="ag-theme-alpine"
                      style={{ width: "auto", height: 400 }}
                    >
                      <AgGridReact
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowModelType={"serverSide"}
                        serverSideInfiniteScroll={true}
                        cacheBlockSize={20}
                        animateRows={true}
                        onGridReady={getData}
                      />
                    </div>
                  </div>
                  {status === "pending" ?
                    <>
                      <Col lg={12} className="mt-4">
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={approveSubmit}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={rejectSubmit}
                          >
                            Reject
                          </button>
                        </div>
                      </Col>
                    </>
                  : ""}
                  
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
      id: params.sessionApprovalId,
    },
  };
};

export default ApprovalDetail;