import React from "react";
import { useTranslation } from "react-i18next";
import ApprovalList from "components/approval/ApprovalList"
const AuthApproval = () => {
  const { t } = useTranslation();
  

  document.title = t("authApproval")

  return (
    <>
      <ApprovalList service="mxs-auth" title="authApproval"/>
    </>
  );
};
export default AuthApproval;
