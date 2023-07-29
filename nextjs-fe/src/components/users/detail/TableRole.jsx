import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import CheckboxTree from "react-checkbox-tree";
import {Card, CardHeader, CardBody, Col, Row} from "reactstrap";
import {useTranslation} from "react-i18next";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {departmentService, roleService} from "services";
import { use } from "i18next";
const TableRole = (props) => {
  const {id, userId, user} = props;
  const {t} = useTranslation();
  
  const [roles, setRoles] = useState(undefined);
  console.log(user.userRoles)
  const [checked, setChecked] = useState(user.userRoles);
  const [expanded, setExpanded] = useState([]);

  const [mode, setMode] = useState("view");
  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    setChecked(user.userRoles)
    setMode("view");
  };
  const submitClick = () => {
    departmentService.assignRoles(userId,{
      userRoles: checked
    })
  };

  useEffect(() => {
    roleService.getRoles().then((res) => {
      console.log(res.payload)
      setRoles(res.payload);
    });
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <h4 className="card-title mb-0 flex-grow-1">{t("Roles")}</h4>
      </CardHeader>
      <CardBody>
        {(roles)&&
        <div style={{ display:"flex", wordBreak:"break-all"}} >
          <CheckboxTree
            nodes={roles}
            showExpandAll={true}
            checked={checked}
            expanded={expanded}
            onCheck={(checked) => {
              setChecked(checked);
            }}
            onExpand={(expanded) => setExpanded(expanded)}
            showNodeIcon={false}
            disabled={mode=="view"}
          />
        </div>}
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

export default TableRole;
