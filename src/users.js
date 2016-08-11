module.exports = function () {
  const users = []

  const center = {
    lat: -122.432973,
    long: 37.762868
  }
  for (let i = 0; i < 1000; i++) {
    users.push({
      type: 'Feature',
      image: 'https://placekitten.com/g/' + Math.floor(Math.random() * 100),
      properties: {
        message: 'test',
        iconSize: [100, 100]
      },
      geometry: {
        type: 'Point',
        coordinates: [
          center.lat + Math.random() * 2 - 1, center.long + Math.random() * 2 - 1
        ]
      }
    })
  }
  return users
}
