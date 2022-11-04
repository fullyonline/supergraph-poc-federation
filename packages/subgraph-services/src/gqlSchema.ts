import SchemaBuilder from '@pothos/core';
import { CostUnit } from './models/costUnit';
import { ServiceAppointment } from './models/serviceAppointment';
import DirectivePlugin from '@pothos/plugin-directives';
import FederationPlugin from '@pothos/plugin-federation';

export enum Status {
  AKTIV = "AKTIV",
  INAKTIV = "INAKTIV",
}

const builder = new SchemaBuilder({
  // If you are using other plugins, the federation plugin should be listed after plugins like auth that wrap resolvers
  plugins: [DirectivePlugin, FederationPlugin],
});

builder.enumType(Status, {
  name: 'Status',
})

const CostUnitType = builder.objectType(CostUnit, {
  name: 'CostUnit',
  description: 'Kostenstelle',
  fields: (t) => ({
    code: t.exposeString('code'),
    name: t.exposeString('name')
  })
})

builder.asEntity(CostUnitType, {
  key: builder.selection<{ code: string }>('code'),
    resolveReference: (costUnit, costUnits: any) => costUnits.find(({ code }: any) => costUnit.code === code),
})

const PatientRef = builder.externalRef(
    'Patient',
    builder.selection<{ patientNumber: string }>('patientNumber'),
).implement({
  externalFields: (t) => ({
    // The field that will be provided
    firstName: t.string(),
    lastName: t.string(),
    gender: t.string(),
  }),
  fields:(t) => ({
    patientNumber: t.exposeString('patientNumber'),
  })
});

const ServiceAppointmentType = builder.objectType(ServiceAppointment, {
  name: 'ServiceAppointment',
  description: 'Leistungssitzung',
  fields: (t) => ({
    sender: t.exposeString('sender', {}),
    reportnr: t.exposeString('reportnr', {}),
    patient: t.field( {
      type: PatientRef,
      resolve: (service) => ({
        patientNumber: service.patientNumber
      })
    }),
    caseNumber: t.exposeInt('caseNumber', {}),
    status: t.expose('status', {type: Status}),
    costUnit: t.field({
      type: CostUnitType,
      resolve: (parent) => {
        return parent.costUnit;
      },
    }),
    
  }),
});

builder.asEntity(ServiceAppointmentType, {
  key: builder.selection<{ reportnr: string }>("reportnr"),
    resolveReference: (serviceAppointment, serviceAppointments: any) => serviceAppointments.find(({ reportnr }: any) => serviceAppointment.reportnr === reportnr)
})

// .implement({
//   // Additional external fields can be defined here which can be used by `requires` or `provides` directives
//   externalFields: (t) => ({
//     patientNumber: t.string(),
//   }),
  // fields: (t) => ({
  //   // exposes properties added during loading of the entity above
  //   services: t.float({
  //     // fields can add a `requires` directive for any of the externalFields defined above
  //     // which will be made available as part of the first arg in the resolver.
  //     requires: builder.selection<{ patientNumber?: string; }>('patientNumber'),
  //     resolve: (data) => {
  //       []
  //       // free for expensive items
  //       // if ((data.price ?? 0) > 1000) {
  //       //   return 0;
  //       // }
  //       // // estimate is based on weight
  //       // return (data.weight ?? 0) * 0.5;
  //     },
  //   }),
  // }),
// });



builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || 'World'}`,
    }),

    serviceAppointments: t.field({
      type: [ServiceAppointmentType],
      description: 'All Service Appointments',
      resolve: () => {
        console.log("calling - service appointments");
        const costUnit = new CostUnit('KS1', 'Kostenstelle 1');
        return [
        new ServiceAppointment('TST', '1234', 'TD1234', 1234, costUnit, Status.INAKTIV),
        new ServiceAppointment('TST', '12345', 'TD1234',1234, costUnit, Status.AKTIV),
        new ServiceAppointment('TST', '123456', 'TD0001',2345, costUnit, Status.AKTIV),
      ]}
      ,
    }),
    
  }),
});

export const schema = builder.toSubGraphSchema({});