import React, {useEffect, useState} from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import {Link} from "components";
import {useTranslation} from "react-i18next";
import Image from "next/future/image";
import * as Yup from "yup";
import {StatefulPinInput} from 'react-input-pin-code';
import { authService } from "services";
import { useRouter } from "next/router";
const PinModal = (props) => {
  const {t} = useTranslation();
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem("user"));

  const  onComplete= (pin)=>{
   authService.verifyPIN(user.id,{"PIN": pin}).then((res)=>router.push("/")).catch()
  }
  return (
    <>
      <ModalBody>
        <Row className="justify-content-center">
          <Col>
            <Card className="mt-4">
              <CardBody className="p-4">
                <div className="mb-4">
                  <div className="avatar-lg mx-auto">
                    <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                      <i className="ri-key-line"></i>
                    </div>
                  </div>
                </div>

                <div className="p-2 mt-4">
                  <div className="text-muted text-center mb-4 mx-lg-3">
                    <h4 className="">{t("Enter Your Pin Code")}</h4>
                    
                  </div>

                <Row className="text-center">
                  <StatefulPinInput
                    length={6}
                    size="lg"
                    type="number"
                    autoFocus={true}
                    mask={true}
                    placeholder=""
                    containerClassName={"justify-content-center"}
                    onComplete={(values) => {const a = values.join('');onComplete(a)}}
                    // showState={true}
                    />
                </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
    </>
  );
};

export default PinModal;
