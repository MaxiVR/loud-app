const form = document.getElementById("formSearch");
const inputSearch = document.getElementById("input-search");
const artistInput = document.getElementById("type-artist");
const albumInput = document.getElementById("type-album");
const trackInput = document.getElementById("type-track");

const containerCategoria = document.getElementById("container-categoria");
const containerDataCategoria = document.getElementById("container-data-categoria");
const containerLanzamientos = document.getElementById("container-lanzamientos");
const containerDataLanzamientos = document.getElementById("container-data-lanzamientos");
const containerTracksList = document.getElementById("container-track-list");

const containerSearch = document.getElementById("container-buscador");
const containerResulSearh =  document.getElementById("container-result");
const containerResultTracks = document.getElementById("container-result-tracks");

const btnSiguienteCat = document.getElementById("btnSiguienteCat");
const btnAnteriorCat = document.getElementById("btnAnteriorCat");
const btnSiguienteReleases = document.getElementById("btnSiguienteReleases");
const btnAnteriorReleases = document.getElementById("btnAnteriorReleases");
const btnSiguienteSearch = document.getElementById("btnSiguienteSearch");
const btnAteriorSearch = document.getElementById("btnAnteriorSearch");

const navBuscador = document.getElementById("navBuscador");

let categorie;
const urlBase = "https://api.spotify.com/v1/";
let urlCategorie = urlBase + "browse/categories?country=US&limit=12";
let urlLazamientos = urlBase + "browse/new-releases?limit=12";

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
};

function showAlbums(data) {
  containerResultTracks.style.display = "none";
  let cover = "";
  data.albums.items.forEach(item => {
    cover += `<div class='artista'>
                <img class="cover" src='${item?.images[1]?.url}'>
                <h6>${item.name}</h6>
              </div>`;
  });
  containerResulSearh.innerHTML = cover;
}

function showArtists(data) {
  containerResultTracks.style.display = "none";
  let cover = "";
  data.artists.items.forEach(item => {
    cover += `<div class='artista'>
                <img class="cover" src='${item?.images[1]?.url}'>
                <h6>${item.name}</h6>
              </div>`;
  });
  containerResulSearh.innerHTML = cover;
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
    categorie = false;
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
    categorie = true;
    containerTracksList.style.display = "none";
    containerCategoria.style.display = "block";
    containerLanzamientos.style.display = "none";
    containerSearch.style.display = "none";
    containerResulSearh.style.display = "none";
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
                      <ul>
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
    containerCategoria.style.display = "none";
    containerSearch.style.display = "none"
    containerResulSearh.style.display = "none";
    containerTracksList.style.display = "none";
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
        Toastify({
          text: "Cantidad de resultados que coincinciden con tu busquedad: " + data?.artists?.total,
          duration: 5000
          }).showToast();
        showArtists(data);
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
    if (categorie){
      getCategorias(urlNext)
    }else{
      getPlaylistByCategoria(urlNext);
    } 
  }
})

btnAnteriorCat.addEventListener('click', () => {
  if (urlPrevious != null){
    if (categorie){
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
}

function formQuerySearch (){
  let year;
  let genre;
  form.año.value ? year = "%20year:" + form.año.value : year = " ";
  form.genero.value ? genre = "%20genre:" + form.genero.value : genre = " ";
  if (trackInput.checked == true) {
    search (urlBase + "search?q=" + form.search.value + year + genre + "&type=track");
  } else if (albumInput.checked == true) {
    search(urlBase + "search?q=" + form.search.value + year + genre + "&type=album");
  } else {
    search(urlBase + "search?q=" + form.search.value + year + genre + "&type=artist");
  }
}

function lanzamientos (){
  getLanzamientos(urlLazamientos);
}

function categorias (){
  getCategorias(urlCategorie);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formQuerySearch();
})

window.onload = () =>{
  getToken();
}
getCategorias(urlCategorie);