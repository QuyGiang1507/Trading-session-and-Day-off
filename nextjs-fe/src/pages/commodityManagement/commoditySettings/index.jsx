import React, {useCallback, useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import {APIClient} from "helpers/api_helper";
import classnames from "classnames";
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
  Input,
  Label,
  FormFeedback,
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import * as Yup from "yup";
import {Link} from "components";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import {commodityService} from "services";
import {useFormik} from "formik";
import ShareValues from "components/commodity/ShareValues";

const Settings = () => {
  const {t} = useTranslation();

  const [values, setvalues] = useState(undefined);
  const [principles, setPrinciples] = useState(undefined);
  const [columnDefs, setcolumnDefs] = useState(undefined);
  
  const [editChoice, seteditChoice] = useState("modal");
  const [changes, setchanges]= useState([])
  const [newData, setnewdata]= useState(undefined)

  const ref = useRef();

  const [modal_info, setmodal_info] = useState(false);
  function tog_info() {
    setmodal_info(!modal_info);
  }
  const onRowDoubleClicked = (e) => {
    if(editChoice=="modal"){
      setvalues(e.data);
      tog_info();
    }
  };

  const onRadioChange= (e)=>{
    const { value } = e.target;
    seteditChoice(value)
    ref.current.columnApi.autoSizeAllColumns();
  }

  useEffect(async () => {
    const res = await commodityService.getPrinciples().catch((e) => console.log(e));
    setPrinciples(res.payload);
  }, []);

  const generateContract=(instrument)=>{
    commodityService.generateContracts({instrument: instrument})
  }
  useEffect(() => {
    if (principles) {
      setcolumnDefs([
        {
          field: "name",
          hide: true,
        },
        {
          headerName: t("genContracts"),
          cellRenderer: (params) => {
            if(params.data.name=="Futures"|| params.data.name=="Options")
              return <span><Button className="btn-soft-success" key={params.data.id} onClick={()=>generateContract(params.data.id)}><i className="ri-file-line"></i></Button></span>;
            return <></>
          },
          sortable: true,
          editable:false,
          minWidth: 80 
        },
        {
          field: "enable",
          headerName: t("enable"),
          sortable: true,
          cellRenderer: (params) => {
            return <input type="checkbox" checked={params.value} readOnly />;
          },
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [true, false],
          },
          minWidth: 120
        },
        {
          field: "currencyUnit",
          headerName: t("currencyUnit"),
          sortable: true,
          minWidth: 100
          
        },
        {
          field: "contractUnit",
          headerName: t("contractUnit"),
          sortable: true,
          minWidth: 160
        },
        {
          field: "contractVolume",
          headerName: t("contractVolume"),
          sortable: true,
          minWidth: 160
        },
        {
          field: "decimal",
          headerName: t("decimal"),
          sortable: true,
          minWidth: 140
        },
        {
          field: "tickSize",
          headerName: t("tickSize"),
          sortable: true,
          minWidth: 120
        },
        {
          field: "paymentMethod",
          headerName: t("paymentMethod"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["cash", "physical"],
          },
          minWidth: 210
        },
        {
          field: "priceListingUnit",
          headerName: t("priceListingUnit"),
          sortable: true,
          minWidth: 140
        },
        {
          field: "typeOfOption",
          headerName: t("typeOfOption"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["american-option", "european-option", "null"],
          },
          minWidth: 180
          
        },
        {
          field: "dueMonths",
          headerName: t("dueMonths"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: Object.values(principles.dueMonths),
          },
          minWidth: 300
          
        },
        {
          field: "firstNoticeDay",
          headerName: t("firstNoticeDay"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: Object.values(principles.firstNoticeDay),
          },
          minWidth: 360
          
          
        },
        {
          field: "lastNoticeDay",
          headerName: t("lastNoticeDay"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: Object.values(principles.lastNoticeDay),
          },
          minWidth: 360
          
        },
        {
          field: "firstTradingDay",
          headerName: t("firstTradingDay"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: Object.values(principles.firstTradingDay),
          },
          minWidth: 360
          
          
        },
        {
          field: "lastTradingDay",
          headerName: t("lastTradingDay"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: Object.values(principles.lastTradingDay),
          },
          minWidth: 320
          
          
        },
        {
          field: "firstDeliveryDay",
          headerName: t("firstDeliveryDay"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: Object.values(principles.firstDeliveryDay),
          },
          minWidth: 460 
          
        },
        {
          field: "lastDeliveryDay",
          headerName: t("lastDeliveryDay"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: Object.values(principles.lastDeliveryDay),
          },
          minWidth: 460 
          
          
        },
        {
          field: "createNewContract",
          headerName: t("createNewContract"),
          sortable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: Object.values(principles.createNewContract),
          },
          minWidth: 460 
        },
        
      ]);
      
    }
  }, [principles]);


  const defaultColDef = {
    flex: 1,
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
    editable: editChoice=="modal"?false: true
  };

  const autoGroupColumnDef = {
    field: "name",
    headerName: t("name"),
    cellRendererParams: {
      innerRenderer: (params) => {
        return params.data.name;
      },
    },
    minWidth: 240,
    editable:false
  };

  //direct Edit
  const onCellEditRequest = (event) => {
    const oldData = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;
    const newData = {...oldData};
    newData[field] = event.newValue;
    console.log(event.colDef.field);
    setchanges([...changes,{
        field: field,
        oldValue: event.oldValue,
        newValue: event.newValue,
    }])
  };

  const schema= Yup.object().shape({
    enable: Yup.boolean().required("enable field is missing"),
    currencyUnit: Yup.string().required("currencyUnit field is missing"),
    contractUnit: Yup.string().required("contractUnit field is missing"),
    priceListingUnit: Yup.number("priceListingUnit must be a number").required("priceListingUnit field is missing"),
    contractVolume: Yup.number("contractVolume must be a number").required("contractVolume field is missing"),
    tickSize: Yup.number("tickSize must be a number").required("tickSize field is missing"),
    decimal: Yup.number("decimal must be a number").required("decimal field is missing"),
    dueMonths: Yup.string().required("dueMonths field is missing"),
    paymentMethod: Yup.string().required("paymentMethod field is missing"),
    typeOfOption: Yup.string().required("typeOfOption field is missing"),
    firstTradingDay: Yup.string("firstTradingDay must be a number").required("firstTradingDay field is missing"),
    lastTradingDay: Yup.string("lastTradingDay must be a number").required("lastTradingDay field is missing"),
    firstNoticeDay: Yup.string("firstNoticeDay must be a number").required("firstNoticeDay field is missing"),
    lastNoticeDay: Yup.string("lastNoticeDay must be a number").required("lastNoticeDay field is missing"),
    firstDeliveryDay: Yup.string("firstDeliveryDay must be a number").required("firstDeliveryDay field is missing"),
    lastDeliveryDay: Yup.string("lastDeliveryDay must be a number").required("lastDeliveryDay field is missing"),
    createNewContract: Yup.string("createNewContract must be a number").required("createNewContract field is missing"),
  })
  const onSubmit=async ()=>{
    const data={
        enable: newData.enable,
        currencyUnit: newData.currencyUnit,
        contractUnit: newData.contractUnit,
        priceListingUnit: newData.priceListingUnit,
        contractVolume: newData.contractVolume,
        tickSize: newData.tickSize,
        decimal: newData.decimal,
        dueMonths: newData.dueMonths,
        paymentMethod: newData.paymentMethod,
        typeOfOption: newData.typeOfOption,
        firstTradingDay: newData.firstTradingDay,
        lastTradingDay: newData.lastTradingDay,
        firstNoticeDay: newData.firstNoticeDay,
        lastNoticeDay: newData.lastNoticeDay,
        firstDeliveryDay: newData.firstDeliveryDay,
        lastDeliveryDay: newData.lastDeliveryDay,
        note: newData.note,
        createNewContract: newData.createNewContract,
    }
    schema.validate(data,{abortEarly: false})
    .then(async (responseData) => {
      if (!newData.instrument && newData.name!="Futures" && newData.name!="Options"){
        commodityService.createInstrument({
            ...data,
            group: newData.id,
            groupName: "item",
            name: "Default"
        })  
      }
      else if(newData.name!="Futures" || newData.name!="Options"){
        commodityService.updateInstrument(newData.id,data)
      }
      else{
        commodityService.updateInstrument(newData.instrument,data)
      }
      ref.current.api.refreshServerSide() 
      setnewdata(undefined)
    })
    .catch((err) => {
      setnewdata(undefined)
      alert(err.errors);
    });
  }

  const onRowEditingStopped= (params)=>{
    if(changes.length>0){
      let i = {...params.data}
      changes.forEach((e)=>{
        i[e.field]= e.newValue
      })
      setchanges([])
      setnewdata(i)
    }
  }
  
  

  const isServerSideGroupOpenByDefault = (params) => {
    // open first two levels by default
    // return params.rowNode.level < 1;
    return false;
  };
  const isServerSideGroup = (dataItem) => {
    // indicate if node is a group
    return dataItem.group;
  };

  const getServerSideGroupKey = (dataItem) => {
    // specify which group key to use
    return dataItem.id;
  };

  const getDatasource = () => {
    return {
      getRows: (params) => {
        commodityService
          .getSettings({
            groupKeys: params.request.groupKeys,
            startRow: params.request.startRow,
            endRow: params.request.endRow,
            sortModel: params.request.sortModel,
            filterModel: params.request.filterModel,
          })
          .then((response) => {
            console.log(response);
            params.successCallback(response.payload.rowData, response.payload.rowCount);
            ref.current.columnApi.autoSizeAllColumns();
          })
          .catch((error) => {
            console.log(error);
          });
      },
    };
  };

  const onGridReady = useCallback(
    (params) => {
      var datasource = getDatasource();
      params.api.setServerSideDatasource(datasource);
    },
    [getDatasource()]
  );
  
  
  document.title = "Commodity Settings";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <div className="flex-grow-1 d-flex">
                  <Label >{t("editChoice")}:</Label>
                  <div className="form-check mb-2 mx-4">
                    <Input name="editChoice" type="radio" id="modalEdit" className="form-check-input" value="modal" onChange={onRadioChange} checked={editChoice=="modal"}/>
                    <Label className="form-check-label" htmlFor="modalEdit">{t("Modal")}</Label>
                  </div>
                  <div className="form-check mb-2">
                    <Input name="editChoice" type="radio" id="directEdit" className="form-check-input" value="direct" onChange={onRadioChange} checked={editChoice=="direct"}/>
                    <Label className="form-check-label" htmlFor="directEdit">{t("Direct")}</Label>
                  </div>
                  </div>
                  {newData&&editChoice=="direct"&&(
                        <div className="flex-shrink-1">
                            <Button
                            color="primary"
                            className="btn-success"
                            style={{border: "none"}}
                            onClick= {onSubmit}
                            >
                                Commit changes to: {newData.code} - {newData.name}
                            </Button>
                        </div>
                    )}
                </CardHeader>

                <CardBody>
                  {columnDefs && (
                    <div className="table-card table-responsive">
                      <div
                        className="ag-theme-alpine"
                        style={{width: "auto", height: 540}}
                      >
                        <AgGridReact
                          ref={ref}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                          autoGroupColumnDef={autoGroupColumnDef}
                          rowModelType={"serverSide"}
                          treeData={true}
                          animateRows={true}
                          isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
                          isServerSideGroup={isServerSideGroup}
                          getServerSideGroupKey={getServerSideGroupKey}
                          editType="fullRow"
                          onGridReady={onGridReady}
                          enableGroupEdit={editChoice=="direct"}
                          onCellEditRequest={onCellEditRequest}
                          onRowEditingStopped={onRowEditingStopped}
                          readOnlyEdit={editChoice=="direct"}
                          onRowDoubleClicked={onRowDoubleClicked}
                          rowSelection={"single"}
                          alwaysShowHorizontalScroll
                        />
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {values&&
      <Modal
        id="signupModals"
        tabIndex="-1"
        isOpen={modal_info}
        toggle={() => {
          tog_info();
        }}
        centered
        className="modal-xl"
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            tog_info();
          }}
        >
          {t("Settings")+" - "+values.name}
        </ModalHeader>
        <ModalBody className="container-fluid">
          <ShareValues values={values} type={(values.instrument ||values.name=="Futures"||values.name=="Options")?"update":"create"} parentId={values.id} instrumentType= {values.name}></ShareValues>
        </ModalBody>
      </Modal>}
    </React.Fragment>
  );
};
export default Settings;
