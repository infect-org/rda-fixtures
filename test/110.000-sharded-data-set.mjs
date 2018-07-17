'use strict';

import {ShardedDataSet} from '../';
import section from 'section-tests';
import assert from 'assert';
import log from 'ee-log';
import {ServiceManager} from 'rda-service';




section('Sharded Data Set', (section) => {
    let sm;

    section.setup(async () => {
        sm = new ServiceManager({
            args: '--dev --log-level=error+ --log-module=*'.split(' ')
        });
        
        await sm.startServices('rda-service-registry');
        await sm.startServices('infect-rda-sample-storage');
    });



    section.test('Create a new sharded data set', async () => {
        const dataSet = new ShardedDataSet();
        const name = await dataSet.create();

        //log(name);
    });



    section.destroy(async () => {
        await sm.stopServices();
    });
});