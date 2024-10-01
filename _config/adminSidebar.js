import pages from 'src/setup/pages' // Get Pages from config

//Blog
export default [
  {
    title: 'ifly.cms.sidebar.flightInfo',
    icon: 'fa-light fa-plane',
    children: [
      pages.qfly.aircraftType,
      pages.qfly.airline,
      pages.qfly.airport,
      pages.qfly.flightSchedule,
      pages.qfly.flightScheduleLeg,
      pages.qfly.flightStatuses,
      //pages.qfly.map,
    ]
  },
  pages.qfly.searchflight,
]
