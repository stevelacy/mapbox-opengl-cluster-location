const uuid = require('node-uuid')

module.exports = function () {
  const users = []

  const center = {
    lat: -122.432973,
    long: 37.762868
  }
  for (let i = 0; i < 50; i++) {
    users.push({
      type: 'Feature',
      image: 'https://placekitten.com/g/' + Math.floor(Math.random() * 100),
      properties: {
        id: uuid.v1(),
        image: 'https://placekitten.com/g/' + Math.floor(Math.random() * 100),
        iconSize: [100, 100]
      },
      geometry: {
        id: Math.random(),
        type: 'Point',
        coordinates: [
          center.lat + (Math.random() * -.05 * -1), center.long + (Math.random() * -.05 * -1)
        ]
      }
    })
  }
  return users
}
