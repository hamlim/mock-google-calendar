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

function Textarea({ name }: { name: string }) {
  return <textarea className="border rounded p-3" name={name} />;
}

export default function Home() {
  return (
    <main className="p-4 min-h-screen grid grid-cols-2  gap-3">
      <div className="grid grid-rows-[repeat(24,1fr)]">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            className="border border-t-0 first:border-t"
            key={index.toString()}
          >
            {index}
          </div>
        ))}
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            console.log(data);
          }}
          className="flex max-w-md m-auto flex-col gap-3"
        >
          <Label>
            Title
            <Input name="title" type="text" />
          </Label>
          <Label>
            Start Time
            <Input step={3600} name="start-time" type="time" />
          </Label>
          <Label>
            End Time
            <Input step={3600} name="end-time" type="time" />
          </Label>
          <Label>
            Description
            <Textarea name="description" />
          </Label>
          <div className="flex justify-end">
            <button
              className="rounded p-3 text-white bg-green-700"
              type="submit"
            >
              Create event
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
