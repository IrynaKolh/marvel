const BASE_URL = "https://gateway.marvel.com:443/v1/public/";
const API_KEY = "add you api key";
const PRIV_KEY = "add your private key";

const navList = document.querySelectorAll('.navigation-item');
const container = document.getElementById('cards-container');
const title = document.getElementById('title');

const getDataFromAPI = async (query) => {
  try {
    let ts = new Date().getTime();
    let hash = CryptoJS.MD5(ts + PRIV_KEY + API_KEY).toString();
    const url = `${BASE_URL}${query}?ts=${ts}&apikey=${API_KEY}&hash=${hash}`;
    const res = await fetch(url);
    const response = await res.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};

async function handleResponse(event) {
  navList.forEach((button) =>{
    button.classList.remove('active');
  })
  this.classList.add('active');

  container.innerHTML = '';
  let query = event.target.dataset.query;
  
  title.textContent = query;  
  
  const response = await getDataFromAPI(query);
  console.log(response);
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
        <p class="card-description">${item.description || item.type || '* Description not available.'}</p>        
      </div>
    `
    container.appendChild(card);
  })
}

navList.forEach(item => item.addEventListener("click", handleResponse));

