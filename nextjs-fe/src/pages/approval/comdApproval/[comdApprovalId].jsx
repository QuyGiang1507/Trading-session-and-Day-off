import React from "react";
import {useTranslation} from "react-i18next";
import ApprovalDetail from "components/approval/ApprovalDetail";
const AuthApprovalDetail = ({comdApprovalId}) => {
  const {t} = useTranslation();
  
  document.title = t("Appoval Form");

  return (
    <>
      <ApprovalDetail id={comdApprovalId} service="mxs-comd" title="comdApproval"/>
    </>
  );
};
export async function getServerSideProps({params}) {
  return {
    props: {
      comdApprovalId: params.comdApprovalId,
    },
  };
}
export default AuthApprovalDetail;
