<template>
    <div>
        <q-table 
            :title="title" 
            dense 
            :rows="dataTable" 
            :columns="columns"
            :visible-columns="['']"
        >
            <template v-slot:body-cell="props">
                <q-td :props="props">
                    <div v-html="props.value"></div>
                </q-td>
            </template>
            <template v-slot:body-cell-workOrder="props">
                <q-td :props="props">
                    <q-btn 
                        round 
                        color="primary" 
                        icon="fa-light fa-briefcase" 
                        size="sm"
                        @click="redirect(props.row)"
                        v-if="props.row.workOrder"
                    >
                        <q-tooltip>
                            go to workOrder
                        </q-tooltip>
                    </q-btn>
                    <p v-if="!props.row.workOrder"> - </p>
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import tableCardsController from '../controllers/tableCards'
export default defineComponent({
    props: {
        title: {
            type: String,
            default: () => 'Fly'
        },
        dataTable: {
            type: Array,
            default: () => [],
        },
        showWorkOrderColumn: {
            type: Boolean,
            default: () => false,
        }
    },
    setup(props) {
        return {...tableCardsController(props)}
    }
})
</script>

<style scoped></style>