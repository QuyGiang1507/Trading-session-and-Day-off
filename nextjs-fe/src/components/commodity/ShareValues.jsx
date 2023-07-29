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

const ShareValues = (props) => {
  const {type, parentId, instrumentType} = props
  const {t} = useTranslation();
  const [values, setValues] = useState(props.values);
  const [mode, setMode] = useState("view");
  const [principles, setPrinciples] = useState(undefined);
  useEffect(() => {
    commodityService.getPrinciples().then((res)=>setPrinciples(res.payload));
    ;
  }, []);
  
  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    if(type=="update")
      formik.setValues(props.values)
    if(type=="create")
      formik.resetForm()
    setMode("view");
  };
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: values||{
      enable: false,
      currencyUnit: null,
      contractUnit: null,
      priceListingUnit: null,
      contractVolume: null,
      tickSize: null,
      decimal: null,
      dueMonths: null,
      paymentMethod: null,
      typeOfOption: null,
      firstTradingDay: null,
      lastTradingDay: null,
      firstNoticeDay: null,
      lastNoticeDay: null,
      firstDeliveryDay: null,
      lastDeliveryDay: null,
      createNewContract: null,
      note: null,
    },

    validationSchema: Yup.object({
      currencyUnit: Yup.string().required(),
      contractUnit: Yup.string().required(),
      priceListingUnit: Yup.number().required(),
      contractVolume: Yup.number().required(),
      tickSize: Yup.number().required(),
      decimal: Yup.number().required(),
      dueMonths: Yup.string().required(),
      paymentMethod: Yup.string().required(),
      typeOfOption: Yup.string().required(),
      firstTradingDay: Yup.string().required(),
      lastTradingDay: Yup.string().required(),
      firstNoticeDay: Yup.string().required(),
      lastNoticeDay: Yup.string().required(),
      firstDeliveryDay: Yup.string().required(),
      createNewContract: Yup.string().required(),
    }),
    onSubmit(values) {
      console.log(type)
      if(type=="update"){
        commodityService.updateInstrument(values.instrument? values.instrument: values.id,{
          enable: values.enable? values.enable: false,
          currencyUnit: values.currencyUnit,
          contractUnit: values.contractUnit,
          priceListingUnit: values  .priceListingUnit,
          contractVolume: values.contractVolume,
          tickSize: values.tickSize,
          decimal: values.decimal,
          dueMonths: values.dueMonths,
          paymentMethod: values.paymentMethod,
          typeOfOption: instrumentType=="Futures"? "null": values.typeOfOption,
          firstTradingDay: values.firstTradingDay,
          lastTradingDay: values.lastTradingDay,
          firstNoticeDay: values.firstNoticeDay,
          lastNoticeDay: values.lastNoticeDay,
          firstDeliveryDay: values.firstDeliveryDay,
          lastDeliveryDay: values.lastDeliveryDay,
          createNewContract: values.createNewContract,
          note: values.note,
        })
      }
      else if (type=="create")
      {
        commodityService.createInstrument({
          enable: values.enable? values.enable:false,
          currencyUnit: values.currencyUnit,
          contractUnit: values.contractUnit,
          priceListingUnit: values.priceListingUnit,
          contractVolume: values.contractVolume,
          tickSize: values.tickSize,
          decimal: values.decimal,
          dueMonths: values.dueMonths,
          paymentMethod: values.paymentMethod,
          typeOfOption: values.typeOfOption,
          firstTradingDay: values.firstTradingDay,
          lastTradingDay: values.lastTradingDay,
          firstNoticeDay: values.firstNoticeDay,
          lastNoticeDay: values.lastNoticeDay,
          firstDeliveryDay: values.firstDeliveryDay,
          lastDeliveryDay: values.lastDeliveryDay,
          createNewContract: values.createNewContract,
          note: values.note,
          group: parentId,
          groupName: "item",
          name: (instrumentType!="Futures" || instrumentType!="Options")? instrumentType: "Default"
        })
      }
      setMode("view");
    },
  });
  
  return (
          
            <Form
              className="needs-validation"
              onSubmit={formik.handleSubmit}
              action="#"
              autoComplete="off"
            >
              {principles &&
              <Row>
                <Col lg={12}>
                  <div className="mb-3 form-check">
                    <Input
                      name="enable"
                      type="checkbox"
                      className="form-check-input"
                      id={"enableInput"}
                      onChange={(e)=>formik.setFieldValue("enable",e.target.checked)}
                      checked={formik.values.enable}
                      disabled={mode == "view"}
                      autoComplete="off"
                    />
                    <Label htmlFor="currencyUnitInput" className="form-check-label">
                      {t("Enable")}
                    </Label>
                  </div>
                </Col>
                <Col lg={3}>
                <div className="mb-3">
                    <Label htmlFor="currencyUnitInput" className="form-label">
                    {t("currencyUnit")}
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
                    {t("contractUnit")}
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
                    <Label htmlFor="priceListingUnitInput" className="form-label">
                    {t("priceListingUnit")}
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
                    {t("contractVolume")}
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
                    {t("tickSize")}
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
                    <Label htmlFor="noteInput" className="form-label">
                    {t("note")}
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
                    <Label htmlFor="decimalInput" className="form-label">
                    {t("decimal")}
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
                    {t("dueMonths")}
                    </Label>
                    <Input
                      name="dueMonths"
                      type="select"
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
                    >
                      <option disabled value={""} selected hidden> -- {t("select")} -- </option>
                      {Object.values(principles.dueMonths).map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </Input>
                    {formik.touched.dueMonths && formik.errors.dueMonths ? (
                      <FormFeedback type="invalid">
                        {formik.errors.dueMonths}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="paymentMethodInput" className="form-label">
                    {t("paymentMethod")}
                    </Label>
                    <Input
                      name="paymentMethod"
                      type="select"
                      className="form-control"
                      id={"paymentMethodInput"}
                      placeholder="Enter paymentMethod"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.paymentMethod}
                      invalid={
                        formik.touched.paymentMethod && formik.errors.paymentMethod ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      <option value="cash">cash</option>
                      <option value="physical">physical</option>
                    </Input>
                  </div>
                </Col>
                {instrumentType!="Futures"&&
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="typeOfOptionInput" className="form-label">
                    {t("typeOfOption")}
                    </Label>
                    <Input
                      name="typeOfOption"
                      type="select"
                      className="form-control"
                      id={"typeOfOptionInput"}
                      placeholder="Enter typeOfOption"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.typeOfOption}
                      invalid={
                        formik.touched.typeOfOption && formik.errors.typeOfOption ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      <option value="american-option">american option</option>
                      <option value="european-option">european option</option>
                    </Input>
                  </div>
                </Col>}
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="firstTradingDayInput" className="form-label">
                    {t("firstTradingDay")}
                    </Label>
                    <Input
                      name="firstTradingDay"
                      type="select"
                      className="form-control"
                      id={"firstTradingDayInput"}
                      placeholder="Enter firstTradingDay"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstTradingDay}
                      invalid={
                        formik.touched.firstTradingDay && formik.errors.firstTradingDay ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      {Object.values(principles.firstTradingDay).map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </Input>
                    {formik.touched.firstTradingDay && formik.errors.firstTradingDay ? (
                      <FormFeedback type="invalid">
                        {formik.errors.firstTradingDay}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="lastTradingDayInput" className="form-label">
                    {t("lastTradingDay")}
                    </Label>
                    <Input
                      name="lastTradingDay"
                      type="select"
                      className="form-control"
                      id={"lastTradingDayInput"}
                      placeholder="Enter lastTradingDay"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastTradingDay}
                      invalid={
                        formik.touched.lastTradingDay && formik.errors.lastTradingDay ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      {Object.values(principles.lastTradingDay).map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </Input>
                    {formik.touched.lastTradingDay && formik.errors.lastTradingDay ? (
                      <FormFeedback type="invalid">
                        {formik.errors.lastTradingDay}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="firstNoticeDayInput" className="form-label">
                    {t("firstNoticeDay")}
                    </Label>
                    <Input
                      name="firstNoticeDay"
                      type="select"
                      className="form-control"
                      id={"firstNoticeDayInput"}
                      placeholder="Enter firstNoticeDay"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstNoticeDay}
                      invalid={
                        formik.touched.firstNoticeDay && formik.errors.firstNoticeDay ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      {Object.values(principles.firstNoticeDay).map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </Input>
                    {formik.touched.firstNoticeDay && formik.errors.firstNoticeDay ? (
                      <FormFeedback type="invalid">
                        {formik.errors.firstNoticeDay}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="lastNoticeDayInput" className="form-label">
                    {t("lastNoticeDay")}
                    </Label>
                    <Input
                      name="lastNoticeDay"
                      type="select"
                      className="form-control"
                      id={"lastNoticeDayInput"}
                      placeholder="Enter lastNoticeDay"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastNoticeDay}
                      invalid={
                        formik.touched.lastNoticeDay && formik.errors.lastNoticeDay ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      {Object.values(principles.lastNoticeDay).map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </Input>
                    {formik.touched.lastNoticeDay && formik.errors.lastNoticeDay ? (
                      <FormFeedback type="invalid">
                        {formik.errors.lastNoticeDay}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="firstDeliveryDayInput" className="form-label">
                    {t("firstDeliveryDay")}
                    </Label>
                    <Input
                      name="firstDeliveryDay"
                      type="select"
                      className="form-control"
                      id={"firstDeliveryDayInput"}
                      placeholder="Enter firstDeliveryDay"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstDeliveryDay}
                      invalid={
                        formik.touched.firstDeliveryDay && formik.errors.firstDeliveryDay ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      {Object.values(principles.firstDeliveryDay).map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </Input>
                    {formik.touched.firstDeliveryDay && formik.errors.firstDeliveryDay ? (
                      <FormFeedback type="invalid">
                        {formik.errors.firstDeliveryDay}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="lastDeliveryDayInput" className="form-label">
                    {t("lastDeliveryDay")}
                    </Label>
                    <Input
                      name="lastDeliveryDay"
                      type="select"
                      className="form-control"
                      id={"lastDeliveryDayInput"}
                      placeholder="Enter lastDeliveryDay"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastDeliveryDay}
                      invalid={
                        formik.touched.lastDeliveryDay && formik.errors.lastDeliveryDay ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      {Object.values(principles.lastDeliveryDay).map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </Input>
                    {formik.touched.lastDeliveryDay && formik.errors.lastDeliveryDay ? (
                      <FormFeedback type="invalid">
                        {formik.errors.lastDeliveryDay}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>

                <Col lg={3}>
                  <div className="mb-3">
                    <Label htmlFor="createNewContractInput" className="form-label">
                    {t("createNewContract")}
                    </Label>
                    <Input
                      name="createNewContract"
                      type="select"
                      className="form-control"
                      id={"createNewContractInput"}
                      placeholder="Enter createNewContract"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.createNewContract}
                      invalid={
                        formik.touched.createNewContract && formik.errors.createNewContract ? true : false
                      }
                      disabled={mode == "view"}
                      autoComplete="off"
                    >
                      <option disabled value={null} selected> -- {t("select")} --</option>
                      {Object.values(principles.createNewContract).map((value) => (
                        <option value={value} key={value}>{value}</option>
                      ))}
                    </Input>
                    {formik.touched.createNewContract && formik.errors.createNewContract ? (
                      <FormFeedback type="invalid">
                        {formik.errors.createNewContract}
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
              }
            </Form>
  );
};

export default ShareValues;
