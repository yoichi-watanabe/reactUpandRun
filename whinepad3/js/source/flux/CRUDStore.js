/* @flow */

import {EventEmitter} from 'fbemitter';

let data;
let schema;
const emitter = new EventEmitter();

const CRUDStore = {
    getData(): Array<Object> {
        return data;
    },

    getSchema(): Array<Object> {
        return schema;
    },

    setData(newData: Array<Object>, commit: boolean = true) {
        data = newData;
        if (commit && 'localStorage' in window) {
            localStorage.setItem('data', JSON.stringify(newData));
        }
        emitter.emit('change');
    },

    getCount(): number {
        return data.length;
    },

    getRecord(recordId: number): ?Object {
        return recordId in data ? data[recordId] : null;
    },

    init(initialSchema: Array<Object>) {
        schema = initialSchema;
        const storage = 'localStorage' in window
            ? localStorage.getItem('data')
            : null;
        
        if (!storage) {
            schema.forEach(item => data[0][item.id] = item.sample);
        } else {
            data = JSON.parse(storage);
        }
    },

    addListener(eventType: string, fn: Function) {
        emitter.addListener(eventType, fn);
    },
}

export default CRUDStore