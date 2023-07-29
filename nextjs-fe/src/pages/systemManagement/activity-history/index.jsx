import React, {useRef, useCallback} from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
} from "reactstrap";
import {AgGridReact} from "ag-grid-react";

import BreadCrumb from "components/Common/BreadCrumb";
import {ActivityHistoryService} from "services/activityHistory.service";
import {useTranslation} from "react-i18next";

const ActivityHistory = () => {
  const {t} = useTranslation();
  const gridRef = useRef();
  const columnDefs = [
    {
      field: "stt",
      headerName: "STT",
      width: 100,
      maxWidth: 100,
    },
    {
      field: "userId",
      headerName: t("User"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains"],
        suppressAndOrCondition: true,
      },
    },
    {
      field: "action",
      headerName: t("action"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains"],
        suppressAndOrCondition: true,
      },
    },
    {
      field: "datetime",
      headerName: t("time"),
      sortable: true,
      filter: "agDateColumnFilter",
      filterParams: {
        filterOptions: ["inRange", "blank"],
        minValidYear: 2000,
        maxValidYear: 2030,
        inRangeFloatingFilterDateFormat: "Do MMM YYYY",
      },
    },
    {
      field: "description",
      headerName: t("Description"),
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains"],
        suppressAndOrCondition: true,
      },
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 50,
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
        let datetime = {};
        if (params.request.filterModel?.datetime) {
          datetime = {...params.request.filterModel?.datetime};
          datetime["dateFrom"] = Math.floor(
            new Date(params.request.filterModel?.datetime.dateFrom).getTime()
          );
          datetime["dateTo"] = Math.floor(
            new Date(params.request.filterModel?.datetime.dateTo).getTime()
          );
        }

        let request = {...params.request};
        if (Object.keys(datetime).length > 0) request.filterModel.datetime = datetime;
        ActivityHistoryService.getListActivityHistory(request).then((response) => {
          let i = 1;
          response.payload.data.forEach((element) => {
            element["stt"] = params.request.startRow + i++;
            element["datetime"] = new Date(element["datetime"]).toLocaleString();
          });
          params.successCallback(response.payload.data, response.payload.rowCount);
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

  const refreshCache = useCallback((route) => {
    gridRef.current.api.refreshServerSide({route: route, purge: true});
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0 flex-grow-1">{t('List')}</h4>
                </CardHeader>
                <CardBody>
                  <div className="table-card table-responsive">
                    <div className="ag-theme-alpine" style={{width: "auto", height: 540}}>
                      <AgGridReact
                        ref={gridRef}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowModelType={"serverSide"}
                        serverSideInfiniteScroll={true}
                        pagination={true}
                        paginationPageSize={10}
                        cacheBlockSize={20}
                        onGridReady={getData}
                      />
                    </div>
                  </div>
                  <hr />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ActivityHistory;
