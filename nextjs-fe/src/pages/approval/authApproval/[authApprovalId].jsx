import React from "react";
import {useTranslation} from "react-i18next";
import ApprovalDetail from "components/approval/ApprovalDetail";
const AuthApprovalDetail = ({authApprovalId}) => {
  const {t} = useTranslation();
  
  document.title = t("Appoval Form");

  return (
    <>
      <ApprovalDetail id={authApprovalId} service="mxs-auth" title="authApproval"/>
    </>
  );
};
export async function getServerSideProps({params}) {
  return {
    props: {
      authApprovalId: params.authApprovalId,
    },
  };
}
export default AuthApprovalDetail;
