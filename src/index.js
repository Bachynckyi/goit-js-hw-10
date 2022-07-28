import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
// import fetchCountries from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const inputBox = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

inputBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    const inputSearch = event.target.value.trim();
    if (inputSearch === "") {
        info.innerHTML = '';
        list.innerHTML = '';
    }
    else {
        fetchCountries(inputSearch)
            .then(data => {
                if (data.length > 10) {
                    Notify.info('Too many matches found. Please enter a more specific name.');
                    info.innerHTML = '';
                    list.innerHTML = '';
                }
                else if (data.length >= 2 && data.length <= 10) {
                    info.innerHTML = '';
                    list.innerHTML = listMarkUp(data);
                }
                else {
                    list.innerHTML = '';
                    info.innerHTML = infoMarkUp(data); 
                }
        })
            .catch(error => {
                console.log(error);
                Notify.failure('Oops, there is no country with that name');
        });
    }
}

function infoMarkUp(serverArray) {
    return serverArray
        .map(({ name, capital, population, flags, languages}) => {
            return `
        <div>
        <img src="${flags.svg}" alt="${name.common}" width=50px />
        <span>${name.official}</span>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages).join(', ')}</p>
        `})
        .join('');        
};

function listMarkUp(serverArray) {
    return serverArray
        .map(({ name, flags }) => {
            return `
                <li>
                <img src="${flags.svg}" alt="${name.common}" width=30px />
                <span>${name.official}</span>
                </li>`})
        .join('')
};
 
function fetchCountries(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
        .then(response => {return response.json()}) 
};


