import React, { useState, useEffect } from "react";
import { Link } from "components";
import Image from "next/future/image";
import { useRouter } from "next/router";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody,
  FormFeedback,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import * as Yup from "yup";
import { useFormik } from "formik";
import { APIClient } from "helpers/api_helper";
import BreadCrumb from "components/Common/BreadCrumb";
import loadingGif from "assets/images/loading.gif";
import { userService, authService, departmentService } from "services";
import { toast } from "react-toastify";
import {useTranslation} from "react-i18next";
import defaultAvatar from '../assets/images/default-avatar.jpg'
import UserDetails from "components/users/detail/PersonalDetails";

const UserProfile = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [mode, setMode] = useState("view");
  const [avatar, setAvatar] = useState(undefined);
  const [toogleOldPassword, setToogleOldPassword] = useState(false);
  const [toogleNewPassword, setToogleNewPassword] = useState(false);
  const [toogleConfirmPassword, setToogleConfirmPassword] = useState(false);
  
  const obj = JSON.parse(localStorage.getItem("user"));

  const editClick = () => {
    setMode("edit");
  };
  const cancelClick = () => {
    setMode("view");
  };

  useEffect(() => {
    departmentService.getUser(obj.id).then((res) => {
      // setAvatar("https://hist.mxv.com.vn:4953/" + res.data.avatar);
      setUser(res.payload);
    });
  }, []);

  const [activeTab, setActiveTab] = useState("1");

  const [modal_changePasswordModals, setmodal_changePasswordModals] =
    useState(false);
  function tog_changePasswordModals() {
    setmodal_changePasswordModals(!modal_changePasswordModals);
  } 

  useEffect(() => {
    if (user) {
      formik.setValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        address: user.address,
        gender: user.gender,
        status: user.status,
      });
    }
  }, [user]);

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // const avatarChange = (e) => {
  //   const fmData = new FormData();
  //   fmData.append("avatar_image", e.target.files[0]);
  //   api
  //     .put("https://hist.mxv.com.vn:4953/api/v1/am/users/" + obj.id, fmData)
  //     .then(() => {
  //       const blob = URL.createObjectURL(e.target.files[0]);
  //       console.log(blob);
  //       setAvatar(blob);
  //       toast("Avatar changed!", { className: "bg-success text-white" });
  //     });
  // };

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthday: "",
      address: "",
      gender: "",
      status: "",
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
    }),
    onSubmit(values) {
      console.log(values);
      console.log(
        new Date(values.birthday)
          .toLocaleDateString("en-GB")
          .replaceAll("/", "-")
      );
      
      setMode("view");
    },
  });

  const passwordFormik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },

    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Please Enter Your Password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      newPassword: Yup.string()
        .required("Please Enter Your Password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      confirmNewPassword: Yup.string().oneOf(
        [Yup.ref("newPassword"), null],
        "Must match new password"
      ),
    }),
    onSubmit(values) {
      console.log(values);
      userService
        .changePassword(obj.id, values.oldPassword, values.newPassword)
        .then(() => {
          alert(
            "Change password successful! Please sign in again with your new password."
          );
          router.push("/logout");
        });
    },
  });

  document.title = "Profile Settings";

  return (
    <React.Fragment>
      <div className="page-content">
        {!user && (
          <div className="text-center">
            <Image src={loadingGif} alt=""/>
          </div>
        )}
        {user && (
          <Container fluid>
            <BreadCrumb/>
            <div className="position-relative mx-n4 mt-n4">
              <div className="profile-wid-bg profile-setting-img">
                <div className="overlay-content">
                  <div className="text-end p-3">
                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                      <Input
                        id="profile-foreground-img-file-input"
                        type="file"
                        className="profile-foreground-img-file-input"
                      />
                      {/* <Label
                        htmlFor="profile-foreground-img-file-input"
                        className="profile-photo-edit btn btn-light"
                      >
                        <i className="ri-image-edit-line align-bottom me-1"></i>{" "}
                        Change Cover
                      </Label> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Row>
              <Col xxl={3}>
                <Card className="mt-n5">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                        <Image
                          width="100" height="100"
                          src={defaultAvatar}
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                          alt="user-profile"
                        />
                        {/* <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                          <Input
                            id="profile-img-file-input"
                            type="file"
                            className="profile-img-file-input"
                            onChange={avatarChange}
                          />
                          <Label
                            htmlFor="profile-img-file-input"
                            className="profile-photo-edit avatar-xs"
                          >
                            <span className="avatar-title rounded-circle bg-light text-body">
                              <i className="ri-camera-fill"></i>
                            </span>
                          </Label>
                        </div> */}
                      </div>
                      <h5 className="fs-16 mb-1">
                        {user.name}
                      </h5>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xxl={9}>
                <div className="mt-xxl-n5">
                <UserDetails userId={user.id} user={user}></UserDetails>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
