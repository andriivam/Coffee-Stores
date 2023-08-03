import fetchCoffeeStores from '../../../lib/coffee-stores';

const getCoffeeStoresByLocation = async (req, res) => {
    try {
        const { latLong, limit } = req.query;
        const response = await fetchCoffeeStores(latLong, limit);
        res.status(200);
        res.json(response);
    } catch (err) {
        console.error('There is error', { err });
        res.status(500).json({ error: err.message });
    }
}

export default getCoffeeStoresByLocation;