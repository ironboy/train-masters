CREATE TABLE trains (
  name TEXT PRIMARY KEY UNIQUE NOT NULL,
  numberOfWagons INTEGER NOT NULL,
  seatsPerWagon INTEGER NOT NULL
);

CREATE TABLE routes (
  name TEXT PRIMARY KEY UNIQUE NOT NULL
);

CREATE TABLE stops (
  route TEXT REFERENCES routes (name) NOT NULL,
  station TEXT NOT NULL,
  arrival INTEGER,
  departure INTEGER,
  platform TEXT NOT NULL
);

CREATE TABLE departures (
  train TEXT REFERENCES trains (name) NOT NULL,
  route TEXT REFERENCES routes (name) NOT NULL,
  periodStart DATE NOT NULL,
  periodEnd DATE NOT NULL,
  departureTime TIME NOT NULL,
  monday BOOLEAN NOT NULL,
  tuesday BOOLEAN NOT NULL,
  wednesday BOOLEAN NOT NULL,
  thursday BOOLEAN NOT NULL,
  friday BOOLEAN NOT NULL,
  saturday BOOLEAN NOT NULL,
  sunday BOOLEAN NOT NULL
);

CREATE TABLE bookings (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  email TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL
);

CREATE TABLE bookedSeats (
  bookingId REFERENCES bookings (id) NOT NULL,
  train REFERENCES trains (name) NOT NULL,
  wagon INTEGER NOT NULL,
  seat INTEGER NOT NULL,
  startTime DATETIME NOT NULL,
  endTime DATETIME NOT NULL
);