'use-strict';


import superagent from 'superagent';
import RegistryClient from 'rda-service-registry/src/RegistryClient';


export default class DataSet {

    constructor(registryHost = 'http://l.dns.porn:9000') {
        this.client = new RegistryClient({
            registryHost,
        });
    }




    async create({
        name = 'data-set-'+Math.round(Math.random()*1000000),
        length = 10000,
    } = {}) {
        const storageHost = await this.client.resolve('infect-rda-sample-storage');

        // create a new data set & version
        const versionId = await this.createVersion({
            storageHost: storageHost,
            dataSetName: name
        });


        // write data
        await superagent.post(`${storageHost}/infect-rda-sample-storage.data`).ok(res => res.status === 201).send({
            dataVersionId: versionId,
            records: Array.apply(null, {length}).map(() => this.createRecord()),
        });


        // mark version as ready
        await superagent.patch(`${storageHost}/infect-rda-sample-storage.data-version/${versionId}`).ok(res => res.status === 200).send({
            status: 'active'
        }).catch(console.log);

        return name;
    }





    createRecord() {
        return {
            bacteriumId: Math.round(Math.random()*50),
            antibioticId: Math.round(Math.random()*50),
            ageGroupId: Math.round(Math.random()*10),
            regionId: Math.round(Math.random()*10),
            sampleDate: new Date().toISOString(),
            resistance: Math.round(Math.random()*2),
            sampleId: 'sample-id-'+Math.round(Math.random()*100000000000000000),
        };
    }




    async createVersion({
        name = 'data-version-'+Math.round(Math.random()*1000000),
        storageHost,
        dataSetName,
    }) {
        const response = await superagent.post(`${storageHost}/infect-rda-sample-storage.data-version`).ok(res => res.status === 201).send({
            identifier: name,
            dataSet: dataSetName,
            dataSetFields: ['bacteriumId', 'antibioticId', 'ageGroupId', 'regionId', 'sampleDate', 'resistance']
        });

        return response.body.id;
    }
}