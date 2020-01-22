import HTTP2Client from '@distributed-systems/http2-client';
import RegistryClient from '@infect/rda-service-registry-client';


export default class DataSet {

    constructor(registryHost = 'http://l.dns.porn:9000') {
        this.client = new RegistryClient(registryHost);
    }




    async create({
        name = 'data-set-'+Math.round(Math.random()*1000000),
        length = 100,
    } = {}) {
        const client = new HTTP2Client();

        const storageHost = await this.client.resolve('infect-rda-sample-storage'); 

        // create a new data set & version
        const versionId = await this.createVersion({
            storageHost: storageHost,
            dataSetName: name,
            client,
        });


        // write data
        await client.post(`${storageHost}/infect-rda-sample-storage.data`)
            .expect(201)
            .send({
                dataVersionId: versionId,
                records: Array.apply(null, {length}).map(() => this.createRecord()),
            });


        // mark version as ready
        await client.patch(`${storageHost}/infect-rda-sample-storage.data-version/${versionId}`).expect(200).send({
            status: 'active'
        }).catch(console.log);


        await client.post(`${storageHost}/infect-rda-sample-storage.source-code-loader`)
            .expect(201)
            .send();

        await client.patch(`${storageHost}/infect-rda-sample-storage.source-code-loader/${name}`)
            .expect(200)
            .send();


        await client.end();

        return name;
    }




    createRecord() {
        return {
            animalId: Math.round(Math.random()*50),
            countryId: Math.round(Math.random()*50),
            microorganismId: Math.round(Math.random()*50),
            compoundSubstanceId: Math.round(Math.random()*50),
            patientAgeRangeFrom: Math.round(Math.random()*1000),
            patientAgeRangeTo: Math.round(Math.random()*2000)+1000,
            hospitalStatusId: Math.round(Math.random()*3),
            regionId: Math.round(Math.random()*10),
            sampleDate: new Date().toISOString(),
            resistanceQualitative: 'ris'.substr(Math.round(Math.random()*2), 1),
            uniqueIdentifier: 'sample-id-'+Math.round(Math.random()*100000000000000000),
        };
    }




    async createVersion({
        name = 'data-version-'+Math.round(Math.random()*1000000),
        storageHost,
        dataSetName,
        client,
    }) {
        const response = await client.post(`${storageHost}/infect-rda-sample-storage.data-version`).expect(201).send({
            identifier: name,
            dataSet: dataSetName,
            dataSetFields: ['bacteriumId', 'antibioticId', 'ageGroupId', 'regionId', 'sampleDate', 'resistance']
        });

        const data = await response.getData();
        return data.id;
    }
}