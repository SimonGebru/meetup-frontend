import { mockMeetups } from "../data/mockMeetups";

export async function getMeetups() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMeetups), 800);
  });
}

export async function getMeetupById(id) {
  return new Promise((resolve, reject) => {
    const meetup = mockMeetups.find((m) => m.id === id);
    meetup ? resolve(meetup) : reject("Meetup ej hittad");
  });
}

export async function registerToMeetup(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, message: "Anmäld (mock)" }), 500);
  });
}