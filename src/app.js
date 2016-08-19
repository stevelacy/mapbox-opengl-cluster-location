const mercury = require('mercury')
const h = mercury.h
const mapboxgl = require('mapbox-gl')
const AppendHook = require('append-hook')
const assign = require('xtend/mutable')
const users = require('./users')()


mapboxgl.accessToken = 'pk.eyJ1IjoiYnJpYW5zaGFsZXIiLCJhIjoiY2lnYml5OWZlMG1pa3U1bHlxbGFrZXB3MCJ9.j-aTJBjdHQMV4wa0RXuV3Q'

function App () {
  const state = mercury.state({
    users,
    hooks: {
      load
    }
  })
  return state

  function load (el) {
    const map = new mapboxgl.Map({
      container: el,
      style: 'mapbox://styles/brianshaler/cipda6wxq002ibbnp183ypr8u',
      center: [ -122.432973, 37.762868],
      zoom: 14,
      attributionControl: false
    })

    map.on('load', () => {
      map.addControl(new mapboxgl.Navigation({
        position: 'bottom-right'
      }))
      const people = map.addSource('people', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: users
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 200
      })

      const peopleLayer = map.addLayer({
        id: 'people-layer',
        type: 'symbol',
        source: 'people',
        layout: {
          'icon-image': 'marker-15',
          'icon-size': 2
        },
        paint: {
          'icon-color': '#5b25f6'
        }
      })

      map.addLayer({
        id: 'cluster-circle',
        type: 'circle',
        source: 'people',
        paint: {
          'circle-color': '#5365fc',
          'circle-radius': 18
        },
        filter:
          ['>=', 'point_count', 0]
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

      map.on('click', (e) => {
        const clusters = map.queryRenderedFeatures(e.point, { layers: ['cluster-circle'] })
        const user = map.queryRenderedFeatures(e.point, { layers: ['people-layer'] })
        if (clusters.length) {

          map.flyTo({
            zoom: map.getZoom() + 1,
            center: clusters[0].geometry.coordinates
          })
        }
        if (user.length) {
          console.log(user[0].properties.id)
        }
      })
    })
  }
}

App.render = function render (state) {
  const theme = {
    bg: 'blue'
  }
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
  }, [
    h('style', {
      type: 'text/css'
    },
    `
    .mapboxgl-marker {
      cursor: pointer
    }
    .mapboxgl-ctrl-compass {
        display: none !important;
    }
    .mapboxgl-ctrl-group > button {
      border-bottom: 1px solid rgba(100, 100, 100, .4)
    }
    .mapboxgl-ctrl-group.mapboxgl-ctrl {
      background-color: rgba(84, 101, 252, 0.2) !important;
      color: rgba(84, 101, 252, 0.9) !important;
    }
    .mapboxgl-ctrl-icon.mapboxgl-ctrl-zoom-in {
      background-image: url("data:image/svg+xml;charset=utf8,<svg%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27>%0A%20%20<path%20style%3D%27fill%3A%23ffffff%3B%27%20d%3D%27M%2010%206%20C%209.446%206%209%206.4459904%209%207%20L%209%209%20L%207%209%20C%206.446%209%206%209.446%206%2010%20C%206%2010.554%206.446%2011%207%2011%20L%209%2011%20L%209%2013%20C%209%2013.55401%209.446%2014%2010%2014%20C%2010.554%2014%2011%2013.55401%2011%2013%20L%2011%2011%20L%2013%2011%20C%2013.554%2011%2014%2010.554%2014%2010%20C%2014%209.446%2013.554%209%2013%209%20L%2011%209%20L%2011%207%20C%2011%206.4459904%2010.554%206%2010%206%20z%27%20%2F>%0A<%2Fsvg>%0A")
    }
    .mapboxgl-ctrl-icon.mapboxgl-ctrl-zoom-out {
      background-image: url("data:image/svg+xml;charset=utf8,<svg%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27>%0A%20%20<path%20style%3D%27fill%3A%23ffffff%3B%27%20d%3D%27m%207%2C9%20c%20-0.554%2C0%20-1%2C0.446%20-1%2C1%200%2C0.554%200.446%2C1%201%2C1%20l%206%2C0%20c%200.554%2C0%201%2C-0.446%201%2C-1%200%2C-0.554%20-0.446%2C-1%20-1%2C-1%20z%27%20%2F>%0A<%2Fsvg>%0A")
    }
    .leaflet-bar {
      border: solid 1px rgba(84, 101, 252, 0.9) !important
    }
    .leaflet-bar a {
      border-bottom: solid 1px rgba(84, 101, 252, 0.9) !important
    }
    .leaflet-bar a:last-child {
      border-bottom: none !important
    }
    `)
  ])
}


mercury.app(document.body, App(), App.render)
