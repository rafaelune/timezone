var moment = require('moment-timezone');


function appendTime(time, person) {
  person.time = moment( time ).tz( person.tz );
}

function sortByTimezone(a, b){
  return a.time.utcOffset() - b.time.utcOffset();
}

function sortByCity(a,b){
  return a.city.localeCompare(b.city);
}

module.exports = function transform(time, people) {

  // Append a moment date to each person
  people.forEach(appendTime.bind(people, time));
  people.sort(sortByCity);

  var timezones = people.reduce(function(zones, person){
    var last = zones[ zones.length - 1 ];
    var offset = last && last.people[0].city;

    if (last && offset === person.city) {
      last.people.push(person);
    } else {
      zones.push({
        tz: person.tz,
        people: [ person ]
      });
    }

    return zones;
  }, []);

  timezones.forEach(function(timezone){
    if (timezone.people.length / people.length > 0.2)
      timezone.major = true;
  });

  return timezones;
};