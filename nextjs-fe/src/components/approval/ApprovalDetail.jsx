import React, {useCallback, useState, useEffect} from "react";
import {AgGridReact} from "ag-grid-react";
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
  Form,
  Label,
  Input,
  FormFeedback,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import {useTranslation} from "react-i18next";
import {approvalService} from "services";
import ShareValues from "components/commodity/ShareValues";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";
import UpdateInfo from "components/approval/UpdateInfo";
import CreateInfo from "components/approval/CreateInfo";
import { useRouter } from "next/router";


const ApprovalDetail = (props) => {
  const {t} = useTranslation();
  const router = useRouter()
  const {id, service, title}= props
  const [form, setForm] = useState(undefined);
  const [rejectedReason,setrejectedReason] = useState("")
  useEffect(() => {
    approvalService.getOneForm(id, service).then((res) => {
      setForm(res.payload);
    });
  }, []);

  const approveSubmit = async () =>{
    await approvalService.approveOrReject(form._id, service,{
      status: "approved",
    })
    .then((res)=>{if(!res.errors) router.push("/approval/"+title)})
    .catch((e)=>console.log(e))
  }
  
  const rejectSubmit = async () =>{
    await approvalService.approveOrReject(form._id, service,{
      status: "rejected",
      rejectedReason: rejectedReason
    })
    .then((res)=>{if(!res.errors) router.push("/approval/"+title)})
    .catch((e)=>console.log(e))
  }

  document.title = "Appoval Form";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
            <Col lg={12}>
              <Card>
                
                {form && (
                  <CardBody>
                    <h5>{t("ApprovalInfo")}</h5>
                    <hr />
                    <Row className="align-center">
                      <Col lg={6} className={"d-flex justify-content-center"}>
                        <Label className="font-weight-bold">{t("id")}: </Label>
                        <div>&nbsp;{form._id}</div>
                      </Col>
                      <Col lg={6} className={"d-flex justify-content-center"}>
                        <Label>{t("action")}: </Label>
                        <div>&nbsp;{form.action}</div>
                      </Col>

                      <Col lg={6} className={"d-flex justify-content-center"}>
                        <Label className="font-weight-bold">{t("description")}: </Label>
                        <div>&nbsp;{form.description}</div>
                      </Col>
                      <Col lg={6} className={"d-flex justify-content-center"}>
                        <Label>{t("createdBy")}:</Label>
                        <div>&nbsp;{form.createdBy}</div>
                      </Col>

                      <Col lg={6} className={"d-flex justify-content-center"}>
                        <Label className="font-weight-bold">{t("createdAt")}: </Label>
                        <div>&nbsp;{(new Date(form.createdAt)).toLocaleString("vi-VN")}</div>
                      </Col>
                      <Col lg={6} className={"d-flex justify-content-center"}>
                        <Label>{t("status")}:</Label>
                        <div>&nbsp;{form.status}</div>
                      </Col>

                      {form.status != "pending" && (
                        <>
                          <Col lg={6} className={"d-flex justify-content-center"}>
                            <Label className="font-weight-bold">{t("approvedBy")}: </Label>
                            <div>&nbsp;{form.approvedBy}</div>
                          </Col>
                          <Col lg={6} className={"d-flex justify-content-center"}>
                            <Label>{t("lastModifiedBy")}:</Label>
                            <div>&nbsp;{form.lastModifiedBy}</div>
                          </Col>
                          <Col lg={12} className="d-flex justify-content-center">
                            <Label className="font-weight-bold">
                              {t("rejectedReason")}: &nbsp;
                            </Label>
                            <textarea className="w-50" value={form.rejectedReason} readOnly></textarea>
                          </Col>
                        </>
                      )}
                      {form.status == "pending" &&(
                        <Col lg={12} className="d-flex justify-content-center">
                          <Label className="font-weight-bold">
                            {t("rejectedReason")}: &nbsp;
                          </Label>
                          <textarea className="w-50" value={rejectedReason} onChange={(e)=>(setrejectedReason(e.target.value))}></textarea>
                        </Col>
                      )}
                    </Row>
                    {form.action=="update"&&
                      <UpdateInfo pendingData={form.pendingData}></UpdateInfo>
                    }
                    {form.action=="create"&&
                      <CreateInfo pendingData={form.pendingData}></CreateInfo>
                    }
                    {form.status == "pending" && (
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
                        disabled={!rejectedReason.length>0}
                      >
                        Reject
                      </button>
                    </div>
                    </Col>)}
                  </CardBody>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export async function getServerSideProps({params}) {
  return {
    props: {
      id: params.id,
    },
  };
}
export default ApprovalDetail;
