// Hypothesis: As workout duration increases, sleep hours and restfulness will improve.
// Data collected daily from 25-Sep-2025 to 22-Oct-2025

let workoutData = [
  {
    date: "2025-09-25",
    duration: 0,
    exercises: [], // no workout
    sleep: { hours: 7.0, wakeups: 1 },
    protein: 115,
    restfulness: 4, // Good
    notes: "University day — no workout."
  },
  {
    date: "2025-09-26",
    duration: 70,
    exercises: [
      { exercise: "Deadlift", sets: 3, reps: 8 },
      { exercise: "Pull-ups", sets: 3, reps: 10 }
    ],
    sleep: { hours: 7.0, wakeups: 1 },
    protein: 125,
    restfulness: 4, // Good
    notes: "Better focus, slept well."
  },
  {
    date: "2025-09-27",
    duration: 80,
    exercises: [
      { exercise: "Incline Press", sets: 4, reps: 10 },
      { exercise: "Leg Press", sets: 4, reps: 12 }
    ],
    sleep: { hours: 7.6, wakeups: 1 },
    protein: 130,
    restfulness: 4,
    notes: "Strong day, deep relaxation."
  },
  {
    date: "2025-09-28",
    duration: 50,
    exercises: [
      { exercise: "Shoulder Press", sets: 3, reps: 10 },
      { exercise: "Lunges", sets: 3, reps: 12 }
    ],
    sleep: { hours: 6.3, wakeups: 2 },
    protein: 115,
    restfulness: 3,
    notes: "Light workout, restless sleep."
  },
  {
    date: "2025-09-29",
    duration: 90,
    exercises: [
      { exercise: "Squats", sets: 4, reps: 10 },
      { exercise: "Deadlift", sets: 4, reps: 8 }
    ],
    sleep: { hours: 8.1, wakeups: 0 },
    protein: 140,
    restfulness: 5,
    notes: "Long session, refreshed in morning."
  },
  {
    date: "2025-09-30",
    duration: 0,
    exercises: [],
    sleep: { hours: 6.9, wakeups: 1 },
    protein: 110,
    restfulness: 3,
    notes: "University day — tired evening."
  },
  {
    date: "2025-10-01",
    duration: 0,
    exercises: [],
    sleep: { hours: 7.2, wakeups: 1 },
    protein: 112,
    restfulness: 4,
    notes: "Rest day; mentally tired from school."
  },
  {
    date: "2025-10-02",
    duration: 85,
    exercises: [
      { exercise: "Leg Press", sets: 4, reps: 15 },
      { exercise: "Pull-ups", sets: 4, reps: 12 }
    ],
    sleep: { hours: 7.9, wakeups: 1 },
    protein: 138,
    restfulness: 4,
    notes: "Solid effort and sleep."
  },
  {
    date: "2025-10-03",
    duration: 55,
    exercises: [
      { exercise: "Dips", sets: 3, reps: 12 },
      { exercise: "Lunges", sets: 3, reps: 12 }
    ],
    sleep: { hours: 6.4, wakeups: 2 },
    protein: 118,
    restfulness: 3,
    notes: "Slight soreness, woke up twice."
  },
  {
    date: "2025-10-04",
    duration: 95,
    exercises: [
      { exercise: "Deadlift", sets: 5, reps: 8 },
      { exercise: "Bench Press", sets: 4, reps: 10 }
    ],
    sleep: { hours: 8.3, wakeups: 0 },
    protein: 148,
    restfulness: 5,
    notes: "Peak performance day."
  },
  {
    date: "2025-10-05",
    duration: 70,
    exercises: [
      { exercise: "Shoulder Press", sets: 3, reps: 10 },
      { exercise: "Rows", sets: 4, reps: 10 }
    ],
    sleep: { hours: 7.2, wakeups: 1 },
    protein: 130,
    restfulness: 4,
    notes: "Kept a good balance."
  },
  {
    date: "2025-10-06",
    duration: 100,
    exercises: [
      { exercise: "Squats", sets: 5, reps: 8 },
      { exercise: "Deadlift", sets: 4, reps: 8 }
    ],
    sleep: { hours: 8.5, wakeups: 0 },
    protein: 150,
    restfulness: 5,
    notes: "Very strong session, best recovery."
  },
  {
    date: "2025-10-07",
    duration: 0,
    exercises: [],
    sleep: { hours: 7.0, wakeups: 2 },
    protein: 115,
    restfulness: 3,
    notes: "University day — mild fatigue."
  },
  {
    date: "2025-10-08",
    duration: 0,
    exercises: [],
    sleep: { hours: 7.4, wakeups: 1 },
    protein: 117,
    restfulness: 4,
    notes: "Rest day; recharged well."
  },
  {
    date: "2025-10-09",
    duration: 85,
    exercises: [
      { exercise: "Squats", sets: 4, reps: 10 },
      { exercise: "Bench Press", sets: 3, reps: 12 }
    ],
    sleep: { hours: 7.9, wakeups: 1 },
    protein: 138,
    restfulness: 4,
    notes: "Felt strong and recovered well."
  },
  {
    date: "2025-10-10",
    duration: 95,
    exercises: [
      { exercise: "Deadlift", sets: 4, reps: 8 },
      { exercise: "Pull-ups", sets: 4, reps: 12 }
    ],
    sleep: { hours: 8.4, wakeups: 0 },
    protein: 146,
    restfulness: 5,
    notes: "Amazing sleep after heavy day."
  },
  {
    date: "2025-10-11",
    duration: 65,
    exercises: [
      { exercise: "Bench Press", sets: 3, reps: 10 },
      { exercise: "Rows", sets: 3, reps: 12 }
    ],
    sleep: { hours: 7.0, wakeups: 1 },
    protein: 126,
    restfulness: 4,
    notes: "Consistent rhythm and decent rest."
  },
  {
    date: "2025-10-12",
    duration: 80,
    exercises: [
      { exercise: "Leg Press", sets: 4, reps: 15 },
      { exercise: "Squats", sets: 4, reps: 10 }
    ],
    sleep: { hours: 7.8, wakeups: 1 },
    protein: 134,
    restfulness: 4,
    notes: "Smooth training, easy recovery."
  },
  {
    date: "2025-10-13",
    duration: 50,
    exercises: [
      { exercise: "Dips", sets: 3, reps: 12 },
      { exercise: "Lunges", sets: 3, reps: 12 }
    ],
    sleep: { hours: 6.2, wakeups: 2 },
    protein: 112,
    restfulness: 3,
    notes: "Light effort, restless sleep."
  },
  {
    date: "2025-10-14",
    duration: 90,
    exercises: [
      { exercise: "Deadlift", sets: 4, reps: 8 },
      { exercise: "Bench Press", sets: 4, reps: 10 }
    ],
    sleep: { hours: 8.2, wakeups: 0 },
    protein: 144,
    restfulness: 5,
    notes: "Great end of training cycle."
  }
]; // end list workoutData

// document.write("<pre>" + JSON.stringify(workoutData, null, 2) + "</pre>");
document.write("<pre>" + JSON.stringify(workoutData, null, 2) + "</pre>"); // required to show data
