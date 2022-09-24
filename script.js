const form = document.getElementById("formSearch");
const inputSearch = document.getElementById("input-search");
const artistInput = document.getElementById("type-artist");
const albumInput = document.getElementById("type-album");
const trackInput = document.getElementById("type-track");


const containerCategoria = document.getElementById("container-data-categoria");
const containerLanzamientos = document.getElementById("container-data-lanzamientos");
const containerTracksList = document.getElementById("container-track-list");
const containerSearch = document.getElementById("contariner-buscador");

const containerResulSearh =  document.getElementById("container-result");
const containerResultTracks = document.getElementById("container-result-tracks");

const btnsPageCategories = document.getElementById("btns-pag-categories");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnsPagePlaylist = document.getElementById("btns-page-playlist");
const btnAnteriorPlay = document.getElementById("btnAnteriorPlay");
const btnSiguientePlay = document.getElementById("btnSiguientePlay");

const navBuscador = document.getElementById("navBuscador");
let offSetCat = 0; //Indice del primer elemento a devolver de las categorias.
let offSetPlay = 0; //Indice del primer elemento a devolver de las playlist.
let offsetAlbums = 0;
let idCat;
let totalElementsPlaylist;
let totalElements;
let categorie;

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
  data.tracks.items.forEach(item => {
    tracks += `<div class="tracks" id='${item.id}'>
                  <img class="cover track"  src='${item?.album?.images[2]?.url}'><h7>${item?.name}</h7><br>
                  <audio controls class="preview-track">
                      <source src="${item?.preview_url}" type="audio/mpeg">
                      Tu navegador no soporta elentos de audio.
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
};

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
    let tracks = "";
    data.tracks.items.forEach((item) => {
      tracks += `<li>${item.track.name}</li>`;
    })
    let cover = `<img class="img-fluid cover" src='${urlCover}'>`;
    let tracksList = `<ol>${tracks}</ol>`;
    containerTracksList.style.display = "flex";
    document.getElementById("cover-track-list").innerHTML = cover;
    document.getElementById("track-list").innerHTML = tracksList;
  })
};

const getPlaylistByCategoria = async (idCategoria) => {
  fetch(`https://api.spotify.com/v1/browse/categories/${idCategoria}/playlists?offset=${offSetPlay}&limit=12`, {
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
    btnsPagePlaylist.style.display = "block";
    btnsPageCategories.style.display = "none";
    idCat = idCategoria; // Guardo id de la categoria para reutilizarlo en la paginación.
    totalElementsPlaylist = data.playlists.total; // Total de elementos que retorna la petición.
    offSetCat = 0;
    let coverPlaylists = "";
    data.playlists.items.forEach(item => {
      coverPlaylists += `<div class="container playlist">
                            <img  class="img-fluid cover" id='${item.id}' src='${item.images[0].url}'>
                          </div>`;
    })
    containerCategoria.innerHTML = coverPlaylists;
    const playlists = document.querySelectorAll(".cover");
    for (let i = 0; i < playlists.length; i++) {
      playlists[i].addEventListener("click", (e) => {
        getTracksByPlaylist(e.target.id, e.target.currentSrc);
      })
    }
  })
};

const getCategorias = async () => {
  fetch(`https://api.spotify.com/v1/browse/categories?offset=${offSetCat}&limit=12`, {
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
    categorie = true;
    containerCategoria.style.display = "grid";
    containerLanzamientos.style.display = "none";
    containerSearch.style.display = "none";
    btnsPagePlaylist.style.display = "none";
    containerResulSearh.style.display = "none";
    btnsPageCategories.style.display = "block";
    totalElements = data.categories.total;
    offSetPlay = 0;
    offsetAlbums = 0;
    let coverCategorie = "";
    data.categories.items.forEach(item => {
    coverCategorie += `<div class="container categoria">
                          <img class="img-fluid cover" id='${item.id}' src='${item.icons[0].url}'>
                          <h6>${item.name}</h6>
                       </div>`;
    })
    containerCategoria.innerHTML = coverCategorie;
    const categorias = document.querySelectorAll(".cover");
    for (let i = 0; i < categorias.length; i++) {
      categorias[i].addEventListener("click", (e) => {
        getPlaylistByCategoria(e.target.id);
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
    console.log(data);
    btnsPageCategories.style.display = "none";
    let coverAlbum = `<div class=" categoria">
                          <img  class="img-fluid cover" src='${data.images[0].url}'>
                      </div>`;
    containerData.innerHTML = coverAlbum;
  })
};

const getLanzamientos = async () => {
  fetch(`https://api.spotify.com/v1/browse/new-releases?offset=${offsetAlbums}&limit=12`, {
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
    btnsPagePlaylist.style.display = "none";
    btnsPageCategories.style.display = "block";
    containerCategoria.style.display = "none";
    containerSearch.style.display = "none"
    containerResulSearh.style.display = "none";
    containerLanzamientos.style.display = "grid";
    containerTracksList.style.display = "none";
    categorie = false;
    console.log(data);
    totalElements = data.albums.total;
    offSetCat = 0;
    let coverLanzamientos = "";
    data.albums.items.forEach(item => {
    coverLanzamientos += `<div class="container lanzamiento">
                          <img class="img-fluid cover" id='${item.id}' src='${item.images[0].url}'>
                          <h6>${item.name}</h6>
                       </div>`;
    })
    containerLanzamientos.innerHTML = coverLanzamientos;
    const lanzamientos = document.querySelectorAll(".cover");
    for (let i = 0; i < lanzamientos.length; i++) {
      lanzamientos[i].addEventListener("click", (e) => {
        getAlbum(e.target.id);
      })
    }
  })
}

const search = async (value, artist, album, track, year, genero) => {
  fetch(`https://api.spotify.com/v1/search?q=${value}${year}${genero}&type=${artist}${album}${track}&market=US`,{
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
      if (data?.albums) {
        console.log("album");
        Toastify({
          text: "Cantidad de resultados que coincinciden con tu busquedad: " + data?.albums?.total,
          duration: 5000
          }).showToast();
        showAlbums(data); 
      }else if (data?.artists){
        Toastify({
          text: "Cantidad de resultados que coincinciden con tu busquedad: " + data?.artists?.total,
          duration: 5000
          }).showToast();
        showArtists(data);
      }else{
        Toastify({
          text: "Cantidad de resultados que coincinciden con tu busquedad: " + data?.tracks?.total,
          duration: 5000
          }).showToast();
        showTracks(data);
      }
    }).catch(function(error){
      console.log(error)
    });
};

btnSiguiente.addEventListener('click', () => {
  if (categorie){
    if (offSetCat <= (totalElements - 12)){
      offSetCat += 12;
      getCategorias();
   }
  }else{
    if (offsetAlbums <= (totalElements - 12)){
      offsetAlbums += 12;
      getLanzamientos();
    } 
  }
});  

btnAnterior.addEventListener('click', () => {
  if (categorie){
      if (offSetCat >= 12){
      offSetCat -= 12;
      getCategorias();
    }
  }else{
    if (offsetAlbums >= 12){
      offsetAlbums -= 12;
      getLanzamientos();
    }
  }  
});

btnSiguientePlay.addEventListener('click', () => {
  if (offSetPlay <=  (totalElementsPlaylist - 12)){
    offSetPlay += 12;
    getPlaylistByCategoria(idCat);
   }
});

btnAnteriorPlay.addEventListener('click', () => {
  if (offSetPlay >= 12){
    offSetPlay -= 12;
    getPlaylistByCategoria(idCat);
   }
});

function showSearch (){
  containerSearch.style.display = "block"
  btnsPageCategories.style.display = "none";
  btnsPagePlaylist.style.display = "none";
  containerCategoria.style.display = "none";
  containerLanzamientos.style.display = "none";
  containerTracksList.style.display = "none"; 
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let year;
  let genre;
  form.año.value ? year = "%20year:" + form.año.value : year = " ";
  form.genero.value ? genre = "%20genre:" + form.genero.value : genre = " ";
  if (trackInput.checked == true) {
    search(form.search.value, "", "", trackInput.value, year, genre);
  } else if (albumInput.checked == true) {
    search(form.search.value, "", albumInput.value, "", year, genre);
  } else {
    search(form.search.value, artistInput.value, "", "", year, genre);
  }
});

window.onload = () =>{
  getToken();
}
getCategorias();