import {
  SyntheticEvent,
  useState,
} from 'react';

import ApiCalendar from 'react-google-calendar-api';

const TestDemo = () => {
  const [events, setEvents] = useState([]);
  const handleItemClick = (event: SyntheticEvent<any>, name: string): void => {
    if (name === 'sign-in') {
      ApiCalendar.handleAuthClick()
        .then(() => {
          console.log('sign in succesful!');
        })
        .catch((e) => {
          console.error(`sign in failed ${e}`);
        });
    } else if (name === 'sign-out') {
      ApiCalendar.handleSignoutClick();
    }
  };

  return (
    <div>
      <div>
        <button onClick={(e) => handleItemClick(e, 'sign-in')}>sign-in</button>
        <button onClick={(e) => handleItemClick(e, 'sign-out')}>
          sign-out
        </button>
      </div>
      <div>
        <button
          onClick={(e) => {
            const eventFromNow: object = {
              summary: 'Poc Dev From Now',
              time: 480,
            };

            ApiCalendar.createEventFromNow(eventFromNow)
              .then((result: object) => {
                console.log(result);
              })
              .catch((error: any) => {
                console.log(error);
              });
          }}
        >
          Create Event from now
        </button>
      </div>
      <div>
        <button
          onClick={(e) => {
            if (ApiCalendar.sign)
              ApiCalendar.listUpcomingEvents(10).then(({ result }: any) => {
                console.log(result.items);
                setEvents(result.items)
              });
          }}
        >
          List upcoming events
        </button>
        <div>
          <h4>Events</h4>
          {events.length === 0 && <p>No events to show</p>}
          {events.map((event) => <p>{JSON.stringify(event)}</p>)}
        </div>
      </div>
    </div>
  );
}

export default TestDemo