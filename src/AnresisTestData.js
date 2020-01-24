import parse from 'csv-parse';
import path from 'path';
import fs from 'fs';


const { promises: { readFile } } = fs;



export default class AnresisTestData {


    async getData() {
        const filePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../data/anresis-test-data.csv');
        const data = await readFile(filePath);
        
        return await new Promise((resolve, reject) => {
            parse(data, {
                columns: true,
            }, (err, records) => {
                if (err) reject(err);
                else resolve(records);
            });
        });
    }


    async getOneRow() {
        const rows = await this.getData();
        return rows[0];
    }
}