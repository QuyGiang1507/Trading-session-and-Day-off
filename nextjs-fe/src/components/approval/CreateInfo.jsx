import React, {useEffect, useState} from "react";
import {Table} from "reactstrap";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {departmentService} from "services";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";
import * as Yup from "yup";

const CreateInfo = (props) => {
  const {t} = useTranslation();
  const {pendingData} = props;
  const splitPending = JSON.parse(pendingData.pendingValue);
  return (
    <>
      <h5>{t("CreateInfo")}</h5>
      <hr />
      <div className="overflow-auto">
        <Table className="align-middle table-wrap mb-0 w-100 table-responsive">
          <thead>
            <tr>
              {Object.keys(splitPending).map((key) => (
                <th key={key}>{t(key)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.keys(splitPending).map((key) => {
                if(typeof splitPending[key]!= "object")
                return(
                  <td key={key}>{t(splitPending[key])}</td>
                )
                else{
                  return(
                    <td key={key}>{t(JSON.stringify(splitPending[key]))}</td>
                  )
                }
              })}
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default CreateInfo;
