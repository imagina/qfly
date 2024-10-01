import baseService from 'modules/qcrud/_services/baseService.js'

export const getFlights = async (workOrderId) => {
  const API_ROUTES = 'apiRoutes.qramp.flightPosition'
  try {
    const params = {
      refresh: true,
      params: {
          filter: {
            id: 0
          }
      }
    };
    if(workOrderId) params.params.filter.id = workOrderId;
    const response = await baseService.index(API_ROUTES, params);
    return response;
  } catch (error) {
    console.log(error)
  }
}
