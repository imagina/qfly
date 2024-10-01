<script lang="ts">
import { defineComponent } from 'vue'
import mainController from '../controllers/main';
import flightDetail from '../components/flightDetail.vue'
import timeCards from '../components/timeCards.vue'
import tableFlight from '../components/tableFlight.vue';

export default defineComponent({
  props: {
    workOrderData: {
      type: Object,
      default: () => null
    },
    isSearch: {
      type: Boolean,
      default: () => true
    },
  },
  components: {
    flightDetail,
    timeCards,
    tableFlight,
  },
  setup(props) {
    return { ...mainController(props) }
  }
})
</script>

<template>
  <div>
    <div class="tw-p-4" v-if="isSearch">
      <div class="tw-text-center">
        <img src="https://agidev.blob.core.windows.net/agione/AGI_logo_app.png" alt="" srcset=""></img>
      </div>
      <div class="
        tw-px-8
        tw-border
        tw-py-4
        tw-rounded
        tw-space-y-4
        tw-mx-auto
        tw-my-4
        tw-shadow-lg">
        <p class="tw-font-semibold">Search for flight</p>
        <div class="tw-flex tw-w-full tw-space-x-4">
          <div class="tw-w-64">
            <dynamic-field v-model="store.search" :field="fields.search" @enter="methods.getFlightaware()" />
          </div>
          <div>
            <q-btn color="primary" :label="$tr('isite.cms.label.search')" @click="methods.getFlightaware()" />
          </div>
        </div>
      </div>
    </div>
    <div class="tw-px-4" v-if="flight && !loading">
      <q-banner inline-actions rounded class="bg-orange text-white" v-if="!isSearch && !validateFaFlightId">
        This Work Order doesn't have a Flightaware flight linked to it, we are showing you everything that we get
      </q-banner>
      <div class="tw-border tw-shadow-lg tw-rounded-md">
        <div v-if="flight.workOrder && isSearch" class="tw-flex tw-absolute tw-my-4 tw-ml-6">
          <q-btn 
            round 
            color="primary" 
            icon="fa-light fa-briefcase" 
            size="sm"
            @click="methods.redirectWo"
          >
            <q-tooltip>
                go to workOrder
            </q-tooltip>
          </q-btn>
        </div>

        <div class="tw-p-4 lg:tw-flex" :class="{'tw-mt-8': flight.workOrder}">
          <div class="tw-w-full lg:tw-w-3/5">
            <flightDetail />
          </div>
          <div class="tw-w-full lg:tw-w-2/5 lg:tw-px-6">
            <timeCards />
          </div>
        </div>
        <div class="tw-space-y-8 tw-p-4">
          <tableFlight 
            v-if="upcomingFlights.length > 0" 
            title="Upcoming Flights" 
            :dataTable="upcomingFlights"
            :showWorkOrderColumn="isSearch"
          />
          <tableFlight 
            v-if="routeFlight.length > 0" 
            title="En Route Flight" 
            :dataTable="routeFlight"
            :showWorkOrderColumn="isSearch"
          />
          <tableFlight 
            v-if="pastFlights.length > 0" 
            title="Past Flights" 
            :dataTable="pastFlights" 
            :showWorkOrderColumn="isSearch"
          />
        </div>
      </div>
    </div>
    <div 
      class="
        tw-text-8xl 
        tw-flex 
        tw-justify-center"
        v-if="loading"
      >
      <div>
        <i class="fa-light fa-plane-departure tw-text-blue-900 tw-animate-pulse" />
        <q-spinner-dots color="primary" />
      </div>
    </div>
    <div v-if="store.flightList.length === 0 && store.search.length > 0 && store.failRequest" 
      class="
       tw-py-4 
       tw-text-xl 
       tw-border 
       tw-shadow-lg 
       tw-p-4 tw-mx-4
       tw-rounded-md
       tw-text-center
       "
      >
        <div class="tw-py-3">
          <i class="fa-light fa-plane-circle-xmark tw-text-6xl tw-text-blue-900"></i>
        </div>
        <div>
          I couldn't find flight tracking data for {{ store.search }} yet.
          Recheck the flight number/identifier.
        </div>
    </div>
    <div v-if="
      store.flightList.length > 0 &&
      !isSearch && 
      !loading && 
      !store.selectedFligth && 
      !store.failRequest" 
      class="
       tw-py-4 
       tw-text-xl 
       tw-border 
       tw-shadow-lg 
       tw-p-4 tw-mx-4
       tw-rounded-md
       tw-text-center
       "
      >
        <div class="tw-py-3">
          <i class="fa-light fa-plane-circle-xmark tw-text-6xl tw-text-blue-900"></i>
        </div>
        <div>
          No statistics available
        </div>
    </div>
  </div>
</template>

<style scoped></style>