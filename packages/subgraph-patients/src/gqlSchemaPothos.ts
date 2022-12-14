import SchemaBuilder from '@pothos/core';
import {Patient as IPatient, Status as IStatus} from "./models/patient";
import DirectivePlugin from '@pothos/plugin-directives';
import FederationPlugin from '@pothos/plugin-federation';

const builder = new SchemaBuilder({
    // If you are using other plugins, the federation plugin should be listed after plugins like auth that wrap resolvers
    plugins: [DirectivePlugin, FederationPlugin],
});

const Status = builder.enumType(IStatus, {
    name: 'Status'
});

const Patient = builder.objectRef<IPatient>('Patient').implement({
    fields: (t) => ({
        patientNumber: t.exposeString('patientNumber'),
        firstName: t.exposeString('firstName'),
        lastName: t.exposeString('lastName'),
        gender: t.exposeString('gender'),
        status: t.expose('status', {
            type: Status
        })
    }),
});

const patienten: IPatient[] = [{
    patientNumber: 'TD1234',
    firstName: 'James',
    lastName: 'Bond',
    gender: 'm',
    status: IStatus.GELOESCHT
}, {
    patientNumber: 'TD0001',
    firstName: 'Jane',
    lastName: 'Bond',
    gender: 'f',
    status: IStatus.AKTIV
}];

builder.asEntity(Patient, {
    key: builder.selection<{ patientNumber: string }>('patientNumber'),
    resolveReference: (patient) => patienten.find(({ patientNumber }) => patient.patientNumber === patientNumber),
});

builder.queryType({
    fields: (t) => ({
        hello: t.string({
            args: {
                name: t.arg.string(),
            },
            resolve: (parent, { name }) => `hello, ${name || 'World'}`,
        }),
        patients: t.field({
            type: [Patient],
            description: 'All Patients',
            resolve: () => {
                console.log("calling - patients");
                return patienten;
            }
        })
    }),
});



export const pothosSchema = builder.toSubGraphSchema({});