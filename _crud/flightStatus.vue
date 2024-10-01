<template>

</template>
<script>
import colorTailwind from 'modules/qsite/_resources/models/colorTailwind.js'
//Component
export default {
  data() {
    return {
      crudId: this.$uid(),
      appMode: config('app.mode')
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qfly.entityNames.flightStatuses"),
        apiRoute: 'apiRoutes.qfly.flightStatuses',
        permission: 'iflight.flight-statuses',
        //extraFormFields: 'ifly.crud-fields.fly',
        create: {
            title: this.$tr('ifly.cms.form.newFlightStatus')
        },
        read: {
          columns: [
            {
              name: 'id',
              label: this.$tr('isite.cms.form.id'),
              field: 'id',
              style: 'width: 50px'},
            {
              name: 'name',
              label: 'Status Name',
              field: 'name',
              align: 'left',
              formatColumn: row => ({
                bgTextColor: row.color ? `tw-bg-${row.color}` : ''
              }),
            },
            {
              name: 'color',
              label: 'Status Color',
              field: 'color',
              align: 'left',
            },
            {
              name: 'icon',
              label: 'Status icon',
              field: 'icon',
              align: 'left',
            },
            {
              name: "created_at",
              label: this.$tr("isite.cms.form.createdAt"),
              field: "createdAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            {
              name: "updated_at",
              label: this.$tr("isite.cms.form.updatedAt"),
              field: "updatedAt",
              align: "left",
              format: (val) => (val ? this.$trd(val) : "-"),
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ],
          filters: {
          },
          requestParams: {
            include: ''
          },
        },
        update: {
          title: this.$tr('ifly.cms.form.updateFlightStatus')
        },
        delete: true,
        formLeft: {
          id: {value: ""},
          name: {
            value: "",
            type: "input",
            props: {
              label: 'Status Name',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          color : {
            value: "",
            type: "select",
            props: {
              selectColor: true,
              colorType: 'tailwindcss',
              label: 'Status Color',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
              options: colorTailwind,
            },
          },
          icon: {
            value: "",
            type: "input",
            props: {
              label: 'Icon',
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  }
}
</script>
<style lang="scss">
</style>
