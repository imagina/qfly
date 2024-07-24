<template>

</template>
<script>
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
        entityName: config("main.qfly.entityNames.aircraftType"),
        apiRoute: 'apiRoutes.qfly.aircraftTypes',
        permission: 'iflight.aircrafttype',
        //extraFormFields: 'ifly.crud-fields.fly',
        create: {
          title: this.$tr('ifly.cms.form.newAircraftType')
        },
        read: {
          columns: [
            {
              name: 'id',
              label: this.$tr('isite.cms.form.id'),
              field: 'id',
              style: 'width: 50px'},
            {
              name: 'aircraftModel',
              label: this.$tr('ifly.cms.form.aircraftModel'),
              field: 'model',
              align: 'left',
              action: 'edit'
            },
            {
              name: 'manufacturer',
              label: this.$tr('ifly.cms.form.manufacturer'),
              field: 'manufacturer',
              align: 'left',
              action: 'edit'
            },
            {
              name: 'description',
              label: this.$tr('isite.cms.form.description'),
              field: 'description',
              align: 'left'
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
          title: this.$tr('ifly.cms.form.updateAircraftType')
        },
        delete: true,
        formLeft: {
          id: {value: ""},
          model: {
            value: "",
            type: "input",
            props: {
              label: `${this.$tr("ifly.cms.form.aircraftModel")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          fullName: {
            value: "",
            type: "input",
            props: {
              label: `Full name*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          manufacturer : {
            value: "",
            type: "input",
            props: {
              label: `${this.$tr("ifly.cms.form.manufacturer")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          description : {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.description')}`,
              type: 'textarea',
              rows: "4",
              debounce: 1500
            },
          },
          type: {
            value: "",
            type: "input",
            props: {
              label: `Type*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          }
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
