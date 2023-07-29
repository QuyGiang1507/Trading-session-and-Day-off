import { Link } from "components";
import { AuthLayout } from "components/AuthLayout";
import React from "react";
import { Container } from "reactstrap";
export default Home;

function Home() {
  const loginTime=new Date(localStorage.getItem('loginTime'))
  const logoutTime=loginTime
  logoutTime.setDate(logoutTime.getDate() + 1);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h1>Hi !</h1>
          <p>Empty Dashboard</p>
          <p>Login Time: {logoutTime.toLocaleString()}</p>
        </Container>
      </div>
    </React.Fragment>
  );
}
