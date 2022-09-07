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

const getTrackByPlaylist = async () => {
  fetch(`https://api.spotify.com/v1/playlists/37i9dQZF1DWZU5DGR2xCSH`, {
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
    console.log("tracks", data.tracks);
  })
};

 
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

const getCategorias = async () => {
  fetch(`https://api.spotify.com/v1/browse/categories?offset=${offSet}&limit=12`, {
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
    console.log("categorias",data);
    let cover = "";
    data.categories.items.forEach(item => { 
    cover += `<div class="categoria">
                <a ><img class="cover" id='${item.id}' src='${item.icons[0].url}'></a>
                <h6>${item.name}</h6>
              </div>
              `;
              
    document.getElementById("contenedor").innerHTML = cover;        
    
    const categorias = document.querySelectorAll(".cover");
      for (let i = 0; i < categorias.length; i++) {
        categorias[i].addEventListener("click", (e) => {
          getPlaylistByCategoria(e.target.id);
          console.log(e.target.id);
        })
      }
    })
  })
}


const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
let offSet = 0;

btnSiguiente.addEventListener('click', () => {
  offSet += 12;
  getCategorias();
})

btnAnterior.addEventListener('click', () => {
  offSet -= 12;
  getCategorias();
})


const getPlaylistByCategoria = async (idCategoria) => {
  fetch(`https://api.spotify.com/v1/browse/categories/${idCategoria}/playlists`, {
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
    console.log("catPlay", data);
    
  })
};

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

//getPlaylistByCategoria();
//getPlaylist();
//getTrackByPlaylist();

window.onload = () =>{
  getToken();
  getCategorias();
}
