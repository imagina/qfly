<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { flightMapController } from '../controllers/flightMap.controller'
import { FlightDetailProp } from '../models/interfaces';


export default defineComponent({
    props: {
        flightDetails: {
            type: Object as PropType<FlightDetailProp | undefined>,
            default: () => null,
        },
        faFlightId: {
            type: String,
            default: () => '',
        },
        mapType: {
            type: String as () => 'google' | 'flightaware',
            default: 'google',
        },
        workOrderId: {
            type: Number,
            default: () => 0,
        }
    },
    setup (props) {
       return { ...flightMapController(props) }
    }
})
</script>
<template>
    <div class="tw-w-full">
        <q-card 
            v-show="loading"
            class="
                tw-relative
                tw-w-full 
                tw-h-96
                tw-flex 
                tw-justify-center 
                tw-items-center
            "
        >
            <q-inner-loading
                :showing="loading"
                label="Please wait..."
                label-class="text-grey"
                label-style="font-size: 1.1em"
            />
        </q-card>
        <q-card 
            v-if="error && !mapScreenshot"
            class="
                card-example 
                tw-w-full
                tw-h-96
                tw-flex
                tw-flex-col
                tw-justify-center
                tw-items-center
                tw-text-gray-500
            "
        >
            <i class="fa-solid fa-circle-exclamation tw-text-6xl" />
            <p class="tw-mt-3">The map loading has failed</p>
        </q-card>
        <div 
            v-show="!loading"
            class="tw-w-full"
        >
            <div 
                v-if="mapType === 'google' && !error"
                class="tw-w-full tw-h-96"
                ref="mapRef"
            />
            <img 
                v-if="mapType === 'flightaware' && mapScreenshot"
                :src="mapScreenshot"
                class="tw-w-full tw-h-auto"
            />
            <q-card 
                v-if="mapType === 'flightaware' && !mapScreenshot && !error"
                class="
                    card-example 
                    tw-w-full
                    tw-h-96
                    tw-flex
                    tw-flex-col
                    tw-justify-center
                    tw-items-center
                    tw-text-gray-500
                "
            >
                <i class="fa-solid fa-map-location-dot tw-text-6xl" />
                <p class="tw-mt-3">No data to show on the map</p>
            </q-card>
        </div>
    </div>
</template>
<style>
    .gm-ui-hover-effect {
        display: none !important;
    }
</style>