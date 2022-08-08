import React, { useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const DnDCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

function CalendarPresenter() {
  const defaultDate = useMemo(() => new Date(), []);
  return (
    <div style={{ height: "1000px" }}>
      <DnDCalendar
        defaultDate={defaultDate}
        defaultView={Views.MONTH}
        localizer={localizer}
      />
    </div>
  );
}

export default CalendarPresenter;
