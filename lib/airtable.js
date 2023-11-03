const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.SECRET_API_TOKEN }).
    base(process.env.AIRTABLE_BASE_KEY);

export const table = base('tblauDEAEIXJFdI02');

const getRecord = (record) => {
    return {
        recordId: record.id,
        ...record.fields
    }
};

export const getRecords = (records) => {
    return records.map(record => getRecord(record));
};


export const findRecordByFilter = async (id) => {
    const findCoffeeStoreRecords = await table
        .select({
            filterByFormula: `id="${id}"`
        })
        .firstPage();

    return getRecords(findCoffeeStoreRecords);

};