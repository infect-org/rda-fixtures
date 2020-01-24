import { AnresisTestData } from '../index.js';
import section from 'section-tests';
import assert from 'assert';
import log from 'ee-log';




section('Anresis Test Data', (section) => {


    section.test('Create a new data set', async () => {
        const anresisTestData = new AnresisTestData();
        const rows = await anresisTestData.getData();

        assert.equal(rows.length, 99);
        assert.equal(rows[0]['unique-identifier'], '1f155b75f61d633defa8c95584e053d7');
    });
});