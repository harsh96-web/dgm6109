"use strict";

// Harsh Kumar — Term Project Phase 2
// Full dataset range: 2025-09-25 → 2025-10-22 (28 days)
// Rule: Tue & Thu = University day (No gym)

let workoutData = [
  {
    date: "2025-09-25",
    duration: 0,
    exercises: ["No gym"], // list of exercises (rest day)
    sleep: { hours: 7.0, wakeups: 1 },
    protein: 115,
    restfulness: "Good",
    notes: "University day — no workout."
  }, // end observation #1

  {
    date: "2025-09-26",
    duration: 70,
    exercises: [
      { name: "Deadlift", sets: 3, reps: 8 },
      { name: "Pull-ups", sets: 3, reps: 10 }
    ], // list of exercises
    sleep: { hours: 7.2, wakeups: 1 },
    protein: 125,
    restfulness: "Good",
    notes: "Solid workout after class break."
  }, // end observation #2

  {
    date: "2025-09-27",
    duration: 80,
    exercises: [
      { name: "Incline Press", sets: 4, reps: 10 },
      { name: "Leg Press", sets: 4, reps: 12 }
    ], // list of exercises
    sleep: { hours: 7.6, wakeups: 1 },
    protein: 130,
    restfulness: "Good",
    notes: "Deep sleep, steady energy."
  }, // end observation #3

  {
    date: "2025-09-28",
    duration: 50,
    exercises: [
      { name: "Shoulder Press", sets: 3, reps: 10 },
      { name: "Lunges", sets: 3, reps: 12 }
    ], // list of exercises
    sleep: { hours: 6.3, wakeups: 2 },
    protein: 115,
    restfulness: "Fair",
    notes: "Lighter workout, restless night."
  }, // end observation #4

  {
    date: "2025-09-29",
    duration: 90,
    exercises: [
      { name: "Squats", sets: 4, reps: 10 },
      { name: "Deadlift", sets: 4, reps: 8 }
    ], // list of exercises
    sleep: { hours: 8.1, wakeups: 0 },
    protein: 140,
    restfulness: "Excellent",
    notes: "Long session, great recovery."
  }, // end observation #5

  {
    date: "2025-09-30",
    duration: 0,
    exercises: ["No gym"], // list of exercises (rest day)
    sleep: { hours: 7.0, wakeups: 1 },
    protein: 116,
    restfulness: "Good",
    notes: "University day — focus on coursework."
  }, // end observation #6

  {
    date: "2025-10-01",
    duration: 85,
    exercises: [
      { name: "Leg Press", sets: 4, reps: 15 },
      { name: "Pull-ups", sets: 4, reps: 12 }
    ], // list of exercises
    sleep: { hours: 7.9, wakeups: 1 },
    protein: 138,
    restfulness: "Good",
    notes: "Smooth rhythm, stable mood."
  }, // end observation #7

  {
    date: "2025-10-02",
    duration: 0,
    exercises: ["No gym"], // list of exercises (rest day)
    sleep: { hours: 6.8, wakeups: 2 },
    protein: 110,
    restfulness: "Fair",
    notes: "Long campus hours; mild fatigue."
  }, // end observation #8

  {
    date: "2025-10-03",
    duration: 55,
    exercises: [
      { name: "Dips", sets: 3, reps: 12 },
      { name: "Lunges", sets: 3, reps: 12 }
    ], // list of exercises
    sleep: { hours: 6.4, wakeups: 2 },
    protein: 118,
    restfulness: "Fair",
    notes: "Slight soreness, woke up twice."
  }, // end observation #9

  {
    date: "2025-10-04",
    duration: 95,
    exercises: [
      { name: "Deadlift", sets: 5, reps: 8 },
      { name: "Bench Press", sets: 4, reps: 10 }
    ], // list of exercises
    sleep: { hours: 8.3, wakeups: 0 },
    protein: 148,
    restfulness: "Excellent",
    notes: "Peak performance, deep rest."
  }, // end observation #10

  {
    date: "2025-10-05",
    duration: 70,
    exercises: [
      { name: "Shoulder Press", sets: 3, reps: 10 },
      { name: "Rows", sets: 4, reps: 10 }
    ], // list of exercises
    sleep: { hours: 7.2, wakeups: 1 },
    protein: 130,
    restfulness: "Good",
    notes: "Good balance and sleep."
  }, // end observation #11

  {
    date: "2025-10-06",
    duration: 100,
    exercises: [
      { name: "Squats", sets: 5, reps: 8 },
      { name: "Deadlift", sets: 4, reps: 8 }
    ], // list of exercises
    sleep: { hours: 8.5, wakeups: 0 },
    protein: 150,
    restfulness: "Excellent",
    notes: "Very strong session, full recovery."
  }, // end observation #12

  {
    date: "2025-10-07",
    duration: 0,
    exercises: ["No gym"], // list of exercises (rest day)
    sleep: { hours: 7.0, wakeups: 2 },
    protein: 115,
    restfulness: "Fair",
    notes: "Busy university day, no workout."
  }, // end observation #13

  {
    date: "2025-10-08",
    duration: 85,
    exercises: [
      { name: "Leg Press", sets: 4, reps: 12 },
      { name: "Pull-ups", sets: 4, reps: 12 }
    ], // list of exercises
    sleep: { hours: 7.6, wakeups: 1 },
    protein: 136,
    restfulness: "Good",
    notes: "Recovered well, focused day."
  }, // end observation #14

  {
    date: "2025-10-09",
    duration: 0,
    exercises: ["No gym"], // list of exercises (rest day)
    sleep: { hours: 6.9, wakeups: 2 },
    protein: 112,
    restfulness: "Fair",
    notes: "College project work, mild stress."
  }, // end observation #15

  {
    date: "2025-10-10",
    duration: 95,
    exercises: [
      { name: "Deadlift", sets: 4, reps: 8 },
      { name: "Bench Press", sets: 4, reps: 10 }
    ], // list of exercises
    sleep: { hours: 8.4, wakeups: 0 },
    protein: 146,
    restfulness: "Excellent",
    notes: "Heavy session, great sleep."
  }, // end observation #16

  {
    date: "2025-10-11",
    duration: 65,
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10 },
      { name: "Rows", sets: 3, reps: 12 }
    ], // list of exercises
    sleep: { hours: 7.0, wakeups: 1 },
    protein: 126,
    restfulness: "Good",
    notes: "Consistent rhythm, decent rest."
  }, // end observation #17

  {
    date: "2025-10-12",
    duration: 80,
    exercises: [
      { name: "Leg Press", sets: 4, reps: 15 },
      { name: "Squats", sets: 4, reps: 10 }
    ], // list of exercises
    sleep: { hours: 7.8, wakeups: 1 },
    protein: 134,
    restfulness: "Good",
    notes: "Smooth training, relaxed mood."
  }, // end observation #18

  {
    date: "2025-10-13",
    duration: 50,
    exercises: [
      { name: "Dips", sets: 3, reps: 12 },
      { name: "Lunges", sets: 3, reps: 12 }
    ], // list of exercises
    sleep: { hours: 6.2, wakeups: 2 },
    protein: 112,
    restfulness: "Fair",
    notes: "Light effort, restless sleep."
  }, // end observation #19

  {
    date: "2025-10-14",
    duration: 0,
    exercises: ["No gym"], // list of exercises (rest day)
    sleep: { hours: 7.3, wakeups: 1 },
    protein: 118,
    restfulness: "Good",
    notes: "University classes, mental focus only."
  }, // end observation #20

  {
    date: "2025-10-15",
    duration: 85,
    exercises: [
      { name: "Squats", sets: 4, reps: 10 },
      { name: "Bench Press", sets: 3, reps: 12 }
    ], // list of exercises
    sleep: { hours: 7.9, wakeups: 1 },
    protein: 138,
    restfulness: "Good",
    notes: "Felt strong, slept easily."
  }, // end observation #21

  {
    date: "2025-10-16",
    duration: 0,
    exercises: ["No gym"], // list of exercises (rest day)
    sleep: { hours: 7.1, wakeups: 1 },
    protein: 117,
    restfulness: "Good",
    notes: "Long study day, skipped gym."
  }, // end observation #22

  {
    date: "2025-10-17",
    duration: 60,
    exercises: [
      { name: "Shoulder Press", sets: 3, reps: 10 },
      { name: "Lunges", sets: 3, reps: 12 }
    ], // list of exercises
    sleep: { hours: 6.9, wakeups: 2 },
    protein: 118,
    restfulness: "Fair",
    notes: "Tired but completed routine."
  }, // end observation #23

  {
    date: "2025-10-18",
    duration: 95,
    exercises: [
      { name: "Deadlift", sets: 4, reps: 8 },
      { name: "Bench Press", sets: 4, reps: 10 }
    ], // list of exercises
    sleep: { hours: 8.3, wakeups: 0 },
    protein: 149,
    restfulness: "Excellent",
    notes: "Excellent strength, deep sleep."
  }, // end observation #24

  {
    date: "2025-10-19",
    duration: 70,
    exercises: [
      { name: "Rows", sets: 4, reps: 10 },
      { name: "Leg Press", sets: 4, reps: 12 }
    ], // list of exercises
    sleep: { hours: 7.4, wakeups: 1 },
    protein: 132,
    restfulness: "Good",
    notes: "Steady rhythm, good focus."
  }, // end observation #25

  {
    date: "2025-10-20",
    duration: 100,
    exercises: [
      { name: "Squats", sets: 5, reps: 8 },
      { name: "Deadlift", sets: 4, reps: 8 }
    ], // list of exercises
    sleep: { hours: 8.5, wakeups: 0 },
    protein: 151,
    restfulness: "Excellent",
    notes: "Strongest day so far."
  }, // end observation #26

  {
    date: "2025-10-21",
    duration: 0,
    exercises: ["No gym"], // list of exercises (rest day)
    sleep: { hours: 7.3, wakeups: 1 },
    protein: 118,
    restfulness: "Good",
    notes: "University day; skipped workout."
  }, // end observation #27

  {
    date: "2025-10-22",
    duration: 80,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 10 },
      { name: "Leg Press", sets: 4, reps: 10 }
    ], // list of exercises
    sleep: { hours: 7.8, wakeups: 1 },
    protein: 135,
    restfulness: "Good",
    notes: "Good finish to cycle, relaxed."
  } // end observation #28
]; // end list workoutData

// console.log(JSON.stringify(workoutData)); // <-- keep commented for rubric

// Output: required to see data when instructor clicks your link
document.write("<pre>" + JSON.stringify(workoutData, null, 2) + "</pre>");
