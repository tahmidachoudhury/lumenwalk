import mapboxgl from "mapbox-gl"

export const fetchRoutes = async (
  map: mapboxgl.Map,
  from: string,
  to: string
) => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${from};${to}?geometries=geojson&alternatives=true&overview=full&access_token=${token}`

  const res = await fetch(url)
  const data = await res.json()

  const routes = data.routes

  routes.forEach((route: any, index: number) => {
    const id = `route-${index}`
    console.log(route)

    if (map.getSource(id)) {
      map.removeLayer(id)
      map.removeSource(id)
    }

    map.addSource(id, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: route.geometry,
      },
    })

    map.addLayer({
      id,
      type: "line",
      source: id,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": index === 0 ? "#22c55e" : "#a1a1aa",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    })
  })
}
