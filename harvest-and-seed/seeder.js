const fs = require('fs');
const path = require('path');
const betterSQLite = require('better-sqlite3');

// path to db
let dbPath = path.join(__dirname, '../', 'database', 'train-masters.sqlite3');

// remove db
fs.existsSync(dbPath) && fs.unlinkSync(dbPath);

// create db and connect to it
const db = betterSQLite(dbPath);

// create tables
fs.readFileSync(path.join(__dirname, 'create-tables.sql'), 'utf-8')
  .split(';')
  .slice(0, -1)
  .forEach(sql => db.prepare(sql).run());

// adder (helper for inserts)
function adder(table, data) {
  db.prepare(`
    INSERT INTO ${table} (${Object.keys(data)}) 
    VALUES (${Object.keys(data).map(x => ':' + x)})
  `).run(data);
}

// random integer
function random(min, max) {
  return Math.floor(Math.random() * (1 + max - min)) + min;
}

// add routes
let routes = require('./harvestedRoutes.json');
for (let route in routes) {
  adder('routes', { name: route });
  routes[route].forEach(data => adder('stops', { ...data, route }));
}

// add trains
let trains = {};
['Hera', 'Zeus', 'Athena', 'Poseidon'].forEach(name => {
  let data = {
    name,
    numberOfWagons: random(4, 8),
    seatsPerWagon: random(5, 7) * 4
  };
  trains[name] = data;
  adder('trains', data);
});

// add departures
// Let Hera and Zeus traffic Stockholm C - Göteborg C, < 5 h
// Let Athena traffic Göteborg C - Hyllie, < 4 h
// Let Poseidon traffic Helsingborg C - Trelleborg, < 2 h
let departures = [];
let routeNames = Object.keys(routes);
let days = 'mon,tues,wednes,thurs,fri,satur,sun'.split(',');
let info = {
  Hera: {
    time: 5,
    notDays: ['sunday'],
    routes: routeNames.slice(0, 2)
  },
  Zeus: {
    time: 5,
    notDays: [],
    routes: [...routeNames.slice(0, 2)].reverse()
  },
  Athena: {
    time: 4,
    notDays: ['sunday'],
    routes: routeNames.slice(2, 4)
  },
  Poseidon: {
    time: 2,
    notDays: ['saturday', 'sunday'],
    routes: routeNames.slice(4)
  }
};
for (let name in info) {
  let d = info[name];
  let dTime = 8 + random(0, 3);
  let roundTrips = Math.floor(24 / (d.time * 2));
  for (let i = 0; i < roundTrips * 2; i++) {
    let data = {
      train: name,
      route: d.routes[0],
      periodStart: '2022-01-01',
      periodEnd: '2025-01-01',
      departureTime: (dTime + '').padStart(2, '0') + ':00'
    };
    for (let day of days) {
      data[day + 'day'] = d.notDays.includes(day + 'day') ? 0 : 1;
    }
    d.routes.reverse();
    dTime += d.time;
    dTime >= 24 && (dTime -= 24);
    departures.push(data);
    adder('departures', data);
  }
}