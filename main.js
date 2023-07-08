const BASE_URL = "https://gateway.marvel.com:443/v1/public/";
const API_KEY = "add the API_KEY here";  //TODO: add the API_KEY and PRIV_KEY here!
const PRIV_KEY = "add the PRIV_KEY here";

const navList = document.querySelectorAll('.navigation-item');
const container = document.getElementById('cards-container');
const title = document.getElementById('title');
const pagination = document.querySelector('.pagination');
const startBtn = document.querySelector('.start-btn');
const prevBtn = document.querySelector('.prev-btn');
const currentBtn = document.querySelector('.current-btn')
const nextBtn = document.querySelector('.next-btn');
const endBtn = document.querySelector('.end-btn');
const perPages = document.querySelectorAll('.items-per-page-btn');
const searchBtn = document.querySelector('.search-btn');
const input = document.querySelector('.search-input');


const requestData = {
  query: "characters",
  limit: 20,
  offset: 0,
  searchQuery: '',
  search: '',
};

const responseData = {
  total: null,
  amountPages: null,
  numberPage: 1,
};

const setStartValues = (limit, query) => {
  currentBtn.innerHTML = 1;
  responseData.numberPage = 1;
  startBtn.removeEventListener('click', moveLeftMax);
  prevBtn.removeEventListener('click', moveLeft);
  startBtn.setAttribute('disabled', true);
  startBtn.classList.add('not-active-btn');
  startBtn.classList.remove('active-btn');
  prevBtn.setAttribute('disabled', true);
  prevBtn.classList.add('not-active-btn');
  prevBtn.classList.remove('active-btn');
  nextBtn.addEventListener('click', moveRight);
  endBtn.addEventListener('click', moveRightMax);
  nextBtn.removeAttribute('disabled');
  nextBtn.classList.remove('not-active-btn');
  nextBtn.classList.add('active-btn');
  endBtn.removeAttribute('disabled');
  endBtn.classList.remove('not-active-btn');
  endBtn.classList.add('active-btn');
  perPages.forEach((btn) => {
    btn.classList.remove('active');
    if(btn.dataset.pages === limit) {
      btn.classList.add('active');
    }
  }) 
  requestData.limit = limit;
  requestData.offset= 0;
  requestData.searchQuery = '';
  responseData.amountPages = null;
}

function checkTotal() {
  if (responseData.total <= requestData.limit) {
    nextBtn.removeEventListener('click', moveRight);
    endBtn.removeEventListener('click', moveRightMax);
    nextBtn.setAttribute('disabled', true);
    nextBtn.classList.remove('active-btn');
    nextBtn.classList.add('not-active-btn');
    endBtn.setAttribute('disabled', true);
    endBtn.classList.remove('active-btn');
    endBtn.classList.add('not-active-btn');
  }
}

const getDataFromAPI = async (requestData) => {
  const {query, limit, offset, searchQuery} = requestData;
  try {
    let ts = new Date().getTime();
    let hash = CryptoJS.MD5(ts + PRIV_KEY + API_KEY).toString();
    let url;
    
    if (query === 'series' || query === 'comics') {
      requestData.search = 'titleStartsWith';
    } else if (query=== 'characters' || query === 'creators' || query === 'events') {
      requestData.search = 'nameStartsWith';
    } else {
      requestData.search = '';
    }

    if (searchQuery !== '') {
      url = `${BASE_URL}${query}?ts=${ts}&apikey=${API_KEY}&hash=${hash}&limit=${limit}&offset=${offset}&${requestData.search}=${searchQuery}`;
    } else {
      url = `${BASE_URL}${query}?ts=${ts}&apikey=${API_KEY}&hash=${hash}&limit=${limit}&offset=${offset}`;
    }
     
    const res = await fetch(url);
    const response = await res.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

async function moveRight() {
  if (currentBtn.innerHTML === "1") {
      startBtn.removeAttribute('disabled');
      startBtn.classList.remove('not-active-btn');
      startBtn.classList.add('active-btn');
      prevBtn.removeAttribute('disabled');
      prevBtn.classList.remove('not-active-btn');
      prevBtn.classList.add('active-btn');
      startBtn.addEventListener('click', moveLeftMax);
      prevBtn.addEventListener('click', moveLeft);
  }
  requestData.offset = requestData.limit *  responseData.numberPage;
  responseData.numberPage =  responseData.numberPage + 1;  
  currentBtn.innerHTML =  responseData.numberPage;
  const request = await getDataFromAPI(requestData);
  createCardsList(request)
    
  if (responseData.numberPage === responseData.amountPages) {
      nextBtn.removeEventListener('click', moveRight);
      endBtn.removeEventListener('click', moveRightMax);
      nextBtn.setAttribute('disabled', true);
      nextBtn.classList.add('not-active-btn');
      nextBtn.classList.remove('active-btn');
      endBtn.setAttribute('disabled', true);
      endBtn.classList.add('not-active-btn');
      endBtn.classList.remove('active-btn');
  }
};

async function moveLeft() {
  if (currentBtn.innerHTML === "2") {
      startBtn.removeEventListener('click', moveLeftMax);
      prevBtn.removeEventListener('click', moveLeft);
      startBtn.setAttribute('disabled', true);
      startBtn.classList.add('not-active-btn');
      startBtn.classList.remove('active-btn');
      prevBtn.setAttribute('disabled', true);
      prevBtn.classList.add('not-active-btn');
      prevBtn.classList.remove('active-btn');
  }
  responseData.numberPage =  responseData.numberPage - 1;
  requestData.offset = requestData.limit * ( responseData.numberPage - 1);
  currentBtn.innerHTML =  responseData.numberPage;
  const request = await getDataFromAPI(requestData);
  createCardsList(request)
    
  if ( responseData.numberPage === responseData.amountPages - 1) {
      nextBtn.addEventListener('click', moveRight);
      endBtn.addEventListener('click', moveRightMax);
      nextBtn.removeAttribute('disabled');
      nextBtn.classList.remove('not-active-btn');
      nextBtn.classList.add('active-btn');
      endBtn.removeAttribute('disabled');
      endBtn.classList.remove('not-active-btn');
      endBtn.classList.add('active-btn');
  }
};

async function moveRightMax() {
  if (currentBtn.innerHTML === "1") {
      startBtn.removeAttribute('disabled');
      startBtn.classList.remove('not-active-btn');
      startBtn.classList.add('active-btn');
      prevBtn.removeAttribute('disabled');
      prevBtn.classList.remove('not-active-btn');
      prevBtn.classList.add('active-btn');
      startBtn.addEventListener('click', moveLeftMax);
      prevBtn.addEventListener('click', moveLeft);
  }
  responseData.numberPage = responseData.amountPages;
  requestData.offset = requestData.limit * ( responseData.numberPage - 1);
  currentBtn.innerHTML =  responseData.numberPage;
  const request = await getDataFromAPI(requestData); 
  createCardsList(request)
    
  nextBtn.removeEventListener('click', moveRight);
  endBtn.removeEventListener('click', moveRightMax);
  nextBtn.setAttribute('disabled', true);
  nextBtn.classList.remove('active-btn');
  nextBtn.classList.add('not-active-btn');
  endBtn.setAttribute('disabled', true);
  endBtn.classList.remove('active-btn');
  endBtn.classList.add('not-active-btn');
};

async function moveLeftMax() {
  if ( responseData.numberPage = responseData.amountPages) {
      startBtn.removeEventListener('click', moveLeftMax);
      prevBtn.removeEventListener('click', moveLeft);
      startBtn.setAttribute('disabled', true);
      startBtn.classList.add('not-active-btn');
      startBtn.classList.remove('active-btn');
      prevBtn.setAttribute('disabled', true);
      prevBtn.classList.add('not-active-btn');
      prevBtn.classList.remove('active-btn');
  }
  responseData.numberPage = 1;
  requestData.offset = 0;
  currentBtn.innerHTML = 1;
  const request = await getDataFromAPI(requestData);
  createCardsList(request)
 
  currentBtn.innerHTML =  responseData.numberPage;
  nextBtn.addEventListener('click', moveRight);
  endBtn.addEventListener('click', moveRightMax);
  nextBtn.removeAttribute('disabled');
  nextBtn.classList.remove('not-active-btn');
  nextBtn.classList.add('active-btn');
  endBtn.removeAttribute('disabled');
  endBtn.classList.remove('not-active-btn');
  endBtn.classList.add('active-btn');
};

const createCardsList = (response) => {
  container.innerHTML = '';
  if (response.data.total === 0) {
    container.innerHTML = `
    <h1>No result!</h1>
    `
  }
  title.textContent = requestData.query;    
  response.data.results.forEach((item) => {
    let name = item.name;
    let imageURL = item.thumbnail 
    ? `${item.thumbnail["path"] + "." + item.thumbnail["extension"]}` 
    : 'assets/image_not_available.jpg';
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="image-container" style="background-image: url(${imageURL})"></div>
      <div class="content-card-container">
        <p class="card-name">${item.name || item.title || item.firstName}</p>
        <p class="card-description">${item.description || item.type || '* No Description'}</p>        
      </div>
    `
    container.appendChild(card);
  })
}

async function handleResponse(event) {
  navList.forEach((button) =>{
    button.classList.remove('active');
  })
  this.classList.add('active');
  setStartValues(20, event.target.dataset.query); 
  if (event.target.dataset.query === 'stories') {
    searchBtn.setAttribute('disabled', true);
    input.setAttribute('disabled', true);
  } else {
    searchBtn.removeAttribute('disabled', true);
    input.removeAttribute('disabled', true);
  }
  perPages[0].classList.add('active');
  requestData.query = event.target.dataset.query;
  reloadData();
}

async function setLimitPerPage(event) {
  perPages.forEach((btn) => {
    btn.classList.remove('active');
  })
  this.classList.add('active');
  
  requestData.limit = event.target.dataset.pages;
  requestData.offset = event.target.dataset.pages;
  setStartValues(requestData.limit, requestData.query);  
  reloadData(); 
}

async function reloadData() {
  const response = await getDataFromAPI(requestData);
  responseData.total = response.data.total;
  responseData.amountPages = Math.ceil(response.data.total / requestData.limit);
  checkTotal();
  createCardsList(response);
}

async function setSearchQuery() {
  requestData.limit = 20;
  requestData.offset = 0;
  setStartValues(requestData.limit, requestData.query);
  perPages[0].classList.add('active');
  requestData.searchQuery = input.value;
  reloadData();
  input.value = '';  
}

startBtn.addEventListener('click', moveLeftMax);
prevBtn.addEventListener('click', moveLeft);
nextBtn.addEventListener('click', moveRight);
endBtn.addEventListener('click', moveRightMax);

searchBtn.addEventListener('click', setSearchQuery);

window.onload = async () => {
reloadData();
navList[0].classList.add('active');
perPages[0].classList.add('active');
navList.forEach(item => item.addEventListener("click", handleResponse));
perPages.forEach(btn => btn.addEventListener("click", setLimitPerPage));
};