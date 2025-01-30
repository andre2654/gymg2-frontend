import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

//import { Calendar } from '@fullcalendar/core'
//import multiMonthPlugin from '@fullcalendar/multimonth'

const events = [
  { title: 'Meeting', start: '2024-12-06T09:00:00', end: '2024-12-06T11:00:00', daysofweek: [1, 2, 3, 4, 5]},
  { title: 'Meeting google', start: '2024-12-05', end: '2024-12-06', URL: 'http://www.google.com/'},
  { title: 'Meeting', start: '2024-12-06T09:00:00', end: '2024-12-06T12:00:00'},
  { title: 'Meeting', allday:true},
]

// a custom render function
function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

const FullCalendarWidget = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridWeek'
        weekends={false}
        events={events}
        eventContent={renderEventContent}
        eventMaxStack={3}
      />
    </div>
  );
}

export default FullCalendarWidget;