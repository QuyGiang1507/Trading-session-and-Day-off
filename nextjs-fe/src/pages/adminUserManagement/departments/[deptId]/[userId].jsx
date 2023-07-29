import React, {useEffect, useMemo, useState} from "react";
import {Link} from "components";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import {useFormik} from "formik";
import BreadCrumb from "components/Common/BreadCrumb";
import {useTranslation} from "react-i18next";
import {departmentService} from "services";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";

import UserDetails from "components/users/detail/PersonalDetails";
import ChangeDepartment from "components/users/detail/ChangeDept";
import TableRoleGroup from "components/users/detail/TableRoleGroup";
import TableRole from "components/users/detail/TableRole";

const UserPage = ({deptId, userId}) => {
  const {t} = useTranslation();
  const [user, setUser] = useState(undefined);
  const [selectedItemRole, setSelectedItemRole] = useState();
  const handleSlectedItemRole = (item) => {
    setSelectedItemRole(item);
  };

  useEffect(() => {
    departmentService.getUser(userId).then((res) => {
      setUser(res.payload);
    });
  }, []);
  document.title = t("User");
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          {!user && (
            <div className="text-center">
              <Image src={loadingGif} alt="" />
            </div>
          )}
          {user && (
            <Row>
              <Col lg={12}>
                <UserDetails id={deptId} userId={userId} user={user}></UserDetails>
                <ChangeDepartment id={deptId} userId={userId} user={user} />
              </Col>
              <Col lg={6}>
                <TableRoleGroup id={deptId} userId={userId} user={user} />
              </Col>
              <Col lg={6}>
                <TableRole  id={deptId} userId={userId} user={user}/>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};
export async function getServerSideProps({params}) {
  return {
    props: {
      userId: params.userId,
      deptId: params.deptId,
    },
  };
}

export default UserPage;
