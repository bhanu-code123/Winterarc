export const DEFAULT_HABITS = [
  "Workout",
  "Diet (clean eating)",
  "Water (3L+)",
  "Reading / learning",
  "No junk food",
  "Meditation",
  "Social media (limited)",
  "Early sleep",
  "Morning routine",
  "Journal / reflect",
];

export const SLEEP_OPTIONS = [
  { label: "10+ hrs", hours: 10 },
  { label: "9 hrs", hours: 9 },
  { label: "8 hrs", hours: 8 },
  { label: "7 hrs", hours: 7 },
  { label: "6 hrs", hours: 6 },
  { label: "5 hrs", hours: 5 },
  { label: "4 hrs", hours: 4 },
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n) => String(n).padStart(2, "0");

export const monthKey = (y, m) => `${y}-${pad(m + 1)}`;
export const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

export function emptyMonth(habits) {
  return {
    habits: habits ? [...habits] : [...DEFAULT_HABITS],
    checks: {},
    sleep: {},
    goals: ["", "", "", "", ""],
    review: { well: "", hard: "", next: "" },
    notes: "",
  };
}
