'use-strict';


import superagent from 'superagent';
import DataSet from './DataSet';
import RegistryClient from 'rda-service-registry/src/RegistryClient';


export default class ShardedDataSet {

    constructor(registryHost = 'http://l.dns.porn:9000') {
        this.registryHost = registryHost;

        this.client = new RegistryClient({
            registryHost,
        });
    }




    async create({
        name = 'shard-'+Math.round(Math.random()*1000000),
        dataSetLength = 1000,
    } = {}) {

        // get a data set
        this.dataSet = new DataSet(this.registryHost);


        this.dataSetId = await this.dataSet.create({
            length: dataSetLength
        });


        // create shard on the data set
        const storageHost = await this.client.resolve('infect-rda-sample-storage');
        const response = await superagent.post(`${storageHost}/infect-rda-sample-storage.shard`).ok(res => res.status === 201).send({
            dataSet: this.dataSetId,
            shards: [name]
        });


        return name;
    }
}