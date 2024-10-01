import Vue, {
    onMounted,
    onBeforeUnmount,
    ref,
    toRefs,
    computed
} from 'vue'
import {
    FlightDetail,
    FlightPosition,
    FlightFlifo,
    Airport,
    Icon,
    MarkerIcon,
    LabelProperties,
    Coordinate,
    CreateFlightMarkerProps,
    UpdateFlightMarkerProps,
} from '../models/interfaces'
import { Loader } from '@googlemaps/js-api-loader'
import {
    translateCoordinates,
    airport,
    saveFirehoseInformation,
    consumingFromFirehose,
    consumingFromFlightDetails
} from '../helpers'
import { WebSocketManager } from '../../../_plugins/webSocketManager'
import {
    ICON,
    MAP_TYPES,
    MESSAGE,
    FLIGHT_TYPE,
    ROUTE_WS,
    POLYGON_ATTRIBUTES,
    MAP_ATTRIBUTES,
    DEGREES,
    LABEL_PROPERTIES,
} from '../models/constants'
import { flightDetailModel } from '../models/defaultModels/flightDetailModel'
import { getFlights } from '../services/getFlightPosition.service'
import { getMapScreenshot } from '../services/getMapScreenshot.service'
import { store } from 'src/plugins/utils'

export const flightMapController = (props: any) => {
    const mapRef = ref<Element | null>(null)
    const airportOriginSvg = require('../assets/icon/originAirport.svg');
    const airportDestinationSvg = require('../assets/icon/destinationAirport.svg')
    let map: google.maps.Map | undefined;
    const {
        flightDetails,
        faFlightId: flightId,
        mapType,
        workOrderId
    } = toRefs(props)
    const completedFlights = new Set()
    const activeFlights = new Map()
    const webSocketManager = new WebSocketManager()
    const apiKey = store.getSetting('isite::api-maps')
    const flightPositionList = ref<FlightPosition[]>([])
    const flightFlifoList = ref<FlightFlifo[]>([])
    const flightPositionData = ref<FlightDetail>(flightDetailModel)
    const mapScreenshot = ref()
    const loading = ref(true)
    const flight = ref()
    const count = ref(0)
    const error = ref<Error | null | unknown>(null)
    const isPolyline = ref<boolean>(false)
    const isActive = computed(() => {
        return flight.value?.type === FLIGHT_TYPE.position &&
            !completedFlights.has(flight.value?.id)
    })
    const isCanceled = computed(() => {
        return flight.value?.type === FLIGHT_TYPE.cancellation ||
            flight.value?.actual_on ||
            flight.value?.actual_in ||
            flight.value?.aat
    })

    async function initMap(): Promise<void> {
        if (map) return

        try {
            const { Map } = await google.maps.importLibrary("maps");

            const loader = new Loader({
                apiKey: apiKey,
                version: "weekly",
            });

            await loader.load().then(() => {
                if (mapRef.value) {
                    map = new Map(mapRef.value, {
                        ...MAP_ATTRIBUTES,
                        mapTypeId: google.maps.MapTypeId.TERRAIN,
                    })
                }
            })
        } catch (err) {
            loading.value = false
            error.value = err
            console.error(err)
        }
    }

    const establishWebSocketConnection = () => {
        const socket = webSocketManager.connect(ROUTE_WS)

        webSocketManager.addEventListener('open', () => {
            if (!socket) return
            socket.send(JSON.stringify(MESSAGE) + '')
            socket.send(JSON.stringify(MESSAGE) + '')
        })
    }

    const addListener = (
        marker: google.maps.Marker,
        contentPopover: string | undefined | null
    ): void => {
        if (!contentPopover || !map) return

        try {
            const infoWindow = new google.maps.InfoWindow({
                content: `<p>${contentPopover}</p>`,
            })

            marker.addListener("mouseover", () => {
                infoWindow.open(map, marker)
            })

            marker.addListener("mouseout", () => {
                infoWindow.close()
            })

            if (!flightId.value) {
                marker.addListener("click", () => {
                    //TODO
                    // Abrir modal
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const paintMarker = async (
        rotation:number = 0,
        coordinates: (number | null)[],
        contentPopover?: string | null | undefined,
        label?: string | null | undefined,
        url?:string ,
        optionsIcon:Icon = {},
    ) => {

        const iconUrl = {
            url,
            labelOrigin: new google.maps.Point(40, 15),
        }

        const icon: MarkerIcon | any = {
            ...ICON,
            anchor: new google.maps.Point(15, 15),
            rotation,
            ...optionsIcon,
        }

        const labelProperties: LabelProperties = {
            ...LABEL_PROPERTIES,
            text: label || '',
        }

        if (!coordinates[0] || !coordinates[1]) return null

        try {
            const marker = new google.maps.Marker({
                position: {
                    lat: Number(coordinates[0]),
                    lng: Number(coordinates[1]),
                },
                map,
                icon: url ? iconUrl : icon,
                label: label ? labelProperties : '',
                zIndex: url ? 1 : 2,
            })

            addListener(marker, contentPopover)

            return marker
        } catch (err) {
            console.error(err)
        }
    }

    const cleanMarkers = () => {
        try {
            for (const marker of activeFlights.values() as any) {
                marker.setMap(null);
            }
        } catch (err) {
            console.error(err)
        }
    }

    const createFlightMarker = ({
        id,
        rotation,
        flightCoordinates: coordinates,
        aircraftType
    }: CreateFlightMarkerProps) => {
        try {
            const marker = paintMarker(rotation, coordinates, aircraftType)
            if (!marker) return
            activeFlights.set(id, marker)
            if (coordinates && flightId.value) {
                zoomAndFocusMap(coordinates[0], coordinates[1], 5)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const updateFlightMarker = ({
        id,
        rotation,
        flightCoordinates: coordinates,
    }: UpdateFlightMarkerProps) => {
        if (!id || !rotation || !coordinates[0] || !coordinates[1]) return

        try {
            const flight = activeFlights.get(id)
            const newPosition = new google.maps.LatLng(
                coordinates[0],
                coordinates[1]
            )
            if (newPosition) {
                flight.setPosition(newPosition)
                flight.setIcon({
                    ...flight.getIcon(),
                    rotation
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleActiveFlightMarker = (
        { id, lat, lon, heading, aircrafttype }:
        {
            id: string,
            lat: number,
            lon: number,
            heading: number,
            aircrafttype: string
        }
    ) => {
        if (!id && !lat && !lon && !heading && !aircrafttype) return
        const coordinates = [
            lat,
            lon,
        ]

        markPlanePosition(heading, coordinates, aircrafttype, id)
    }

    const plotMultipleMarkers = (flightData) => {
        const id = flightData?.id
        flight.value = flightData

        if (isActive.value) {
            handleActiveFlightMarker(flightData)
        }

        if (isCanceled.value) {
            try {
                completedFlights.add(id)
                if (activeFlights.has(id)) {
                    const marker = activeFlights.get(id)
                    marker.setMap(null)
                    activeFlights.delete(id)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    const zoomAndFocusMap = (
        lat: number | null,
        lon: number | null,
        zoomLevel: number
    ) => {
        try {
            if (!lat || !lon) return
            const center = new google.maps.LatLng(lat, lon);
            if (map) {
                map.setZoom(zoomLevel);
                map.setCenter(center);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const markRoute = (flightPlanCoordinates: Coordinate[] | number[][]) => {
        if (isPolyline.value) return

        try {
            if (flightPlanCoordinates?.length > 0) {
                const wayPoints: any = translateCoordinates(flightPlanCoordinates)
                const flightPath = new google.maps.Polyline({
                    ...POLYGON_ATTRIBUTES,
                    path: wayPoints,
                });
                isPolyline.value = true
                if (map) flightPath.setMap(map);
            }
        } catch (err) {
            console.error(err)
        }
    }

    const searchFirehoseData = (id: string): [
        FlightPosition | undefined,
        FlightFlifo | undefined
    ] => {
        const thereIsFlight = (flight: FlightPosition | FlightFlifo) => flight?.id === id;
        const positionTypeFlight = flightPositionList.value?.find(thereIsFlight);
        const flifoTypeFlight = flightFlifoList.value?.find(thereIsFlight);

        return [
            positionTypeFlight,
            flifoTypeFlight
        ];
    }

    const consumingFromFlightPosition = async (): Promise<FlightDetail> => {
        count.value = count.value + 1
        if (count.value > 1) return flightPositionData.value

        try {
            const response = await getFlights(workOrderId.value)
            const data = response.data

            const flightPosition = data?.flightPosition

            const lat = flightPosition?.lastPositionLatitude
                ? Number(flightPosition?.lastPositionLatitude)
                : null
            const lon = flightPosition?.lastPositionLongitude
                ? Number(flightPosition?.lastPositionLongitude)
                : null

            const heading = flightPosition?.lastPositionHeading
            const wayPoints = flightPosition?.waypoints
            const {
                origin: originAirport,
                destination: destinationAirport
            } = airport(data)

            const flightData = {
                originAirport,
                destinationAirport,
                aircraftType: data?.aircraftType,
                heading,
                wayPoints,
                flightCoordinates: [lat, lon]
            }
            flightPositionData.value = flightData

            return flightData
        } catch (err) {
            console.error(err)
            return flightDetailModel
        }
    }

    const getFlightDetail = async (): Promise<FlightDetail> => {
        if (flightId.value || workOrderId.value) {
            const [positionTypeFlight, flifoTypeFlight] = searchFirehoseData(flightId.value);

            const flightFoundInFirehose = positionTypeFlight || flifoTypeFlight

            if (flightFoundInFirehose) {
                return consumingFromFirehose(
                    positionTypeFlight,
                    flifoTypeFlight,
                    flightDetails.value
                )
            }

            if (!flightFoundInFirehose) {
                return consumingFromFlightPosition()
            }
        }

        if (flightDetails.value) {
            return consumingFromFlightDetails(flightDetails.value)
        }

        return flightDetailModel
    }

    const focusMapOnMarkers = (
        pointOne: (number | null)[],
        pointTwo: (number | null)[]
    ) => {
        if (!pointOne[0] || !pointOne[1] || !pointTwo[0] || !pointTwo[1]) return

        try {
            const locationOne = new google.maps.LatLng(
                pointOne[0],
                pointOne[1]
            )
            const locationTwo = new google.maps.LatLng(
                pointTwo[0],
                pointTwo[1]
            )

            const bounds = new google.maps.LatLngBounds()

            bounds.extend(locationOne)
            bounds.extend(locationTwo)

            if (map) map.fitBounds(bounds)

        } catch (err) {
            console.error(err)
        }
    }

    const markAirports = (origin: Airport, destination: Airport) => {
        const originAirportMarker = paintMarker(
            0,
            origin.coordinate,
            origin.title,
            origin.code,
            airportOriginSvg
        )
        const destinationAirportMarker = paintMarker(
            0,
            destination.coordinate,
            destination.title,
            destination.code,
            airportDestinationSvg
        )
        activeFlights.set('origin', originAirportMarker)
        activeFlights.set('destination', destinationAirportMarker)

        focusMapOnMarkers(origin.coordinate, destination.coordinate)
    }

    const markPlanePosition = async (
        heading: number | null = 0,
        flightCoordinates: (number | null)[],
        aircraftType: string,
        id?: string
    ) => {

        if (!heading && !flightCoordinates) return
        const rotation = heading ? heading % DEGREES : 0

        const data: CreateFlightMarkerProps = {
            id: id || aircraftType,
            rotation,
            flightCoordinates,
        }

        if (!activeFlights.has(id)) {
            createFlightMarker({...data , aircraftType })
        } else {
            updateFlightMarker({ ...data })
        }
    }

    const listenToMessages = () => {
        webSocketManager.addEventListener('message', async function (event) {
            if (!event) return
            const response = event?.data.slice(0, -1)
            const data = JSON.parse(response)
            const flight = data?.arguments?.[0]

            console.log('firehose', flight)

            flightPositionList.value = saveFirehoseInformation<FlightPosition>(
                FLIGHT_TYPE.position,
                flightPositionList.value,
                flight
            )
            flightFlifoList.value = saveFirehoseInformation<FlightFlifo>(
                FLIGHT_TYPE.flifo,
                flightFlifoList.value,
                flight
            )

            const {
                heading,
                aircraftType,
                flightCoordinates,
                wayPoints
            } = await getFlightDetail()

            if (flightId.value || flightDetails.value || workOrderId.value) {
                markRoute(wayPoints)
                markPlanePosition(
                    heading,
                    flightCoordinates,
                    aircraftType,
                    flightId.value
                )
                return
            }

            plotMultipleMarkers(flight)
        })
    }

    const caseOne = async () => {
        const {
            originAirport,
            destinationAirport,
        } = await getFlightDetail()

        establishWebSocketConnection()
        markAirports(originAirport, destinationAirport)
        listenToMessages()
    }

    const caseTwo = async () => {
        const {
            heading,
            aircraftType,
            flightCoordinates,
            wayPoints,
            originAirport,
            destinationAirport,
        } = await getFlightDetail()

        markAirports(originAirport, destinationAirport)
        markRoute(wayPoints)
        markPlanePosition(heading, flightCoordinates, aircraftType)
    }

    const caseThree = async () => {
        const response = await getMapScreenshot(flightId.value)
        mapScreenshot.value = response?.data.map
    }

    const flightMapTypeHandling = async () => {
        cleanMarkers()

        if (
            flightId.value &&
            mapType.value === MAP_TYPES.google &&
            workOrderId.value
        ) {
            await caseOne()
            return
        }

        if (
            flightDetails.value &&
            mapType.value === MAP_TYPES.google &&
            !flightId.value && !workOrderId.value
        ) {
            await caseTwo()
            return
        }

        if (flightId.value && mapType.value === MAP_TYPES.flightaware) {
            await caseThree()
            return
        }

        establishWebSocketConnection()
        listenToMessages()
    }

    onBeforeUnmount(() => {
        isPolyline.value = false
        webSocketManager.close()
    })

    onMounted(async () => {
        await initMap()
        await flightMapTypeHandling()
        isPolyline.value = false
        loading.value = false
    })

    return {
        mapRef,
        mapScreenshot,
        loading,
        error
    }
}
