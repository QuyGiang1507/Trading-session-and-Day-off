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
import {roleService} from "services";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import {APIClient} from "helpers/api_helper";
import {useRouter} from "next/router";
import {groupRoleService} from "services/groupRole.service";
import RoleModal from "components/groupRoles/roleModal";
import { useTranslation } from "react-i18next";

const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;

const RoleList = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const api = new APIClient();
  const gridRef = useRef();

  const [roles, setRoles] = useState();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [group, setGroup] = useState({});
  const [newgroup, setNewGroup] = useState({});

  useEffect(() => {
    roleService.getRoles().then((res) => {
      console.log(res);
      setRoles(res.payload);
    });
  }, []);

  const [modal_permissionModals, setmodal_permissionModals] = useState(false);
  function tog_permissionModals() {
    setmodal_permissionModals(!modal_permissionModals);
  }

  const [modal_newgroupModals, setmodal_newgroupModals] = useState(false);
  function tog_newgroupModals() {
    setmodal_newgroupModals(!modal_newgroupModals);
  }

  const [isRoleModal, setIsRoleModal] = useState(false);
  function tog_roleModal() {
    setIsRoleModal(!isRoleModal);
  }

  const columnDefs = [
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
      field: "description",
      headerName: t("Description"),
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
        console.log(params);
        api
          .get(API_URL + "/group-role", {
            ...params.request,
          })
          .then((response) => {
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

  const onRowDoubleClicked = (e) => {
    setGroup(e.data);
    setChecked(e.data.functions);
    tog_permissionModals();
  };

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
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t('List')}</h4>
                  <div className="flex-shrink-0">
                    <Button
                      color="success"
                      className="btn btn-success"
                      style={{marginRight: 10}}
                      onClick={() => {
                        setIsRoleModal(true);
                      }}
                    >
                      DS Quyền lẻ
                    </Button>
                    <Button
                      className="btn-soft-success"
                      style={{border: "none"}}
                      onClick={() => tog_newgroupModals()}
                    >
                      Add group
                    </Button>
                  </div>
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
                        animateRows={true}
                        onRowDoubleClicked={onRowDoubleClicked}
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
      <Modal
        id="roleModals"
        tabIndex="-1"
        isOpen={modal_permissionModals}
        toggle={() => {
          tog_permissionModals();
        }}
        onClosed={() => {
          setChecked([]);
          setExpanded([]);
          setGroup([]);
        }}
        centered
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            tog_permissionModals();
          }}
        >
          {t("Group info")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              var data = (({_id, ...o}) => o)(group);
              data.functions = checked;
              console.log(data);
              groupRoleService
                .updateOneRoleGroup(group.id, data)
                .then(() => refreshCache(undefined));
              tog_permissionModals();
              return false;
            }}
          >
            <Row className="align-items-center">
              <Col xl={2}>{t("Name")}</Col>
              <Col>
                <Input
                  name="groupName"
                  className="form-control"
                  placeholder="Enter Group"
                  type="text"
                  value={group.name}
                  onChange={(e) => setGroup({...group, name: e.target.value})}
                />
              </Col>
            </Row>
            <Row className="align-items-center mt-2">
              <Col xl={2}>{t("Description")}</Col>
              <Col>
                <Input
                  name="description"
                  type="text"
                  className="form-control"
                  value={group.description}
                  placeholder="Enter Description"
                  onChange={(e) => setGroup({...group, description: e.target.value})}
                />
              </Col>
            </Row>
            <Row className="align-items-center mt-2">
              <Col xl={2}>{t("Status")}</Col>
              <Col>
                <Input
                  name="status"
                  type="select"
                  className="form-control"
                  value={group.status}
                  onChange={(e) => setGroup({...group, status: e.target.value})}
                >
                  <option value={"active"}>{t("active")}</option>
                  <option value={"inactive"}>{t("inactive")}</option>
                </Input>
              </Col>
            </Row>

            <Card className="mt-2">
              <CardHeader>{t("Roles")}</CardHeader>
              <CardBody>
                {roles && (
                  <div style={{display: "flex", wordBreak: "break-all"}}>
                    <CheckboxTree
                      nodes={roles}
                      showExpandAll={true}
                      // checkModel='all'
                      checked={checked}
                      expanded={expanded}
                      onCheck={(checked) => {
                        setChecked(checked);
                      }}
                      onExpand={(expanded) => setExpanded(expanded)}
                      showNodeIcon={false}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
            <div className="mt-4">
              <Button color="success" className="btn btn-success mr-auto">
                {t("Submit")}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <Modal
        id="newgroupModals"
        tabIndex="-1"
        isOpen={modal_newgroupModals}
        toggle={() => {
          tog_newgroupModals();
        }}
        onClosed={() => {
          setChecked([]);
          setExpanded([]);
          setGroup([]);
        }}
        centered
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            tog_newgroupModals();
          }}
        >
          {t("Add group")}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              var data = (({_id, ...o}) => o)(group);
              data.functions = checked;
              console.log(data);
              //api add new group
              const res = await groupRoleService.createGroupRole(data);

              refreshCache(undefined);
              tog_newgroupModals();
              return false;
            }}
          >
            <Row className="align-items-center">
              <Col xl={2}>{t("Name")}</Col>
              <Col>
                <Input
                  name="newgroupName"
                  className="form-control"
                  placeholder="Enter Group"
                  type="text"
                  value={group.name}
                  onChange={(e) => setGroup({...group, name: e.target.value})}
                />
              </Col>
            </Row>
            <Row className="align-items-center mt-2">
              <Col xl={2}>{t("Description")}</Col>
              <Col>
                <Input
                  name="newdescription"
                  type="text"
                  className="form-control"
                  value={group.description}
                  placeholder="Enter Description"
                  onChange={(e) => setGroup({...group, description: e.target.value})}
                />
              </Col>
            </Row>
            <Row className="align-items-center mt-2">
              <Col xl={2}>{t("Status")}</Col>
              <Col>
                <Input
                  name="newstatus"
                  type="select"
                  className="form-control"
                  value={group.status}
                  onChange={(e) => setGroup({...group, status: e.target.value})}
                >
                  <option value={"active"}>{t("active")}</option>
                  <option value={"inactive"}>{t("inactive")}</option>
                </Input>
              </Col>
            </Row>

            <Card className="mt-2">
              <CardHeader>{t("Roles")}</CardHeader>
              <CardBody>
                {roles && (
                  <div style={{ display:"flex", wordBreak:"break-all"}} >
                  <CheckboxTree
                    nodes={roles}
                    showExpandAll={true}
                    // checkModel="all"
                    checked={checked}
                    expanded={expanded}
                    onCheck={(checked) => {
                      setChecked(checked);
                    }}
                    onExpand={(expanded) => setExpanded(expanded)}
                    showNodeIcon={false}
                  />
                  </div>
                )}
              </CardBody>
            </Card>
            <div className="mt-4">
              <Button color="success" className="btn btn-success mr-auto">
              {t("Submit")}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <RoleModal
        isRoleModal={isRoleModal}
        tog_roleModal={tog_roleModal}
        roles={roles}
        setRoles={setRoles}
      />
    </React.Fragment>
  );
};
export default RoleList;
