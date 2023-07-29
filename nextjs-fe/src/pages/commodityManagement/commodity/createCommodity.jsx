import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Form,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import BreadCrumb from "components/Common/BreadCrumb";
import { commodityService } from "services";
import { useTranslation } from "react-i18next";

const CreateCommo = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [itemList, setitemList]= useState(null)
  useEffect(()=>{
    commodityService.getItemList()
    .then((res)=>{
      let tmp= []
      res.payload.data.forEach(element => {
        tmp.push({
          value: element.id,
          label: element.code +" - " +element.name
        })
      });
      console.log(tmp)
      setitemList(tmp)
    })
  },[])
  const [selectedSingle, setSelectedSingle] = useState(null);
  function handleSelectSingle(e) {
    console.log(selectedSingle)
    setSelectedSingle(e);
  }
  const formik = useFormik({  
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
        code: "",
        name: "",   
        status: "inactive",
        note: "",
    },

    validationSchema: Yup.object({
        code: Yup.string().required("Please Enter Commodity Code").min(3, 'Too short'),
        name: Yup.string().required("Please Enter Commodity Name"),
    }),
    async onSubmit(values) {
      console.log(selectedSingle)
        await commodityService.createCommo({
            item: selectedSingle.value,
            code: values.code,
            name: values.name,
            status:values.status,
            note: values.note
        }).then((res)=>{if(!res.errors) router.push("/commodityManagement/commodity")})
    },
  });

  document.title = "Create Commodity";

  return (
    <React.Fragment>  
      <div className="page-content">
        <Container fluid>
          <BreadCrumb/>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody className="p-4">
                  <Form
                    className="needs-validation"
                    onSubmit={formik.handleSubmit}
                    action="#"
                    autoComplete="off"
                  >
                    <Row>
                    {itemList &&
                    <Col lg={12}>
                        <div className="mb-3">
                        <Label htmlFor="items" className="form-label">{t("item")}</Label>                                                        
                        <Select
                              value={selectedSingle}
                              onChange={(e) => {
                                  handleSelectSingle(e);
                              }}
                              options={itemList}
                          />
                        </div>
                      </Col>}
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="code-create-commodity" className="form-label">
                            {t("Code")}
                          </Label>
                          <Input
                            name="code"
                            type="text"
                            className="form-control"
                            id="code-create-commodity"
                            placeholder="Enter commodity code"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.code}
                            invalid={
                              formik.touched.code && formik.errors.code
                                ? true
                                : false
                            }
                          />
                          {formik.touched.code && formik.errors.code ? (
                            <FormFeedback type="invalid">
                              {formik.errors.code}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="name-create-commodity" className="form-label">
                            {t("Name")}
                          </Label>
                          <Input
                            name="name"
                            type="text"
                            className="form-control"
                            id="name-create-commodity"
                            placeholder="Enter commodity name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            invalid={
                              formik.touched.name && formik.errors.name
                                ? true
                                : false
                            }
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <FormFeedback type="invalid">
                              {formik.errors.name}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label
                            htmlFor="status-create-commodity"
                            className="form-label"
                          >
                            {t("Status")}
                          </Label>
                          <Input
                            name="status"
                            type="select"
                            className="form-control"
                            id="status-create-commodity"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.status}
                            invalid={
                              formik.touched.status &&
                              formik.errors.status
                                ? true
                                : false
                            }
                          >
                            <option value={"active"}>{t("active")}</option>
                            <option value={"inactive"}>{t("inactive")}</option>
                        </Input>
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="note-create-commodity" className="form-label">
                            Note
                          </Label>
                          <Input
                            name="note"
                            type="text"
                            className="form-control"
                            id="note-create-commodity"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.note}
                            invalid={
                              formik.touched.note && formik.errors.note
                                ? true
                                : false
                            }
                          />
                          {formik.touched.note && formik.errors.note ? (
                            <FormFeedback type="invalid">
                              {formik.errors.note}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col lg={12}>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="submit"
                            className="btn btn-soft-success"
                          >
                            Submit
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateCommo;
