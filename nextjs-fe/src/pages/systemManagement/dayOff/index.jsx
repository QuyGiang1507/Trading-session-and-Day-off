import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { addDays } from 'date-fns';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { Link } from "components";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { dayOffService } from "services";

const DayOffList = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [events, setEvents] = useState([]);

  const getData = useCallback(async() => {
    dayOffService
      .getListDayOffs({
        status: "approved",
        tempFor: "null",
      })
      .then((response) => {
        const eventList = response.payload.data
        .sort((a, b) => (a.start - b.start))
        .reduce((newArr, cur) => {
          const index = newArr.findIndex((obj) => obj.start === cur.start);
          if (index === -1) {
            newArr.push(cur);
          } else if (cur.description !== "Fixed day off") {
            newArr[index] = cur;
          }
          return newArr;
        }, [])
        .map(item => {
          const event = {
            title: item.title,
            start: item.start.slice(0, 10),
            end: addDays(new Date(item.end), 1).toISOString("en-GB").slice(0, 10),
            id: item.id,
            display: "background",
            textColor: "blue",
            color: "blue",
            backgroundColor: item.description === "Fixed day off" ? "#EEEEEE" : "#FFFFCC",
            borderColor: item.description === "Fixed day off" ? "#EEEEEE" : "#FFFFCC",
          }

          return event;
        });
        setEvents(eventList)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  useEffect(() => {
    getData();
  }, [getData]);

  const handleClickDayOff = (e) => {
    router.push("/systemManagement/dayOff/" + e.event.id);
  };

  const eventDidMount = (arg) => {
    const eventEl = arg.el;

    eventEl.style.opacity = "0.7";
  };

  const handleEventMouseEnter = (event) => {
    const eventEl = event.el;
    eventEl.style.opacity = "0.3";
    eventEl.style.cursor = "pointer";
  };

  const handleEventMouseLeave = (event) => {
    const eventEl = event.el;
    eventEl.style.opacity = "0.7";
  };

  const headerToolbar = {
    left: "prev,next today",
    center: "title",
    right: "multiMonthYear,dayGridMonth,dayGridWeek",
  };

  const isValidDate = (date) => {
    const currentDate = new Date(date);

    if (currentDate < addDays(new Date(Date.now()), -1)) {
      return false; 
    }

    return true; 
  };

  const dayCellClassNames = (arg) => {
    const date = arg.date;
    const isValid = isValidDate(date);

    if (!isValid) {
      return 'disabled';
    }

    return '';
  };

  document.title = t("Day off");
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">{t("List")}</h4>
                  <div className="flex-shrink-0">
                    <Link
                      href={"/systemManagement/dayOff/createDayOff"}
                    >
                      <Button
                        color="primary"
                        className="btn-soft-success"
                        style={{ border: "none" }}
                      >
                        {t("Add Day Off")}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardBody>
                  <div>
                    <FullCalendar
                      height={600}
                      plugins={[dayGridPlugin, multiMonthPlugin]}
                      initialView='dayGridMonth'
                      events={events}
                      headerToolbar={headerToolbar}
                      multiMonthMaxColumns={2}
                      eventTitleWrap={true}
                      eventClick={(e) => handleClickDayOff(e)}
                      eventMouseEnter={handleEventMouseEnter}
                      eventMouseLeave={handleEventMouseLeave}
                      dayCellClassNames={dayCellClassNames}
                      eventDidMount={eventDidMount}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DayOffList;