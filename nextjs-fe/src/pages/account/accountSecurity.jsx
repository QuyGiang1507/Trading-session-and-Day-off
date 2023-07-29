import React from "react";
import {
  Col,
  Container,
  Row,
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import {useTranslation} from "react-i18next";
import ChangePassword from "components/account/ChangePassword";
import ChangePin from "components/account/ChangePin";
const accountSecurity = (props) => {
  const user =""
  if(process.browser){
    user= JSON.parse(localStorage.getItem("user"))
  }

  document.title = "accountSecurity"

  return (
      <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
            <Row>
              <Col lg={12}>
                <ChangePassword userId={user.id}/>
                <ChangePin userId={user.id}/>
              </Col>
            </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default accountSecurity;
