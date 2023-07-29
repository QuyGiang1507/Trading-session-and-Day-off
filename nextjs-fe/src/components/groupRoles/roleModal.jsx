import React, {useState, useCallback} from "react";
import {Button, Modal, ModalHeader, ModalBody, Input, Row, Col} from "reactstrap";
import CheckboxTree from "react-checkbox-tree";
import {toast} from "react-toastify";

import {roleService} from "../../services/role.service";

const RoleModal = (props) => {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [dataRoleAdd, setDataRoleAdd] = useState({code: "", name: "", orderNumber: ""});
  const [parentNode, setParentNode] = useState("");

  const [isModalAddRole, setIsModalAddRole] = useState(false);

  const handleRemoveRole = async () => {
    const preValue = await roleService.getRoles({mode: "raw"});
    const value = preValue.payload.filter((r) => checked.indexOf(r.code) == -1);
    const res = await roleService.updateRoles(value);
    console.log(res);
    if (res.status === 1) {
      toast("Removed roles !", {className: "bg-success text-white"});
      props.setRoles(res.payload);
    } else toast("Something wrong !", {className: "bg-error text-red"});
    setChecked([]);
  };

  const handleAddRole = async () => {
    const preValue = await roleService.getRoles({mode: "raw"});
    const res = await roleService.updateRoles([...preValue.payload, dataRoleAdd]);
    if (res.status === 1) {
      toast("Added roles !", {className: "bg-success text-white"});
      props.setRoles(res.payload);
    } else toast("Something wrong !", {className: "bg-error text-red"});
    setIsModalAddRole(!isModalAddRole);
  };

  return (
    <>
      <Modal
        id="roleModal"
        tabIndex="1"
        isOpen={props.isRoleModal}
        toggle={() => {
          props.tog_roleModal(props.isRoleModal);
        }}
        onClosed={() => {
          setChecked([]);
          setExpanded([]);
        }}
        centered
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            props.tog_roleModal(props.isRoleModal);
          }}
        >
          Roles
        </ModalHeader>
        <ModalBody>
          {props.roles && (
            <div style={{display: "flex", wordBreak: "break-all"}}>
              <CheckboxTree
                nodes={props.roles}
                checkModel="all"
                showExpandAll={true}
                checked={checked}
                expanded={expanded}
                onCheck={(checked) => {
                  setChecked(checked);
                }}
                onExpand={(expanded) => setExpanded(expanded)}
                showNodeIcon={false}
                onClick={(node) => {
                  let od = node.index + 1;
                  if (node.isChild) {
                    od = node.parent.orderNumber + `.${node.index + 1}`;
                  }

                  setParentNode(node.label);
                  setIsModalAddRole(!isModalAddRole);
                  setDataRoleAdd({
                    ...dataRoleAdd,
                    orderNumber: `${od}.${node.children.length + 1}`,
                  });
                }}
              />
            </div>
          )}

          <div className="flex-shrink-0" style={{float: "right", marginTop: 20}}>
            <Button
              onClick={handleRemoveRole}
              color="danger"
              className="btn btn-danger"
              style={{marginRight: 10}}
              disabled={checked.length > 0 ? false : true}
            >
              Remove
            </Button>
            <Button
              onClick={() => {
                setDataRoleAdd({
                  ...dataRoleAdd,
                  orderNumber: `${props.roles.length + 1}`,
                });
                setIsModalAddRole(!isModalAddRole);
              }}
              color="success"
              className="btn btn-success"
              style={{marginRight: 10}}
            >
              New
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        id="addRoleModal"
        tabIndex="-1"
        isOpen={isModalAddRole}
        toggle={() => {
          setIsModalAddRole(!isModalAddRole);
        }}
        onClosed={() => {
          setParentNode("");
        }}
        centered
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setIsModalAddRole(!isModalAddRole);
          }}
        >
          Add Roles
        </ModalHeader>
        <ModalBody>
          <Row className="align-items-center">
            <Col xl={2}>Parent</Col>
            <Col>
              <Input type="text" rows={10} value={parentNode} disabled={true} />
            </Col>
          </Row>
          <Row className="align-items-center mt-2">
            <Col xl={2}>Order Number</Col>
            <Col>
              <Input
                type="text"
                rows={10}
                value={dataRoleAdd.orderNumber}
                disabled={true}
              />
            </Col>
          </Row>

          <Row className="align-items-center mt-2">
            <Col xl={2}>Code</Col>
            <Col>
              <Input
                type="text"
                rows={10}
                onChange={(e) => setDataRoleAdd({...dataRoleAdd, code: e.target.value})}
              />
            </Col>
          </Row>
          <Row className="align-items-center mt-2">
            <Col xl={2}>Name</Col>
            <Col>
              <Input
                type="text"
                rows={10}
                onChange={(e) => setDataRoleAdd({...dataRoleAdd, name: e.target.value})}
              />
            </Col>
          </Row>
          <Button
            onClick={() => {
              handleAddRole();
            }}
            color="success"
            className="btn btn-success"
            style={{float: "right", marginTop: 10}}
          >
            Submit
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default RoleModal;
