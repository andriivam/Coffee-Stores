
import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET}`;
}

const getListOfCoffeeStorePhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        perPage: 30
    });
    const unsplashResults = photos.response.results
    return unsplashResults.map((result => result.urls.small));
}

const fetchCoffeeStores = async (latLong = "50.84688125929826%2C4.356789347580639", limit = 6) => {
    const photos = await getListOfCoffeeStorePhotos();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API,
        }
    };

    const response = await fetch(getUrlForCoffeeStores(
        latLong,
        "coffee",
        limit),
        options
    );

    const data = await response.json();
    return data.results.map((result, idx) => {
        return {
            id: result.fsq_id,
            address: result.location.address,
            name: result.name,
            postcode: result.location.postcode,
            imgUrl: photos.length > 0 ? photos[idx] : null,
        }
    });
    // .catch(err => console.error(err));

};

export default fetchCoffeeStores;