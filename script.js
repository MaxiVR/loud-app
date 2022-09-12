// Call the API
// This is a POST request, because we need the API to generate a new token for us

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
/*
const cargarAlbums = async () => {
  fetch("https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy", {
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
    console.log(data.images[1]);
    let cover = data.images[1].url;
    let artista = `<div class='artista'>
                      <img class"cover" src='${cover}'>
                    </div>`;

    document.getElementById('contenedor').innerHTML = artista;
  })
};*/

function cargarCover(data) {
  /*let cover = data.albums.items[1].images[1].url;
  let artista = `<div class='artista'>
                      <img class"cover" src='${cover}'>
                    </div>`;
  */
  let cover = "";
  data.albums.items.forEach(item => { 
    cover += `<div class='artista'>
                <img class"cover" src='${item.images[1].url}'>
                <h6>${item.name}</h6>
              </div>`;
  });
  
  document.getElementById("contenedor").innerHTML = cover;
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
    document.getElementById("container-track-list").style.display = "flex";
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
    document.getElementsByClassName("btn-playlist")[0].style.display = "block";
    document.getElementsByClassName("btn-categories")[0].style.display = "none";
    idCat = idCategoria;
    console.log(data);
    total = data.playlists.total;
    offSetCat = 0;
    let coverPlaylists = "";
    data.playlists.items.forEach(item => {
      coverPlaylists += `<div class="playlist">
                            <img  class="img-fluid cover" id='${item.id}' src='${item.images[0].url}'>
                          </div>`;
    })
    document.getElementById("container-data").innerHTML = coverPlaylists;   
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
    document.getElementsByClassName("btn-playlist")[0].style.display = "none";
    document.getElementsByClassName("btn-categories")[0].style.display = "block";
    offSetPlay = 0;
    let coverCategorie = "";
    data.categories.items.forEach(item => { 
    coverCategorie += `<div class="col categoria">
                          <img class="img-fluid cover" id='${item.id}' src='${item.icons[0].url}'>
                          <h6>${item.name}</h6>
                       </div>`;   
    })
    document.getElementById("container-data").innerHTML = coverCategorie;        
    const categorias = document.querySelectorAll(".cover");
    for (let i = 0; i < categorias.length; i++) {
      categorias[i].addEventListener("click", (e) => {
        getPlaylistByCategoria(e.target.id);
      })
    }
  })
}

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnAnteriorPlay = document.getElementById("btnAnteriorPlay");
const btnSiguientePlay = document.getElementById("btnSiguientePlay");
let offSetCat = 0;
let offSetPlay = 0;
let idCat;
let total;

btnSiguiente.addEventListener('click', () => {
  if (offSetCat <= 36){
    offSetCat += 12;
     getCategorias();   
   }
  });  
btnAnterior.addEventListener('click', () => {
  if (offSetCat >= 12){
    offSetCat -= 12;
    getCategorias();
  }
});

btnSiguientePlay.addEventListener('click', () => {
  console.log(total);
  console.log(offSetPlay);
  if (offSetPlay <=  (total - 12)){
    offSetPlay += 12;
    getPlaylistByCategoria(idCat);   
   }
});

btnAnteriorPlay.addEventListener('click', () => {
  console.log(total);
  console.log(offSetPlay);
  if (offSetPlay >= 12){
    offSetPlay -= 12;
    getPlaylistByCategoria(idCat);   
   }
});

const searchAlbum = async (value, artist, album, track) => {
  fetch(
    `https://api.spotify.com/v1/search?q=${value}&type=${artist}${album}${track}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("token"),
        Host: "api.spotify.com",
      },
    }
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      console.log(data);
      cargarCover(data);
    });
};


const form = document.getElementById("form");
const search = document.getElementById("search");
const artist = document.getElementById("type-artist");
const album = document.getElementById("type-album");
const track = document.getElementById("type-track");
const navCategorie = document.getElementById("navCategorie");

//cargarAlbums();
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (document.getElementById("type-track").checked == true) {
    searchAlbum(search.value, "", "", track.value);
  } else if (document.getElementById("type-album").checked == true) {
    searchAlbum(search.value, "", album.value, "");
  } else {
    searchItem(search.value, artist.value, "", "");
  }
});

navCategorie.addEventListener("click", () => getCategorias()) 
//getPlaylist();
//getTrackByPlaylist();

window.onload = () =>{
  getToken();
}
getCategorias();