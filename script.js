// Call the API
// This is a POST request, because we need the API to generate a new token for us

const getToken = async() => {
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

    console.log("token", data);
	  window.localStorage.setItem('token', data.access_token);
  })
  .catch(function (err) {
    // Log any errors
    console.log("something went wrong", err);
  });
}

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
};

const searchItem = async (value, artist, album, track) => {
  fetch(`https://api.spotify.com/v1/search?q=${value}&type=${artist}${album}${track}`, {
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
    let cover = data.albums.items[1].images[1].url;
    let artista = `<div class='artista'>
                      <img class"cover" src='${cover}'>
                    </div>`;

    document.getElementById('contenedor').innerHTML = artista;
  })
};



const form = document.getElementById("form");
const search = document.getElementById("search");
const artist = document.getElementById("type-artist");
const album = document.getElementById("type-album");
const track = document.getElementById("type-track");
getToken();
//cargarAlbums();
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(artist.value, album.value, track.value);
  if (document.getElementById("type-track").checked == true){
    searchItem(search.value, "", "", track.value);
  }
  //searchItem(search.value, artist.value, album.value, track.value);
})
