import React, {useState, useEffect, useCallback, useRef} from "react";
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
import BreadCrumb from "components/Common/BreadCrumb";
import {Link} from "components";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {roleService, userService} from "services";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import {useTranslation} from "react-i18next";
import {APIClient} from "helpers/api_helper";
import {useRouter} from "next/router";
import { departmentService } from "services";


const RoleList = (props) => {
  const {id, userId,user} = props;
  const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
  const {t} = useTranslation();
  const router = useRouter();
  const api = new APIClient();
  const gridRef = useRef();
  const [mode, setMode] = useState("view");

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    setMode("view");
  };
  const submitClick = () => {
    const selected =gridRef.current.api.getSelectedRows();
    let groupRoles=[]
    selected.forEach(e => {
      groupRoles.push({
        id: e.id,
        description: e.description
      })
    });
    departmentService.assignGroupRoles(userId,{
      groupRoles:groupRoles
    })
    setMode("view");
  };
  
  const columnDefs = [
    {
      field: "name",
      headerName: "Group Name",
      sortable: true,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
        suppressAndOrCondition: true,
      },
      checkboxSelection: function(params) {

        if (mode=="view") {
           return false;
        }
        return true;
     },
      showDisabledCheckboxes: true,
    },
    {
      field: "description",
      headerName: "Description",
      sortable: true,
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
    enablePivot: true,
    sortable: true,
    filter: true,
    resizable: true,
    menuTabs: ["filterMenuTab"],
  };
  const getDatasource = () => {
    return {
      getRows: (params) => {
        api.get(API_URL + "/group-role").then((response) => {
          params.successCallback(response.payload.data, response.payload.data.length);
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


  const onFirstDataRendered = useCallback((params) => {
    const a=[]
    user.groupRoles.forEach(element => {
      a.push(element.id)
    });
    gridRef.current.api.forEachNode((node) =>
        {
          node.setSelected(!!node.data && a.includes(node.data.id))
        });
  }, []);

  return (
    <Card>
      <CardHeader className="align-items-center d-flex">
        <h4 className="card-title mb-0 flex-grow-1">{t("Role Groups")}</h4>
      </CardHeader>
      <CardBody>
        <div className="table-card table-responsive">
          <div className="ag-theme-alpine" style={{width: "auto", height: 480}}>
            <AgGridReact
              headerHeight="0"
              ref={gridRef}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowModelType={"serverSide"}
              serverSideInfiniteScroll={true}
              pagination={true}
              paginationPageSize={10}
              cacheBlockSize={20}
              animateRows={true}
              onGridReady={getData}
              suppressRowClickSelection={true}
              rowSelection="multiple"
              onFirstDataRendered={onFirstDataRendered}
            />
          </div>
        </div>
        <hr />
        <Col lg={12}>
          <div className="hstack gap-2 justify-content-end">
            {mode == "view" && (
              <button type="button" className="btn btn-primary" onClick={editClick}>
                {t("Edit")}
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
                <button type="submit" className="btn btn-soft-success" onClick={submitClick}>
                  {t("Submit")}
                </button>
              </>
            )}
          </div>
        </Col>
      </CardBody>
    </Card>
  );
};
export default RoleList;
