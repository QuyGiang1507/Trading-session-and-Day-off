import React, {useEffect, useState} from "react";
import {Link} from "components";
import {Col, Row} from "reactstrap";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";


const BreadCrumb = ({title, pageTitle}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();
      const pathname = router.pathname.split("/");
      pathname.shift();

      const pathArray = linkPath.map((path, i) => {
        return {breadcrumb: pathname[i], href: "/" + linkPath.slice(0, i + 1).join("/")};
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">{t(router.pathname.split("/").slice(-1))}</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item" key={"home"}>
                    <Link href={"/"}>
                        <a><i className="ri-home-2-line"></i></a>
                    </Link>
                </li>
                {breadcrumbs.map((breadcrumb, i) => {
                    if(i>0)
                    return (
                        <li className="breadcrumb-item" key={breadcrumb.href}>
                        <Link href={breadcrumb.href}>
                            <a>{t(breadcrumb.breadcrumb)}</a>
                        </Link>
                        </li>
                    );
                })}
              </ol>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
