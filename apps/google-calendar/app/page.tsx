"use client";

import { useReducer } from "react";

// Capturing some notes:

// UI -
// - List of hours (24, 0 -> 23)
// - each hour can have at most 1 event
// - each event has:
//   - title
//   - description
//   - start time
//   - end time
// - Form at the top of the view
//   - title
//   - start time
//   - end time
//   - description
//   - button create event

function Label({ children }: { children: React.ReactNode }) {
  return <label className="flex flex-col gap-2">{children}</label>;
}

function Input({ name, type, ...props }: { name: string; type: string }) {
  return (
    <input className="border rounded p-3" name={name} type={type} {...props} />
  );
}

function Textarea({ name, ...props }: { name: string }) {
  return <textarea className="border rounded p-3" name={name} {...props} />;
}

function reducer(state, action) {
  switch (action.type) {
    case "set-start-time": {
      let errors = state.errors;
      if (errors && errors.startTime) {
        delete errors.startTime;
      }
      return {
        ...state,
        errors,
        form: {
          ...state.form,
          startTime: action.payload,
        },
      };
    }
    case "set-title": {
      let errors = state.errors;
      if (errors && errors.title) {
        delete errors.title;
      }
      return {
        ...state,
        errors,
        form: {
          ...state.form,
          title: action.payload,
        },
      };
    }
    case "set-description": {
      return {
        ...state,
        form: {
          ...state.form,
          description: action.payload,
        },
      };
    }
    case "set-end-time": {
      let errors = state.errors;
      if (errors && errors.endTime) {
        delete errors.endTime;
      }
      return {
        ...state,
        errors,
        form: {
          ...state.form,
          endTime: action.payload,
        },
      };
    }
    case "create": {
      if (!state.form.startTime || !state.form.endTime || !state.form.title) {
        return {
          ...state,
          errors: {
            startTime: !state.form.startTime,
            endTime: !state.form.endTime,
            title: !state.form.title,
          },
        };
      }

      return {
        ...state,
        form: {
          startTime: "",
          endTime: "",
          title: "",
          description: "",
        },
        events: [
          ...state.events,
          {
            title: state.form.title,
            startTime: state.form.startTime,
            endTime: state.form.endTime,
            description: state.form.description,
          },
        ],
      };
    }
  }
}

function startToOffset(startTime: string): number {
  let hour = startTime.split(":")[0];
  hour = Number.parseInt(hour, 10);

  return hour * 200;
}

function computeHeight(evt) {
  let startTime = Number.parseInt(evt.startTime.split(":")[0]);
  let endTime = Number.parseInt(evt.endTime.split(":")[0]);

  return (endTime - startTime) * 200;
}

export default function Home() {
  let [state, dispatch] = useReducer(reducer, {
    form: {
      startTime: "",
      endTime: "",
      title: "",
      description: "",
    },
    events: [],
    errors: {},
  });
  return (
    <main className="p-4 min-h-screen grid grid-cols-2  gap-3">
      <div className="relative">
        <div className="day">
          {Array.from({ length: 24 }).map((_, index) => (
            <button
              type="button"
              onClick={() => {
                dispatch({
                  type: "set-start-time",
                  payload: `${`${index}`.padStart(2, "0")}:00`,
                });
              }}
              className="hour"
              key={index.toString()}
            >
              {index}
            </button>
          ))}
        </div>
        <div className="events">
          {state.events.map((evt) => (
            <div
              key={evt.title + evt.startTime + evt.endTime + evt.description}
              className="event"
              style={{
                "--top-offset": startToOffset(evt.startTime),
                "--height": computeHeight(evt),
              }}
            >
              {evt.title}
            </div>
          ))}
        </div>
      </div>
      <div className="fixed right-0 top-0 w-1/2">
        <div className="flex max-w-md m-auto flex-col gap-3">
          <Label>
            Title
            {state.errors.title ? (
              <>
                <br />
                <span className="text-red-600">Missing value</span>
              </>
            ) : null}
            <Input
              name="title"
              value={state.form.title}
              required
              onChange={(e) => {
                let val = e.target.value;
                dispatch({
                  type: "set-title",
                  payload: val,
                });
              }}
              type="text"
            />
          </Label>
          <Label>
            Start Time
            {state.errors.startTime ? (
              <>
                <br />
                <span className="text-red-600">Missing value</span>
              </>
            ) : null}
            <Input
              step={3600}
              name="start-time"
              required
              type="time"
              value={state.form.startTime}
              onChange={(e) => {
                let val = e.target.value;
                dispatch({
                  type: "set-start-time",
                  payload: val,
                });
              }}
            />
          </Label>
          <Label>
            End Time
            {state.errors.endTime ? (
              <>
                <br />
                <span className="text-red-600">Missing value</span>
              </>
            ) : null}
            <Input
              step={3600}
              name="end-time"
              required
              type="time"
              value={state.form.endTime}
              onChange={(e) => {
                let val = e.target.value;
                dispatch({
                  type: "set-end-time",
                  payload: val,
                });
              }}
            />
          </Label>
          <Label>
            Description
            <Textarea
              name="description"
              value={state.form.description}
              onChange={(e) => {
                let val = e.target.value;
                dispatch({
                  type: "set-description",
                  payload: val,
                });
              }}
            />
          </Label>
          <div className="flex justify-end">
            <button
              className="rounded p-3 text-white bg-green-700"
              type="button"
              onClick={() => {
                dispatch({
                  type: "create",
                });
              }}
            >
              Create event
            </button>
          </div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
