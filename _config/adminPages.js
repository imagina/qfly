export default {
  aircraftType: {
    permission: 'iflight.aircrafttype.manage',
    activated: true,
    authenticated: true,
    path: '/fly/aircraftType/index',
    name: 'qfly.admin.aircraftType',
    crud: import('modules/qfly/_crud/aircraftType'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.aircraftType',
    icon: 'fa-light fa-plane',
    subHeader: {
      refresh: true,
    }
  },
  airline: {
    permission: 'iflight.airline.manage',
    activated: true,
    authenticated: true,
    path: '/fly/airline/index',
    name: 'qfly.admin.airline',
    crud: import('modules/qfly/_crud/airline'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.airline',
    icon: 'fal fa-luggage-cart',
    subHeader: {
      refresh: true,
    }
  },
  airport: {
    permission: 'iflight.airport.manage',
    activated: true,
    authenticated: true,
    path: '/fly/airport/index',
    name: 'qfly.admin.airport',
    crud: import('modules/qfly/_crud/airport'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.airport',
    icon: 'fal fa-city',
    subHeader: {
      refresh: true,
    }
  },
  flightSchedule: {
    permission: 'iflight.flightSchedule.manage',
    activated: true,
    authenticated: true,
    path: '/fly/flightSchedule/index',
    name: 'qfly.admin.flightSchedule',
    crud: import('modules/qfly/_crud/flightSchedule'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.flightSchedule',
    icon: 'fas fa-clock',
    subHeader: {
      refresh: true,
    }
  },
  flightScheduleLeg: {
    permission: 'iflight.flightScheduleLeg.manage',
    activated: true,
    authenticated: true,
    path: '/fly/flightScheduleLeg/index',
    name: 'qfly.admin.flightScheduleLeg',
    crud: import('modules/qfly/_crud/flightScheduleLeg'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.flightScheduleLeg',
    icon: 'fas fa-braille',
    subHeader: {
      refresh: true,
    }
  },
  flightStatuses: {
    permission: 'iflight.flight-statuses.manage',
    activated: true,
    authenticated: true,
    path: '/fly/flight-statuses/index',
    name: 'qfly.admin.flightStatus',
    crud: import('modules/qfly/_crud/flightStatus'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.flightStatuses',
    icon: 'fas fa-braille',
    subHeader: {
      refresh: true,
    }
  },
  searchflight: {
    //permission: 'iflight.flight-statuses.manage',
    activated: true,
    authenticated: true,
    path: '/fly/search-flight/index',
    name: 'qfly.admin.searchFlight',
    crud: import('modules/qfly/components/searchFlights/components/index.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'ifly.cms.sidebar.flightsTracker',
    icon: 'fa-thin fa-magnifying-glass-location',
    subHeader: {
      refresh: true,
    }
  },
  map: {
    //permission: 'iflight.flight-statuses.manage',
    activated: true,
    authenticated: true,
    path: '/fly/map',
    name: 'qfly.admin.map',
    crud: import('modules/qfly/components/flightMap/components/flightMap.vue'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'Map',
    icon: 'fa-solid fa-map',
    subHeader: {
      refresh: true,
    }
  }
}

