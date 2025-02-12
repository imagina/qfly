import baseService from 'modules/qcrud/_services/baseService.js'

export const getMapScreenshot = async (id: string) => {
  const API_ROUTES = 'apiRoutes.qfly.flightsFlightawareMap'
  try {
    const response = await baseService.get(API_ROUTES, { refresh: true }, { id })
    return response
  } catch (error) {
    console.log(error)
  }
}
