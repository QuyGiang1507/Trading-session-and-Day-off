import React, {useEffect, useState} from "react";
import {Table} from "reactstrap";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {departmentService} from "services";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";
import * as Yup from "yup";

const UpdateInfo = (props) => {
  const {t} = useTranslation();
  const {pendingData} = props;
  
  const splitPending = JSON.parse(pendingData.pendingValue);
  const splitOld = JSON.parse(pendingData.oldValue);
  return (
    <>
      <h5>{t("UpdateInfo")}</h5>
      <hr />
      <div className="overflow-auto">
        
        <Table className="align-middle table-wrap mb-0 w-100 table-responsive">
          <thead>
            <tr>
              <th scope="col">{t("property")}</th>
              <th scope="col" >{t("oldValue")}</th>
              <th scope="col">{t("pendingValue")}</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(splitPending).map((key) => (
              <>
              {(typeof splitPending[key]!="object"&& splitPending[key]!=null)&&
              <>
                {pendingData.valueChange.includes(key) && (
                  <tr key={key} className="bg-soft-success">
                    <th>{t(key)}</th>
                    <td>{t(splitOld[key])}</td>
                    <td>{t(splitPending[key])}</td>
                  </tr> 
                )}
                {!pendingData.valueChange.includes(key) && (
                  <tr key={key}>
                    <th>{t(key)}</th>
                    <td>{t(splitOld[key])}</td>
                    <td>{t(splitPending[key])}</td>
                  </tr>
                )}
              </>}
              
              </>
            ))}
            {(pendingData.sub&&pendingData.add)&&
            <>
                {Object.keys(pendingData.sub).map((key) =>(
                  <tr key={key}>
                    <th>{t(key)}</th>
                    <td className="bg-soft-danger"> {t("subtract")}: 
                    {
                      pendingData.sub[key].map((element) => {
                        return(<div key={key}> - {element}</div>)
                      })
                    }
                    </td>
                    <td className="bg-soft-success"> {t("add")}: 
                    {
                      pendingData.add[key].map((element) => {
                        console.log(element)
                        return(<div key={key}> + {element}</div>)  
                      })
                    }
                    </td>
                  </tr>
                ))}
                </>
              }
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default UpdateInfo;
