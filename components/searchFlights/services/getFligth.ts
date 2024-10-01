import baseService from 'modules/qcrud/_services/baseService.js'
import searchFlightsStore from '../store/searchFlights';
import { alert } from 'src/plugins/utils'

export async function getFlightaware(workOrder: any = null): Promise<void> {
    try {
        searchFlightsStore.failRequest = false;
        if (searchFlightsStore.search.length === 0) {
            alert.warning('Please write the flight');
            reset();
            searchFlightsStore.failRequest = false;
            return
        };
        searchFlightsStore.loading = true;
        const params = {
            refresh: true,
            params: {
                filter: { search: searchFlightsStore.search.toUpperCase() }
            }
        }
        const response = await baseService.index('apiRoutes.qfly.flightaware', params);
        if (response.status === 204) {
            reset();
            searchFlightsStore.failRequest = true;
            searchFlightsStore.loading = false;
            return;
        }
        searchFlightsStore.flightList = response.data;
        setSelectedFligth(workOrder, response);
        await getAircraftType();
        await getAirlines();
        setTimeout(() => {
            searchFlightsStore.loading = false;
        }, 1000);
    } catch (error) {
        console.log(error);
        reset();
        searchFlightsStore.loading = false;
        searchFlightsStore.failRequest = false;
    }
}

export async function getAircraftType(): Promise<void> {
    const params = {}
    const response = await baseService.index('apiRoutes.qfly.aircraftTypes', params);
    searchFlightsStore.aircraftTypeList = response.data;
}

export async function getAirlines() {
    const params = {}
    const response = await baseService.index('apiRoutes.qfly.airlines', params);
    searchFlightsStore.airlinesList = response.data;
}

function reset(): void {
    searchFlightsStore.flightList = [];
    searchFlightsStore.selectedFligth = null;
}

function setSelectedFligth(workOrder, response) {
    if (!workOrder) {
        const route = response.data.find(item => item.status.includes('Route')) || (response.data.length > 1 ? response.data[1] : null) || response.data[0];
        searchFlightsStore.selectedFligth = route || null;
    } else {
        searchFlightsStore.selectedFligth = response.data.find(item => {
            const faFlightId = item.workOrder && workOrder.type === 'inbound' ? item.workOrder.faFlightId : item.workOrder?.outboundFaFlightId;
            if (item.workOrder && faFlightId) {
                return faFlightId == workOrder.faFlightId;
            }
            return item.status.includes('Route');
        }) || (response.data.length > 1 ? response.data[1] : null) || response.data[0];
    }
}
