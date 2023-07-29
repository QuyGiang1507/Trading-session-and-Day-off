import {Link} from "components";
import {AuthLayout} from "components/AuthLayout";
import React, {useState, useEffect, useRef} from "react";
import {Card, CardBody, CardHeader, Col, Container, Input, Label} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import {useTranslation} from "react-i18next";
import { configService } from "services";

const LogsStorage = () => {
  const {t} = useTranslation();
  const [mode, setMode] = useState("view");
  const [checked, setChecked] =useState(undefined)
  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    configService.getConfig("SaveToDB").then((res)=>{setChecked(res);console.log(res)})
    console.log(checked)
    setMode("view");
  };

  const submitClick = () => {
    configService.updateConfig("SaveToDB",checked)
    setMode("view");
  };
  useEffect(()=>{
    configService.getConfig("SaveToDB").then((res)=>setChecked(res))
  },[])
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Card>
            
            <CardBody>
              {checked!=undefined&&
              <Col className="form-check form-switch form-switch-lg d-flex justify-content-center">
                <Input
                  type="checkbox"
                  className="form-check-input"
                  id="saveToDb"
                  disabled={mode == "view"}
                  defaultChecked={checked}
                  onChange={()=>setChecked(!checked)}
                />
                <Label className="form-check-label" htmlFor="saveToDb">
                  {t("saveLogToDB")}
                </Label>
              </Col>}
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
                      <button
                        type="submit"
                        className="btn btn-soft-success"
                        onClick={submitClick}
                      >
                        {t("Submit")}
                      </button>
                    </>
                  )}
                </div>
              </Col>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default LogsStorage;
