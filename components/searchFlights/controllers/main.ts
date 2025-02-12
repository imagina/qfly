import { computed, onMounted, onBeforeUnmount } from 'vue';
import { getFlightaware } from '../services/getFligth';
import store from '../store/searchFlights'
import { Flightaware, MainController, Search } from '../models/interfaces';
import { SEARCH_FIELDS } from '../models/defaultModels/constants';
import { routePush } from '../helpers/routePush';

export default function mainController(props: any): MainController {
    const upcomingFlights = computed<Flightaware[]>(() => store.flightList.filter(item => item.status.includes('Scheduled')))
    const routeFlight = computed<Flightaware[]>(() => store.flightList.filter(item => item.status.includes('Route')))
    const pastFlights = computed<Flightaware[]>(() => store.flightList.filter(item => !item.status.includes('Scheduled') && !item.status.includes('Route')))
    const flightList = computed<Flightaware[]>(() => store.flightList);
    const flight = computed<Flightaware | null>(() => store.selectedFligth);
    const loading = computed<boolean>(() => store.loading);
    const fields = computed<Search>(() => ({ ...SEARCH_FIELDS }))
    const validateFaFlightId = computed(() => {
        const workOrder = (flight.value as any).workOrder;
        const faFlightId = workOrder && props.workOrderData.type === 'inbound' 
        ? workOrder?.faFlightId 
        : workOrder?.outboundFaFlightId;
        if( workOrder && props.workOrderData && props.workOrderData.faFlightId) {
            return faFlightId == props.workOrderData.faFlightId
        }
        return false;
    });
    const methods = {
        getFlightaware,
        redirectWo: () => { routePush(flight.value) },
    }
    onMounted(async () => {
        if(!props.isSearch) {
            const flightNumber = props.workOrderData.flightNumber;
            store.search = flightNumber;
            await getFlightaware(props.workOrderData);
        }
    });
    onBeforeUnmount(() => {
        store.reset();
    })
    return {
        fields,
        methods,
        store,
        upcomingFlights,
        routeFlight,
        pastFlights,
        flight,
        loading,
        flightList,
        validateFaFlightId
    }
}
