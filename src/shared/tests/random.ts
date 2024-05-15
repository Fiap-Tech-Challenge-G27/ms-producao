import { v4 as uuidv4 } from "uuid";

function randomId(): string {
  return uuidv4();
}

function randomEntityDates() {
  const endDate = new Date("2025-01-01");
  const createdAt = randomDate(new Date("2020-01-01"), endDate);
  const updatedAt = randomBoolean() ? randomDate(createdAt, endDate) : null;

  return { createdAt, updatedAt };
}

function randomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

function randomBoolean(prop = 0.5): boolean {
  return Math.random() < prop;
}

function randomInt(min, max) {
  return Math.round(randomFloat(min, max))
}

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

export { randomId, randomEntityDates, randomInt, randomFloat };
