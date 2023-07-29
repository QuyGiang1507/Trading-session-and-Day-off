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

const CreateContract = () => {
  const router = useRouter();
  const {itemId} =router.query
  const { t } = useTranslation();
  const [itemList, setitemList]= useState(null)
  const [commoList, setcommoList] = useState(null)
  const [instrumentList, setinstrumentList] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCommo, setSelectedCommo] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  
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
  
  useEffect(()=>{
    setSelectedCommo(null)
    if(selectedItem){
      commodityService.getOneItem(selectedItem.value)
      .then((res)=>{
        console.log(res)
        let tmp= []
        res.payload.commodity.forEach(element => {
          tmp.push({
            value: element.id,
            label: element.code +" - " +element.name
          })
        });
        console.log(tmp)
        setcommoList(tmp)
      })
    }
  },[selectedItem])

  useEffect(()=>{
    setSelectedInstrument(null)
    if(selectedCommo){
      commodityService.getOneCommo(selectedCommo.value)
      .then((res)=>{
        console.log(res)
        let tmp= []
        res.payload.instrument.forEach(element => {
          if(element.name!="Default"){
            tmp.push({
              value: element.id,
              label: element.name
            })
          }
        });
        console.log(tmp)
        setinstrumentList(tmp)
      })
    }
  },[selectedCommo])

  function handleSelectItem(e) {
    console.log(selectedItem)
    setSelectedItem(e);
  }

  function handleSelectCommo(e) {
    console.log(selectedCommo)
    setSelectedCommo(e);
  }
  function handleSelectInstrument(e) {
    console.log(selectedInstrument)
    setSelectedInstrument(e);
  }
  const formik = useFormik({  
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
        item:"",
        name: "",   
        status: "inactive",
        dueYear:"",
        dueMonth:"",
        note: "",
    },

    validationSchema: Yup.object({
        name: Yup.string().required("Please Enter Contract Name"),
    }),
    async onSubmit(values) {
      console.log(selectedItem)
        await commodityService.createContract({
            item: selectedItem.value,
            commodity: selectedCommo.value,
            instrument: selectedInstrument.value,
            name: values.name,
            status:values.status,
            dueYear:values.dueYear,
            dueMonth:values.dueMonth,
            note: values.note
        }).then((res)=>{if(!res.errors) router.push("/commodityManagement/contracts")})
        
    },
  });

  document.title = "Create Contract";

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
                    <Col lg={6}>
                        <div className="mb-3">
                        <Label htmlFor="items" className="form-label">{t("item")}</Label>                                                        
                        <Select
                              value={selectedItem}
                              onChange={(e) => {
                                  handleSelectItem(e);
                              }}
                              options={itemList}
                          />
                        </div>
                      </Col>}
                      {commoList &&
                      <Col lg={6}>
                          <div className="mb-3">
                          <Label htmlFor="commo" className="form-label">{t("commodity")}</Label>                                                        
                          <Select
                                value={selectedCommo}
                                onChange={(e) => {
                                    handleSelectCommo(e);
                                }}
                                options={commoList}
                            />
                          </div>
                        </Col>}
                        {instrumentList &&
                      <Col lg={6}>
                          <div className="mb-3">
                          <Label htmlFor="instrument" className="form-label">Type</Label>                                                        
                          <Select
                                value={selectedInstrument}
                                onChange={(e) => {
                                    handleSelectInstrument(e);
                                }}
                                options={instrumentList}
                            />
                          </div>
                        </Col>}
                      
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="name-create-contract" className="form-label">
                            {t("Name")}
                          </Label>
                          <Input
                            name="name"
                            type="text"
                            className="form-control"
                            id="name-create-contract"
                            placeholder="Enter contract name"
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
                          <Label htmlFor="dueYear-create-contract" className="form-label">
                            {t("dueYear")}
                          </Label>
                          <Input
                            name="dueYear"
                            type="number"
                            className="form-control"
                            id="dueYear-create-contract"
                            placeholder="Enter contract dueYear"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.dueYear}
                            invalid={
                              formik.touched.dueYear && formik.errors.dueYear
                                ? true
                                : false
                            }
                          />
                          {formik.touched.dueYear && formik.errors.dueYear ? (
                            <FormFeedback type="invalid">
                              {formik.errors.dueYear}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label htmlFor="dueMonth-create-contract" className="form-label">
                            {t("dueMonth")}
                          </Label>
                          <Input
                            name="dueMonth"
                            type="number"
                            className="form-control"
                            id="dueMonth-create-contract"
                            placeholder="Enter contract dueMonth"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.dueMonth}
                            invalid={
                              formik.touched.dueMonth && formik.errors.dueMonth
                                ? true
                                : false
                            }
                          />
                          {formik.touched.dueMonth && formik.errors.dueMonth ? (
                            <FormFeedback type="invalid">
                              {formik.errors.dueMonth}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Label
                            htmlFor="status-create-contract"
                            className="form-label"
                          >
                            {t("Status")}
                          </Label>
                          <Input
                            name="status"
                            type="select"
                            className="form-control"
                            id="status-create-contract"
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
                          <Label htmlFor="note-create-contract" className="form-label">
                            Note
                          </Label>
                          <Input
                            name="note"
                            type="text"
                            className="form-control"
                            id="note-create-contract"
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

export default CreateContract;
