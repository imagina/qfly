<template>
</template>
<script>
//Component
export default {
  data() {
    return {
      crudId: this.$uid(),
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qfly.entityNames.airport"),
        apiRoute: "apiRoutes.qfly.airports",
        permission: "iflight.airport",
        //extraFormFields: "ifly.crud-fields.airports",
        create: {
          title: this.$tr("ifly.cms.form.newAirport"),
        },
        read: {
          columns: [
            {
              name: "id",
              label: this.$tr("isite.cms.form.id"),
              field: "id",
              style: "width: 50px",
            },
            {
              name: "airportName ",
              label: this.$tr("ifly.cms.form.airportName"),
              field: "airportName",
              align: "rigth",
              action: 'edit'
            },
            {
              name: "airportIataCode",
              label: this.$tr("ifly.cms.form.airportIataCode"),
              field: "airportIataCode",
              align: "left",
            },
            {
              name: "airportIcaoCode",
              label: this.$tr("ifly.cms.form.airportIcaoCode"),
              field: "airportIcaoCode",
              align: "left",
            },
            {
              name: "timezone",
              label: this.$tr("ifly.cms.form.timezone"),
              field: "timezone",
              align: "left",
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
            {
              name: "actions",
              label: this.$tr("isite.cms.form.actions"),
              align: "left",
            },
          ],
        },
        update: {
          title: this.$tr("ifly.cms.form.updateAirport"),
          requestParams: {},
        },
        delete: true,
        formLeft: {
          id: {value: ""},
          userId: {value: this.$store.state.quserAuth.userId},
          airportName: {
            value: "",
            type: "input",
            props: {
              label: `${this.$tr("ifly.cms.form.airportName")}*`,
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
          },
          airportIataCode: {
            value: "",
            type: "input",
            props: {
              label: `${this.$tr("ifly.cms.form.airportIataCode")}*`,
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
            },
          },
          airportIcaoCode: {
            value: "",
            type: "input",
            props: {
              label: `${this.$tr("ifly.cms.form.airportIcaoCode")}*`,
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
            },
          },
          timezone: {
            value: '',
            type: "select",
            props: {
              label: this.$tr('ifly.cms.form.timezone'),
              rules: [(val) => !!val || this.$tr("isite.cms.message.fieldRequired")],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qfly.timezones',
              select: {
                label:'name',
                id: 'value'
              },
              requestParams: {refresh: true}
            }
          },
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    },
  },
};
</script>
