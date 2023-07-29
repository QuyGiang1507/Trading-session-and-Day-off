import React, {useEffect, useState} from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Input,
  Label,
  Row,
  FormFeedback,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {commodityService} from "services";
import loadingGif from "assets/images/loading.gif";
import Image from "next/future/image";

const CommodityDetails = (props) => {
  const {id} = props;
  const {t} = useTranslation();
  const [commo, setCommo] = useState(props.commo);
  const [mode, setMode] = useState("view");

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    setMode("view");
  };
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: commo,

    validationSchema: Yup.object({
      code: Yup.string().required("please enter code"),
      name: Yup.string().required("please enter name"),
      exchange: Yup.string().required("please enter exchange"),
      countryCode: Yup.string().required("please enter countryCode"),
      currencyUnit: Yup.string().required("please enter currencyUnit"),
      contractUnit: Yup.string().required("please enter contractUnit"),
      priceListingUnit: Yup.number().required("please enter priceListingUnit"),
      contractVolume: Yup.number().required("please enter contractVolume"),
      tickSize: Yup.number().required("please enter tickSize"),
      commodityStatus: Yup.string().required("please enter commodityStatus"),
      exchange: Yup.string().required("please enter exchange"),
      fullname: Yup.string().required("please enter fullname"),
      shortname: Yup.string().required("please enter shortname"),
      decimal: Yup.string().required("please enter decimal"),
      dueMonths: Yup.mixed().required("please enter dueMonths"),
      initialMarginMXV: Yup.string().required("please enter initialMarginMXV"),
      initialMarginMXVOC: Yup.string().required("please enter initialMarginMXVOC"),
      initialMarginCQG: Yup.string().required("please enter initialMarginCQG"),
    }),
    onSubmit(values) {
      commodityService.updateCommo(id,{
        code: values.code,
        name: values.name,
        exchange:values.exchange,
        countryCode: values.countryCode,
        currencyUnit: values.currencyUnit,
        contractUnit: values.contractUnit,
        commodityType: values.commodityType,
        priceListingUnit: values.priceListingUnit,
        contractVolume: values.contractVolume,
        tickSize: values.tickSize,
        commodityStatus: values.commodityStatus,
        note: values.note,
        fullname: values.fullname,
        shortname: values.shortname,
        decimal: values.decimal,
        dueMonths: typeof(values.dueMonths) == "string"?values.dueMonths.split(/[\s,]+/):values.dueMonths,
        initialMarginMXV: values.initialMarginMXV,
        initialMarginMXVOC: values.initialMarginMXVOC,
        initialMarginCQG: values.initialMarginCQG,
      })
      setMode("view");
    },
  });
  
  
  return (
    <>
      {!commo && (
        <div className="text-center">
          <Image src={loadingGif} alt="" />
        </div>
      )}
      {commo && (
        <Card>
          <CardHeader>
            <h4 className="card-title mb-0 flex-grow-1">Personal Details</h4>
          </CardHeader>
          <CardBody className="p-4">
            <Form
              className="needs-validation"
              onSubmit={formik.handleSubmit}
              action="#"
              autoComplete="off"
            >
              <Row>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="codeInput" className="form-label">
                      code
                    </Label>
                    <Input
                      name="code"
                      type="text"
                      className="form-control"
                      id={"codeInput"}
                      placeholder="Enter code"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.code}
                      invalid={
                        formik.touched.code && formik.errors.code ? true : false
                      }
                      disabled={true}
                      autoComplete="off"
                    />
                    {formik.touched.code && formik.errors.code ? (
                      <FormFeedback type="invalid">
                        {formik.errors.code}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="nameInput" className="form-label">
                      name
                    </Label>
                    <Input
                      name="name"
                      type="text"
                      className="form-control"
                      id={"nameInput"}
                      placeholder="Enter name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      invalid={
                        formik.touched.name && formik.errors.name ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <FormFeedback type="invalid">
                        {formik.errors.name}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="exchangeInput" className="form-label">
                      exchange
                    </Label>
                    <Input
                      name="exchange"
                      type="text"
                      className="form-control"
                      id={"exchangeInput"}
                      placeholder="Enter exchange"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.exchange}
                      invalid={
                        formik.touched.exchange && formik.errors.exchange ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.exchange && formik.errors.exchange ? (
                      <FormFeedback type="invalid">
                        {formik.errors.exchange}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="countryCodeInput" className="form-label">
                      countryCode
                    </Label>
                    <Input
                      name="countryCode"
                      type="text"
                      className="form-control"
                      id={"countryCodeInput"}
                      placeholder="Enter countryCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.countryCode}
                      invalid={
                        formik.touched.countryCode && formik.errors.countryCode ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.countryCode && formik.errors.countryCode ? (
                      <FormFeedback type="invalid">
                        {formik.errors.countryCode}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="currencyUnitInput" className="form-label">
                      currencyUnit
                    </Label>
                    <Input
                      name="currencyUnit"
                      type="text"
                      className="form-control"
                      id={"currencyUnitInput"}
                      placeholder="Enter currencyUnit"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.currencyUnit}
                      invalid={
                        formik.touched.currencyUnit && formik.errors.currencyUnit ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.currencyUnit && formik.errors.currencyUnit ? (
                      <FormFeedback type="invalid">
                        {formik.errors.currencyUnit}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="contractUnitInput" className="form-label">
                      contractUnit
                    </Label>
                    <Input
                      name="contractUnit"
                      type="text"
                      className="form-control"
                      id={"contractUnitInput"}
                      placeholder="Enter contractUnit"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.contractUnit}
                      invalid={
                        formik.touched.contractUnit && formik.errors.contractUnit ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.contractUnit && formik.errors.contractUnit ? (
                      <FormFeedback type="invalid">
                        {formik.errors.contractUnit}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="commodityTypeInput" className="form-label">
                      commodityType
                    </Label>
                    <Input
                      name="commodityType"
                      type="select"
                      className="form-control"
                      id={"commodityTypeInput"}
                      placeholder="Enter commodityType"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.commodityType}
                      invalid={
                        formik.touched.commodityType && formik.errors.commodityType ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={""}> -- {t("select")} -- </option>
                      <option value={"normal"}>Normal</option>
                    </Input>
                    {formik.touched.commodityType && formik.errors.commodityType ? (
                      <FormFeedback type="invalid">
                        {formik.errors.commodityType}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="priceListingUnitInput" className="form-label">
                      priceListingUnit
                    </Label>
                    <Input
                      name="priceListingUnit"
                      type="number"
                      className="form-control"
                      id={"priceListingUnitInput"}
                      placeholder="Enter priceListingUnit"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.priceListingUnit}
                      invalid={
                        formik.touched.priceListingUnit && formik.errors.priceListingUnit ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.priceListingUnit && formik.errors.priceListingUnit ? (
                      <FormFeedback type="invalid">
                        {formik.errors.priceListingUnit}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="contractVolumeInput" className="form-label">
                      contractVolume
                    </Label>
                    <Input
                      name="contractVolume"
                      type="number"
                      className="form-control"
                      id={"contractVolumeInput"}
                      placeholder="Enter contractVolume"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.contractVolume}
                      invalid={
                        formik.touched.contractVolume && formik.errors.contractVolume ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.contractVolume && formik.errors.contractVolume ? (
                      <FormFeedback type="invalid">
                        {formik.errors.contractVolume}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="tickSizeInput" className="form-label">
                      tickSize
                    </Label>
                    <Input
                      name="tickSize"
                      type="number"
                      className="form-control"
                      id={"tickSizeInput"}
                      placeholder="Enter tickSize"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.tickSize}
                      invalid={
                        formik.touched.tickSize && formik.errors.tickSize ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.tickSize && formik.errors.tickSize ? (
                      <FormFeedback type="invalid">
                        {formik.errors.tickSize}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="commodityStatusInput" className="form-label">
                      commodityStatus
                    </Label>
                    <Input
                      name="commodityStatus"
                      type="select"
                      className="form-control"
                      id={"commodityStatusInput"}
                      placeholder="Enter commodityStatus"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.commodityStatus}
                      invalid={
                        formik.touched.commodityStatus && formik.errors.commodityStatus ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                      >
                        <option disabled value={""}> -- {t("select")} -- </option>
                        <option value={"active"}>{t("active")}</option>
                        <option value={"inactive"}>{t("inactive")}</option>
                      </Input>
                    {formik.touched.commodityStatus && formik.errors.commodityStatus ? (
                      <FormFeedback type="invalid">
                        {formik.errors.commodityStatus}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="noteInput" className="form-label">
                      note
                    </Label>
                    <Input
                      name="note"
                      type="text"
                      className="form-control"
                      id={"noteInput"}
                      placeholder="Enter note"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.note}
                      invalid={
                        formik.touched.note && formik.errors.note ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.note && formik.errors.note ? (
                      <FormFeedback type="invalid">
                        {formik.errors.note}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="fullnameInput" className="form-label">
                      fullname
                    </Label>
                    <Input
                      name="fullname"
                      type="text"
                      className="form-control"
                      id={"fullnameInput"}
                      placeholder="Enter fullname"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fullname}
                      invalid={
                        formik.touched.fullname && formik.errors.fullname ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.fullname && formik.errors.fullname ? (
                      <FormFeedback type="invalid">
                        {formik.errors.fullname}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="shortnameInput" className="form-label">
                      shortname
                    </Label>
                    <Input
                      name="shortname"
                      type="text"
                      className="form-control"
                      id={"shortnameInput"}
                      placeholder="Enter shortname"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shortname}
                      invalid={
                        formik.touched.shortname && formik.errors.shortname ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.shortname && formik.errors.shortname ? (
                      <FormFeedback type="invalid">
                        {formik.errors.shortname}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="decimalInput" className="form-label">
                      decimal
                    </Label>
                    <Input
                      name="decimal"
                      type="number"
                      className="form-control"
                      id={"decimalInput"}
                      placeholder="Enter decimal"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.decimal}
                      invalid={
                        formik.touched.decimal && formik.errors.decimal ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.decimal && formik.errors.decimal ? (
                      <FormFeedback type="invalid">
                        {formik.errors.decimal}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="dueMonthsInput" className="form-label">
                      dueMonths
                    </Label>
                    <Input
                      name="dueMonths"
                      type="text"
                      className="form-control"
                      id={"dueMonthsInput"}
                      placeholder="Enter dueMonths"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.dueMonths}
                      invalid={
                        formik.touched.dueMonths && formik.errors.dueMonths ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.dueMonths && formik.errors.dueMonths ? (
                      <FormFeedback type="invalid">
                        {formik.errors.dueMonths}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="initialMarginMXVInput" className="form-label">
                      initialMarginMXV
                    </Label>
                    <Input
                      name="initialMarginMXV"
                      type="number"
                      className="form-control"
                      id={"initialMarginMXVInput"}
                      placeholder="Enter initialMarginMXV"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.initialMarginMXV}
                      invalid={
                        formik.touched.initialMarginMXV && formik.errors.initialMarginMXV ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.initialMarginMXV && formik.errors.initialMarginMXV ? (
                      <FormFeedback type="invalid">
                        {formik.errors.initialMarginMXV}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="initialMarginMXVOCInput" className="form-label">
                      initialMarginMXVOC
                    </Label>
                    <Input
                      name="initialMarginMXVOC"
                      type="number  "
                      className="form-control"
                      id={"initialMarginMXVOCInput"}
                      placeholder="Enter initialMarginMXVOC"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.initialMarginMXVOC}
                      invalid={
                        formik.touched.initialMarginMXVOC && formik.errors.initialMarginMXVOC ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.initialMarginMXVOC && formik.errors.initialMarginMXVOC ? (
                      <FormFeedback type="invalid">
                        {formik.errors.initialMarginMXVOC}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="initialMarginCQGInput" className="form-label">
                      initialMarginCQG
                    </Label>
                    <Input
                      name="initialMarginCQG"
                      type="number"
                      className="form-control"
                      id={"initialMarginCQGInput"}
                      placeholder="Enter initialMarginCQG"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.initialMarginCQG}
                      invalid={
                        formik.touched.initialMarginCQG && formik.errors.initialMarginCQG ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    {formik.touched.initialMarginCQG && formik.errors.initialMarginCQG ? (
                      <FormFeedback type="invalid">
                        {formik.errors.initialMarginCQG}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>



                <Col lg={12}>
                  <div className="hstack gap-2 justify-content-end">
                    {mode == "view" && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={editClick}
                      >
                        {t("Edit")}
                      </button>
                    )}

                    {mode == "edit" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-soft-danger"
                          onClick={cancelClick}
                        >
                          {t("Cancel")}
                        </button>
                        <button type="submit" className="btn btn-soft-success">
                          {t("Submit")}
                        </button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default CommodityDetails;
