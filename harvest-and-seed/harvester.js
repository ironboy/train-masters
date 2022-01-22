// harvest route info from trafikverket pages
// pages like 'https://www.trafikverket.se/trafikinformation/tag/?Train=175'
// (run this code in the console)
let stations = $('tr[id^="stationLink"]');
let allInfo = [];
stations.each(function (i) {
  let t = $(this).text().split('\n').map(x => x.trim()).filter(x => x).slice(1, -1);
  let info = {
    station: t.shift(),
    arrival: t.shift(),
    platform: t.reverse().shift(),
    departure: t.shift()
  };
  i === 0 && (delete info.arrival);
  i === stations.length - 1 && (delete info.departure);
  allInfo.push(info);
});
// console.log(allInfo);

// convert arrival and departure times to minute offsets
let dTime0;
let allInfoProcessed = allInfo.map(({ station, arrival, departure, platform }, i) => {
  dTime0 = dTime0 || new Date('2020-01-01 ' + departure);
  arrival = (new Date('2020-01-01 ' + arrival) - dTime0) / 1000 / 60;
  departure = (new Date('2020-01-01 ' + departure) - dTime0) / 1000 / 60;
  station = station && station.split('Central').join('C');
  return { station, arrival, departure, platform }
});
console.log(JSON.stringify(allInfoProcessed, '', '  '))

