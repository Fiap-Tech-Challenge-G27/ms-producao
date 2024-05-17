import * as crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

function randomId(): string {
  return uuidv4();
}

function randomEntityDates(
  startDate = new Date("2020-01-01"),
  endDate = new Date("2025-01-01")
) {
  const createdAt = randomDate(startDate, endDate);
  const updatedAt = randomBoolean() ? randomDate(createdAt, endDate) : null;

  return { createdAt, updatedAt };
}

function randomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + random() * (toTime - fromTime));
}

function randomBoolean(prop = 0.5): boolean {
  return random() < prop;
}

function randomInt(min, max) {
  return Math.round(randomFloat(min, max));
}

function randomFloat(min, max) {
  return min + random() * (max - min);
}

function random() {
  return crypto.getRandomValues(new Uint32Array(1))[0]/2**32;
}

export { randomEntityDates, randomFloat, randomId, randomInt };

