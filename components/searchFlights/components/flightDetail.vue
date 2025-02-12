<script lang="ts">
import { defineComponent } from 'vue';
import flightDetailController from '../controllers/flightDetail'
import flightMap from '../../flightMap/components/flightMap.vue'

export default defineComponent({
    components: {
      flightMap
    },
    setup () {
     return {...flightDetailController()}
    }
})
</script>
<template>
    <div
      v-if="flight"
      class="flight-map-traker tw-mx-auto tw-p-3"
      :style="cssVars"
    >
      <div class="md:tw-flex tw-mb-6 md:tw-space-x-4">
        <div class="rw-grow">
          <div class="tw-flex">
            <div class="tw-grow">
              <p class="tw-text-2xl tw-mb-2 tw-hidden">ABX Air 1234</p>
              <p
               v-if="flight.ident && flight.identIata"      
               class="tw-uppercase tw-text-gray-400">
                {{ flight.ident }} /
                {{ flight.identIata }}
              </p>
              <a
                class="
                  tw-text-xs
                  tw-mb-2
                  tw-block
                  tw-font-semibold
                  tw-underline
                  tw-decoration-dashed
                  tw-text-blue-400
                  tw-hidden
                "
                href=""
                >Make a category upgrade to see the registration number</a
              >
              <p
                class="tw-uppercase tw-text-xl tw-font-bold"
                :class="
                  flight.flightStatusColor
                    ? `tw-bg-${flight.flightStatusColor} tw-text-white tw-px-2 tw-rounded-md`
                    : ''
                "
              >
                {{ flight.status }}
              </p>
              <p class="tw-text-yellow-600 tw-text-base tw-hidden">
                {{ methods.minutesToHours(flight.timeTotalEstimated) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="
          tw-flex tw-flex-col
          md:tw-flex-row
          tw-justify-between tw-space-x-4
        "
      >
        <div class="tw-mb-3">
          <p class="tw-uppercase tw-text-lg" v-if="flight.gateOrigin">
            Gate: {{ flight.gateOrigin }}
          </p>
          <p class="tw-text-xl tw-uppercase">
            {{ flight.originAirport.airportIataCode }}
          </p>
          <p class="tw-text-lg tw-uppercase tw-font-medium tw-text-blue-400 decorator-text">
            {{ flight.originAirport.airportName }}
          </p>
          <p class="tw-text-sm tw-hidden">Detachment from</p>
          <a
            class="
              tw-text-base
              tw-mb-2
              tw-block
              tw-font-bold
              tw-underline
              tw-decoration-dotted
              tw-text-blue-400
              tw-hidden
            "
            >int'l de denver -
            <span class="tw-font-bold tw-uppercase">DEN</span></a
          >
          <p class="tw-text-lg tw-uppercase">
            {{
              dateOriginAirportTimezone(dateDeparture, "dddd DD-MM-YYYY")
            }}
          </p>
          <p class="tw-text-lg">
            <span class="tw-font-bold"
              >{{ dateOriginAirportTimezone(dateDeparture, "hh:mm A") }}
              {{ methods.timezone(flight.originAirport.timezone) }}</span
            >
            <span :class="methods.delay(flight.departureDelay).color" v-if="flight.departureDelay">
              ({{ methods.delay(flight.departureDelay).title }})
            </span>
          </p>
        </div>
        <div class="tw-text-right">
          <p class="tw-uppercase tw-text-lg" v-if="flight.gateDestination">
            Gate: {{ flight.gateDestination }}
          </p>
          <p class="tw-text-xl tw-uppercase">
            {{ flight.destinationAirport.airportIataCode }}
          </p>
          <p class="tw-text-lg tw-uppercase tw-font-medium tw-text-blue-400 decorator-text">
            {{ flight.destinationAirport.airportName }}
          </p>
          <p class="tw-text-sm tw-hidden">landing on</p>
          <a
            class="
              tw-text-base
              tw-mb-2
              tw-block
              tw-font-bold
              tw-underline
              tw-decoration-dotted
              tw-text-blue-400
              tw-hidden
            "
            >int'l de denver -
            <span class="tw-font-bold tw-uppercase">ILN</span></a
          >
          <p class="tw-text-lg tw-uppercase">
            {{
              dateDestinationTimezone(dateArrival, "dddd DD-MM-YYYY")
            }}
          </p>
          <p class="tw-text-lg">
            <span :class="methods.delay(flight.arrivalDelay).color" v-if="flight.arrivalDelay">
              ({{ methods.delay(flight.arrivalDelay).title }})</span
            >
            <span class="tw-font-bold"
              >{{ dateDestinationTimezone(dateArrival, "hh:mm A") }}
              {{ methods.timezone(flight.destinationAirport.timezone) }}</span
            >
          </p>
        </div>
      </div>
      <div class="tw-mt-6">
        <q-range
          v-model="standard"
          color="positive"
          :min="0"
          :max="100"
          readonly
          left-thumb-color="tw-left-thumb"
          :right-thumb-color="rightThumbColor"
        />
      </div>
      <div
        class="
          tw-grid
          tw-grid-cols-1
          tw-gap-4
          tw-place-items-stretch
          tw-mb-6
          tw-text-gray-500
        "
      >
        <div class="tw-text-sm tw-text-center">
          <span class="tw-font-bold">{{
            totalTravelTime
          }}</span>
          total travel time
        </div>
      </div>
      <flightMap 
        v-bind="wantedFlightCases"
      />
    </div>
</template>
<style>
.flight-map-traker .q-slider__thumb,
.flight-map-traker .q-slider__track-container,
.q-slider__selection {
  @apply tw-relative;
}

.flight-map-traker .q-slider__thumb:last-child:before {
  @apply tw-absolute tw-z-10 tw-text-2xl;
  font-family: "Font Awesome 6 Pro";
  content: "\f072";
  font-weight: 900;
  color: var(--q-positive);
  top: -10px;
  text-shadow: 0px 9px 5px #607d8b, 0px -4px 10px rgba(255 255 255 0.3);
  display: var(--display-range);
}

.flight-map-traker .img-map {
  width: 70vw;
  height: 500px;
  border-radius: 10px;
}

.flight-map-traker .text-tw-left-thumb,
.flight-map-traker .q-slider__thumb-shape {
  @apply tw-hidden;
}

.flight-map-traker .tw-underline.tw-decoration-dotted {
  text-underline-offset: 3px;
  text-decoration-style: dotted;
}

.flight-map-traker .tw-underline.tw-decoration-dashed {
  text-underline-offset: 3px;
  text-decoration-style: dashed;
}

.flight-map-traker .q-slider__track-container:before,
.flight-map-traker .q-slider__track-container:after {
  content: "";
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  box-shadow: 0px 0px 10px 2px #a2b1b9;
}

.flight-map-traker .q-slider__track-container:before {
  @apply tw-left-0;
  background-color: var(--q-positive);
}

.flight-map-traker .q-slider__track-container:after {
  @apply tw-right-0 tw-z-0;
  background-color: var(--q-positive);
}
.flight-map-traker .q-slider__inner {
  @apply tw-opacity-30 tw-bg-gray-200;
}
.flight-map-traker .decorator-text {
  text-decoration: underline dotted;
}
</style>