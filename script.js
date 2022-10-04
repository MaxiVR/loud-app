class Usuario{
    constructor (username, generoFav, periodoFav){
      this.username = username;
      this.generoFav = generoFav;
      this.periodoFav = periodoFav;
      this.urlQuery = `https://api.spotify.com/v1/search?q=%20year:${periodoFav}%20genre:${generoFav}&type=artist&limit=30`;
    }

    //Metodos

    get user(){
      return this.username;
    }

    recomendar(){
      search(this.urlQuery);
    }
}

const formSearch = document.getElementById("formSearch");
const formUser = document.getElementById("formUser");
const inputSearch = document.getElementById("input-search");
const artistInput = document.getElementById("type-artist");
const albumInput = document.getElementById("type-album");
const trackInput = document.getElementById("type-track");

const containerCategoria = document.getElementById("container-categoria");
const containerDataCategoria = document.getElementById("container-data-categoria");
const containerLanzamientos = document.getElementById("container-lanzamientos");
const containerDataLanzamientos = document.getElementById("container-data-lanzamientos");
const containerTracksList = document.getElementById("container-track-list");
const containerRecommendation = document.getElementById("container-recommendation");
const containerDataRecommendation = document.getElementById("container-data-recommendation");
const containerTracksRecommendation = document.getElementById("container-tracks-recommendation");
const containerTitle = document.getElementById("title-recommendation");

const containerSearch = document.getElementById("container-buscador");
const containerResulSearh =  document.getElementById("container-result");
const containerResultTracks = document.getElementById("container-result-tracks");

const btnSiguienteCat = document.getElementById("btnSiguienteCat");
const btnAnteriorCat = document.getElementById("btnAnteriorCat");
const btnsPageReleases = document.getElementById("btns-page-releases");
const btnSiguienteReleases = document.getElementById("btnSiguienteReleases");
const btnAnteriorReleases = document.getElementById("btnAnteriorReleases");
const btnSiguienteSearch = document.getElementById("btnSiguienteSearch");
const btnAteriorSearch = document.getElementById("btnAnteriorSearch");

const navBuscador = document.getElementById("navBuscador");

let isCategorie;
let isRecommendation = true;
const urlBase = "https://api.spotify.com/v1/";
const urlCategorie = urlBase + "browse/categories?country=US&limit=12";
const urlLazamientos = urlBase + "browse/new-releases?limit=12";

let urlNext;
let urlPrevious;

// Call the API

const getToken = async () => {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body:
      "grant_type=client_credentials&client_id=" +
      "bb8ead2e246c4f41832bc51bce1e7fa5" +
      "&client_secret=" +
      "d94b7394f9f34779ad48d63b5914b536",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (resp) {
      // Return the response as JSON
      return resp.json();
    })
    .then(function (data) {
      // Log the API data
      //console.log("token", data);
      window.localStorage.setItem("token", data.access_token);
    })
    .catch(function (err) {
      // Log any errors
      console.log("something went wrong", err);
    });
}

function createHTML (item){
  let cover = `<div class='artista'>
                <img class="cover" id="${item?.id}" src='${item?.images[1]?.url}'>
                <h6>${item?.name}</h6>
              </div>`;
  return cover;
}

function showAlbums(data) {
  containerResultTracks.style.display = "none";
  let covers = "";
  data?.albums?.items.forEach(item => {covers += createHTML(item)});
  containerResulSearh.innerHTML = covers;
}

function showArtists(data) {
  containerResultTracks.style.display = "none";
  let covers = "";
  data?.artists?.items.forEach(item => {covers += createHTML(item)});
  containerResulSearh.innerHTML = covers;
}

function showTracks (data){
  console.log(data);
  containerResulSearh.style.display = "none";
  containerResultTracks.style.display = "grid";
  let tracks = "";
  data?.tracks?.items.forEach(item => {
    tracks += `<div class="tracks" id='${item.id}'>
                  <img class="cover track"  src='${item?.album?.images[2]?.url}'><h7>${item?.name}</h7><br>
                  <audio controls class="preview-track">
                      <source src="${item?.preview_url}" type="audio/mpeg">
                      Tu navegador no soporta elementos de audio.
                  </audio>
              </div>`
  })
  containerResultTracks.innerHTML = tracks;
}

function showRecomendation (data){
    containerRecommendation.style.display = "block";
    containerLanzamientos.style.display = "none";
    containerCategoria.style.display = "none";
    containerSearch.style.display = "none"
    containerResulSearh.style.display = "none";
    containerTracksList.style.display = "none";
    containerResultTracks.style.display = "none";
    let cover = "";
    data.artists.items.forEach(item => {cover += createHTML(item)});
    containerDataRecommendation.innerHTML = cover;
    const artist = document.querySelectorAll(".artista");
    for (let i = 0; i < artist.length; i++) {
        artist[i].addEventListener("click", (e) => {
        getArtistTopTracks(urlBase + `artists/${e.target.id}/top-tracks?market=AR`);
      })
    }
}

function recomendation(){
  containerRecommendation.style.display = "block";
  containerDataRecommendation.style.display = "grid";
  containerTracksRecommendation.style.display = "none";
  containerLanzamientos.style.display = "none";
  containerCategoria.style.display = "none";
  containerSearch.style.display = "none"
  containerResulSearh.style.display = "none";
  containerTracksList.style.display = "none";
}

const getArtistTopTracks = async (url) => {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + window.localStorage.getItem('token'),
      'Host': "api.spotify.com",
    }
  }).then(function (resp){
	return resp.json();
  })
  .then(function (data) {
    let tracksHTML = "";
    containerDataRecommendation.style.display = "none";
    console.log(data);
    data?.tracks.forEach(item => {
    tracksHTML += `<div class="tracks" id='${item?.id}'>
                    <img class="cover track"  src='${item?.album?.images[2]?.url}'><h7>${item?.name}</h7><br>
                    <audio controls class="preview-track">
                        <source src="${item?.preview_url}" type="audio/mpeg">
                        Tu navegador no soporta elementos de audio.
                    </audio>
                  </div>`
    })
    containerTracksRecommendation.innerHTML = tracksHTML;
    containerTracksRecommendation.style.display = "grid";
  })
}

const getPlaylist = async () => {
  fetch(`https://api.spotify.com/v1/browse/categories/toplists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + window.localStorage.getItem('token'),
      'Host': "api.spotify.com",
    }
  }).then(function (resp){
	return resp.json();
  })
  .then(function (data) {
    console.log("play", data);
  })
}

const getTracksByPlaylist = async (idTrackList, urlCover) => {
  fetch(`https://api.spotify.com/v1/playlists/${idTrackList}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + window.localStorage.getItem('token'),
      'Host': "api.spotify.com",
    }
  }).then(function (resp){
	return resp.json();
  })
  .then(function (data) {
    console.log(data)
    let tracks = "";
    data?.tracks?.items.forEach((item) => {
      tracks += `<li>${item?.track?.name}</li>`;
    })
    let cover = `<img class="img-fluid cover" src='${urlCover}'>`;
    let tracksList = `<ol>${tracks}</ol>`;
    containerTracksList.style.display = "flex";
    document.getElementById("cover-track-list").innerHTML = cover;
    document.getElementById("track-list").innerHTML = tracksList;
  })
}

const getPlaylistByCategoria = async (urlPlaylist) => {
  fetch(urlPlaylist, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + window.localStorage.getItem('token'),
      'Host': "api.spotify.com",
    }
  }).then(function (resp){
	return resp.json();
  })
  .then(function (data) {
    console.log(data);
    isCategorie = false;
    urlNext = data?.playlists?.next;
    urlPrevious = data?.playlists?.previous;
    let coverPlaylists = "";
    data.playlists.items.forEach(item => {
      coverPlaylists += `<div class="container playlist">
                            <img  class="img-fluid cover" id='${item?.id}' src='${item?.images[0]?.url}'>
                          </div>`;
    })
    containerDataCategoria.innerHTML = coverPlaylists;
    const playlists = document.querySelectorAll(".cover");
    for (let i = 0; i < playlists.length; i++) {
      playlists[i].addEventListener("click", (e) => {
        getTracksByPlaylist(e.target.id, e.target.currentSrc);
      })
    }
  })
}

const getCategorias = async (url) => {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + window.localStorage.getItem('token'),
      'Host': "api.spotify.com",
    }
  }).then(function (resp){
	return resp.json();
  })
  .then(function (data) {
    isCategorie = true;
    containerTracksList.style.display = "none";
    containerCategoria.style.display = "block";
    containerLanzamientos.style.display = "none";
    containerSearch.style.display = "none";
    containerResulSearh.style.display = "none";
    containerRecommendation.style.display = "none";
    let coverCategorie = "";
    urlNext = data?.categories?.next;
    urlPrevious = data?.categories?.previous;
    data.categories.items.forEach(item => {
    coverCategorie += `<div class="container categoria">
                          <img class="img-fluid cover" id='${item.id}' src='${item.icons[0].url}'>
                          <h6>${item.name}</h6>
                       </div>`;
    })
    containerDataCategoria.innerHTML = coverCategorie;
    const categorias = document.querySelectorAll(".cover");
    for (let i = 0; i < categorias.length; i++) {
      categorias[i].addEventListener("click", (e) => {
        getPlaylistByCategoria(urlBase + `browse/categories/${e.target.id}/playlists?limit=12`);
      })
    }
  })
}


const getAlbum = async (idAlbum) => {
  fetch(`https://api.spotify.com/v1/albums/${idAlbum}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + window.localStorage.getItem('token'),
      'Host': "api.spotify.com",
    }
  }).then(function (resp){
	return resp.json();
  })
  .then(function (data) {
    btnsPageReleases.style.display = "none";
    let coverAlbum = `<div class=" categoria">
                          <img  class="img-fluid" src='${data?.images[0]?.url}'>
                      </div>
                      <ul class="info-album">
                        <li>Artista: ${data?.artists[0]?.name}</li>
                        <li>Album/Simple: ${data?.name}</li>
                        <li>Fecha De Lanzamiento: ${data?.release_date}</li>
                        <li>Tipo De Lanzamiento: ${data?.album_type}</li>
                      </ul>`
    let tracks = "";
    data.tracks.items.forEach((item) => {
    tracks += `<li>${item?.name}</li>`;})
    let tracksList = `<ol>${tracks}</ol>`;
    containerDataLanzamientos.style.display =  "block";                       
    containerDataLanzamientos.innerHTML = coverAlbum + tracksList;
  })
}

const getLanzamientos = async (urlLazamientos) => {
  fetch(urlLazamientos, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': "Bearer " + window.localStorage.getItem('token'),
      'Host': "api.spotify.com",
    }
  }).then(function (resp){
	return resp.json();
  })
  .then(function (data) {
    containerLanzamientos.style.display = "block";
    btnsPageReleases.style.display = "block";
    containerCategoria.style.display = "none";
    containerSearch.style.display = "none"
    containerResulSearh.style.display = "none";
    containerTracksList.style.display = "none";
    containerRecommendation.style.display = "none";
    urlNext = data?.albums.next;
    urlPrevious = data?.albums.previous;
    console.log(data);
    let coverLanzamientos = "";
    data.albums.items.forEach(item => {
    coverLanzamientos += `<div class="container lanzamiento">
                          <img class="img-fluid cover" id='${item.id}' src='${item.images[0].url}'>
                          <h6>${item.name}</h6>
                       </div>`;
    })
    containerDataLanzamientos.style.display = "grid";
    containerDataLanzamientos.innerHTML = coverLanzamientos;
    const lanzamientos = document.querySelectorAll(".cover");
    for (let i = 0; i < lanzamientos.length; i++) {
      lanzamientos[i].addEventListener("click", (e) => {
        getAlbum(e.target.id);
      })
    }
  })
}

const search = async (urlSearch) => {
  fetch(urlSearch ,{
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer " + window.localStorage.getItem("token"),
        "Host": "api.spotify.com",
      },
    }
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      containerResulSearh.style.display = "grid";
      urlNext = data?.albums?.next;
      urlPrevious = data?.albums?.previous;
      if (data?.albums) {
        urlNext = data?.albums?.next;
        urlPrevious = data?.albums?.previous;
        Toastify({
          text: "Cantidad de resultados que coincinciden con tu busquedad: " + data?.albums?.total,
          duration: 5000
          }).showToast();
        showAlbums(data); 
      }else if (data?.artists){
        urlNext = data?.artists?.next;
        urlPrevious = data?.artists?.previous;
        if (isRecommendation){
          showRecomendation(data);
        }else{
          Toastify({
          text: "Cantidad de resultados que coincinciden con tu busquedad: " + data?.artists?.total,
          duration: 5000
          }).showToast();
          showArtists(data); 
        }
      }else{
        urlNext = data?.tracks?.next;
        urlPrevious = data?.tracks?.previous;
        Toastify({
          text: "Cantidad de resultados que coincinciden con tu busquedad: " + data?.tracks?.total,
          duration: 5000
          }).showToast();
        showTracks(data);
      }
    }).catch(function(error){
      console.log(error)
    });
}

btnSiguienteCat.addEventListener('click', () => {
  if (urlNext != null){
    if (isCategorie){
      getCategorias(urlNext)
    }else{
      getPlaylistByCategoria(urlNext);
    } 
  }
})

btnAnteriorCat.addEventListener('click', () => {
  if (urlPrevious != null){
    if (isCategorie){
      getCategorias(urlPrevious);
    }else{
      getPlaylistByCategoria(urlPrevious);
    }  
  }
})

btnSiguienteReleases.addEventListener('click', () => {
  if (urlNext != null) getLanzamientos(urlNext)
})

btnAnteriorReleases.addEventListener('click', () => {
  if (urlPrevious != null) getLanzamientos(urlPrevious)
})

btnSiguienteSearch.addEventListener('click', () =>{
  if (urlNext != null) search(urlNext)
})

btnAteriorSearch.addEventListener('click', () =>{
  if (urlPrevious != null) search(urlPrevious)
})

function showSearch (){
  containerSearch.style.display = "block"
  containerCategoria.style.display = "none";
  containerLanzamientos.style.display = "none";
  containerTracksList.style.display = "none"; 
  containerRecommendation.style.display = "none";
  containerResulSearh.innerHTML = " ";
}

function formQuerySearch (){
  let year;
  let genre;
  formSearch.año.value ? year = "%20year:" + formSearch.año.value : year = " ";
  formSearch.genero.value ? genre = "%20genre:" + formSearch.genero.value : genre = " ";
  if (trackInput.checked == true) {
    search (urlBase + "search?q=" + formSearch.search.value + year + genre + "&type=track");
  } else if (albumInput.checked == true) {
    search(urlBase + "search?q=" + formSearch.search.value + year + genre + "&type=album");
  } else {
    search(urlBase + "search?q=" + formSearch.search.value + year + genre + "&type=artist");
  }
}

function lanzamientos (){
  getLanzamientos(urlLazamientos);
}

function categorias (){
  getCategorias(urlCategorie);
}

formUser.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario1 = new Usuario (formUser.username.value, formUser.genero.value, formUser.periodo.value);
  console.log(usuario1.user);
  usuario1.recomendar();
  formUser.style.display = "none";
  containerTitle.innerHTML = `<h1 class="titulos">Especial para ${usuario1.user}</h1>`;
})

formSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  isRecommendation = false;
  formQuerySearch();
})

window.onload = () =>{
  getToken();
  containerLanzamientos.style.display = "none";
  containerCategoria.style.display = "none";
  containerSearch.style.display = "none"
  containerResulSearh.style.display = "none";
  containerTracksList.style.display = "none";
}

