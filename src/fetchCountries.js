export default function fetchCountries(name) {
    const BASE_URL = 'https://restcountries.com/v3.1';
    return fetchCountries(`${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`)
        .then(response => { return response.json() })
};

