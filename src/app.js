const mercury = require('mercury')
const h = mercury.h
const mapbox = require('mapbox-gl')
const AppendHook = require('append-hook')
const assign = require('xtend/mutable')
const users = require('./users')()

mapbox.accessToken = 'pk.eyJ1IjoiYnJpYW5zaGFsZXIiLCJhIjoiY2lnYml5OWZlMG1pa3U1bHlxbGFrZXB3MCJ9.j-aTJBjdHQMV4wa0RXuV3Q'

function App () {
  return mercury.state({
    hooks: {
      load
    }
  })
}

function load (el) {
  console.log(mapbox)
  const map = new mapbox.Map({
    container: el,
    style: 'mapbox://styles/brianshaler/cipda6wxq002ibbnp183ypr8u',
    center: [ -122.432973, 37.762868],
    zoom: 11
  })

  map.on('load', () => {
    map.addControl(new mapbox.Navigation())
    const people = map.addSource('people', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: users
      },
      cluster: true,
      clusterMaxZoom: 12,
      clusterRadius: 200
    })
    const peopleLayer = map.addLayer({
      id: 'unclustered-points',
      type: 'symbol',
      source: 'people',
      layout: {
        'icon-image': 'marker-15'
      }
    })

    // Display the earthquake data in three layers, each filtered to a range of
    // count values. Each range gets a different fill color.
    var layers = [
      [0, '#5365fc'],
      // [20, '#f1f075']
    ]

    layers.forEach((layer, i) => {
      map.addLayer({
        id: 'cluster-' + i,
        type: 'circle',
        source: 'people',
        paint: {
          'circle-color': layer[1],
          'circle-radius': 18
        },
        filter:
          ['>=', 'point_count', layer[0]]
      })
    })


    // Add a layer for the clusters' count labels
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'people',
      paint: {
        'text-color': '#fff'
      },
      layout: {
        'text-field': '{point_count}',
        'text-font': [
          'DIN Offc Pro Medium',
          'Arial Unicode MS Bold'
        ],
        'text-size': 12
      }
    })

    console.log(peopleLayer)
    users.forEach((user) => {
      const el = document.createElement('div')
      el.className = 'marker'
      assign(el.style, {
        backgroundImage: `url(${user.image})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        border: '1px solid red',
        width: '50px',
        height: '50px',
        borderRadius: '50%'
      })
      new mapbox.Marker(el, {
        offset: [-25, -50]
      })
        .setLngLat(user.geometry.coordinates)
        .addTo(map)
    })

    // map.on('click', (e) => {
    //   const features = map.queryRenderedFeatures(e.point, { layers: ['cluster-count'] })
    //   if (features.length) {
    //     map.flyTo({center: features[0].geometry.coordinates})
    //   }
    // })
  })
}

App.render = function render (state) {
  return h('map', {
    'map-module-load': AppendHook(state.hooks.load),
    style: {
      position: 'fixed',
      top: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      background: '#0e0d16'
    }
  })
}


mercury.app(document.body, App(), App.render)
