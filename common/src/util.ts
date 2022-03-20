// utility functions for generating random data
const FIRST_NAMES = [
  "Jermaine",
  "Caylee",
  "Malia",
  "Jovan",
  "Damon",
  "Douglas",
  "Austin",
  "Christopher",
  "Joselyn",
  "Kyle",
  "Abigail",
  "Amari",
  "Issac",
  "Lea",
  "Branson",
  "Daniela",
  "Phillip",
  "Alani",
  "Kathryn",
  "Sergio",
];

const LAST_NAMES = [
  "Webster",
  "Ramsey",
  "Lester",
  "Zhang",
  "Hendrix",
  "Osborn",
  "Ball",
  "Santana",
  "Santiago",
  "Potter",
  "Mcdonald",
  "Whitaker",
];

export function randomName() {
  const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${fn} ${ln}`;
}

export function randomTel() {
  const n1 = Math.floor(Math.random() * 1000).toString();
  const n2 = Math.floor(Math.random() * 10000).toString();
  return `9${n1.padStart(3, "0")} ${n2.padStart(4, "0")}`;
}

export function createRandomReservation(sn: number, dt?: Date) {
  return {
    sn,
    name: randomName(),
    phone: randomTel(),
    ...(dt ? { date: dt } : {}),
  };
}
