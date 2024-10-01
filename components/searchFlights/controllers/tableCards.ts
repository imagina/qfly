import { computed, ref } from 'vue';
import momentTimezone from "moment-timezone";
import minutesToHours from '../helpers/minutesToHours'
import { TableCardsController, TableCardsControllerProps, TableColumn } from '../models/interfaces';
import { routePush } from '../helpers/routePush';

export default function tableCardsController(props: TableCardsControllerProps): TableCardsController {
    const dateNotFound = 'Date not found';
    const showWorkOrderColumn = computed(() => props.showWorkOrderColumn);

    const columns = ref<TableColumn[]>([
        {
            name: 'date',
            label: 'Date',
            align: 'left',
            field: row => row,
            format: val => {
                let format;
                if (val.status.includes('Scheduled')) {
                    format = val.scheduledOut;
                }
                if (val.status.includes('Route')) {
                    format = val.actualOut || val.estimatedOut || val.scheduledOut;
                }
                if (val.status.includes('Arrived')) {
                    format = val.actualOut;
                }
                return momentTimezone(format).tz(val.originAirport.timezone).format('dddd DD-MMM-YYYY') || dateNotFound
            },
            required: true,
        },
        {
            name: 'Departure',
            align: 'left',
            label: 'Departure',
            field: row => row,
            format: val => {
                const route = val.actualOut || val.estimatedOut || val.scheduledOut;
                return dateTimezone(
                    val.status,
                    val.scheduledOut,
                    route,
                    val.actualOut,
                    val.originAirport
                );
            },
            required: true,
        },
        {
            name: 'arrival',
            label: 'Arrival',
            field: row => row,
            format: val => {
                const route = val.actualIn || val.estimatedIn || val.scheduledIn;
                return dateTimezone(
                    val.status,
                    val.scheduledIn,
                    route,
                    val.actualIn,
                    val.destinationAirport
                );
            },
            required: true,
        },
        {
            name: 'workOrder',
            label: 'Work Order',
            field: 'workOrderField',
            required: showWorkOrderColumn.value,
        },
        {
            name: 'aircraft',
            label: 'Aircraft',
            field: 'aircraftType',
            required: true,
        },
        {
            name: 'duration',
            label: 'Duration',
            field: 'timeTotalEstimated',
            format: val => minutesToHours(val || 0),
            required: true,
        },
    ])
    const title = computed<string>(() => props.title);
    const dataTable = computed(() => props.dataTable);
    function dateTimezone(
        status: string,
        sheduled: string,
        route: string,
        arrival: string,
        airport: any) {
        let hour = '';
        let timeToFormat;
        const timezone = momentTimezone.tz(airport.timezone).format("z");
        if (status.includes('Scheduled')) {
            timeToFormat = sheduled
        }
        if (status.includes('Route')) {
            timeToFormat = route
        }
        if (status.includes('Arrived')) {
            timeToFormat = arrival
        }
        const dateMoment = momentTimezone(timeToFormat).tz(airport.timezone)
        hour = dateMoment.isValid() ? dateMoment.format("hh:mm A") : dateNotFound;
        return `${hour} ${timezone} <br> ${airport.airportName} - ${airport.airportCode}`
    }

    function redirect(row) {
        routePush(row)
    }

    return { columns, title, dataTable, minutesToHours, redirect }
}
