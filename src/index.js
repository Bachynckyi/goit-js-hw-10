import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries.js';

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
        <div class="info__card">
        <img src="${flags.svg}" alt="${name.common}" width=50px class="info__img"/>
        <span>${name.official}</span>
        </div>
        <p class="info__names">Capital:<span class="info__values"> ${capital}</span></p>
        <p class="info__names">Population:<span class="info__values"> ${population}</span></p>
        <p class="info__names">Languages:<span class="info__values"> ${Object.values(languages).join(', ')}</span></p>
        `})
        .join('');        
};

function listMarkUp(serverArray) {
    return serverArray
        .map(({ name, flags }) => {
            return `
                <li class="list__item">
                <img src="${flags.svg}" alt="${name.common}" width=30px />
                <span class="list__name">${name.official}</span>
                </li>`})
        .join('')
};
 
// function fetchCountries(name) {
//     return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
//         .then(response => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }
//       return response.json();
//     },
//   ); 
// };


