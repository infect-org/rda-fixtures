import HTTP2Client from '@distributed-systems/http2-client';
import RegistryClient from '@infect/rda-service-registry-client';
import DataSet from './DataSet.js';


export default class ShardedDataSet {

    constructor(registryHost = 'http://l.dns.porn:9000') {
        this.registryHost = registryHost;
        this.client = new RegistryClient(registryHost);
    }




    async create({
        name = 'shard-'+Math.round(Math.random()*1000000),
        dataSetLength = 100,
    } = {}) {
        const client = new HTTP2Client();

        // get a data set
        this.dataSet = new DataSet(this.registryHost);


        this.dataSetId = await this.dataSet.create({
            length: dataSetLength
        });


        // create shard on the data set
        const storageHost = await this.client.resolve('infect-rda-sample-storage');
        const response = await client.post(`${storageHost}/infect-rda-sample-storage.shard`).expect(201).send({
            dataSet: this.dataSetId,
            shards: [name]
        });

        await client.end();

        return name;
    }
}