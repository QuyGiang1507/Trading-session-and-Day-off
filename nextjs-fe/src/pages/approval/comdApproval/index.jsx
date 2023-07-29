import React from "react";
import { useTranslation } from "react-i18next";
import ApprovalList from "components/approval/ApprovalList"
const AuthApproval = () => {
  const { t } = useTranslation();
  

  document.title = t("comdApproval")

  return (
    <>
      <ApprovalList service="mxs-comd" title="comdApproval"/>
    </>
  );
};
export default AuthApproval;
