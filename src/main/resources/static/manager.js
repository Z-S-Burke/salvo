// new Vue({
//     el: "#app",
//     data() {
//         return {
//             url: "http://localhost:8080/players",
//             players: [],
//             proxyUrl: 'https://cors-anywhere.herokuapp.com/'
//         };
//     },
//     methods: {
//         getData(proxyUrl, url) {
//             console.log(url)
//             fetch(url, {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 })
//                 .then(response => {
//                     console.log("response")
//                     return response.json();
//                 })
//                 .then(data => {
//                     this.players = data;
//                     this.showOutput(this.players);
//                 })
//                 .catch(err => console.log(err))
//             // axios.get(url)
//             // .then(function (response) {
//             //     console.log(response);
//             //     return response.json()
//             // })
//             // .then(data => {
//             //     console.log(data)
//             //     this.players = data;
//             // })
//             // .catch(function (error) {
//             //     console.log(error);
//             // });
//         },
//         postPlayer(userName) {
//             post({
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 dataType: "text",
//                 data: JSON.stringify({
//                     "username": userName
//                 })
//             })
//         },
//         loadData() {
//             fetch("/players")
//                 .then(function (data) {
//                     showOutput(JSON.stringify(data, null, 2));
//                 })
//         },
//         addPlayer() {
//             let name = username.val();
//             if (name) {
//                 postPlayer(name);
//             }
//         },
//         showOutput(text) {
//             document.getElementById("output").innerHTML = text;
//         }
//     },
//     mounted() {
//         this.getData(this.proxyUrl, this.url);
//     }
// });


$(function() {

    // display text in the output area
    function showOutput(text) {
      $("#output").text(text);
    }
  
    // load and display JSON sent by server for /players
  
    function loadData() {
      $.get("/players")
      .done(function(data) {
        showOutput(JSON.stringify(data, null, 2));
      })
      .fail(function( jqXHR, textStatus ) {
        showOutput( "Failed: " + textStatus );
      });
    }
  
    // handler for when user clicks add person
  
    function addPlayer() {
      var name = $("#email").val();
      if (name) {
        postPlayer(name);
      }
    }
  
    // code to post a new player using AJAX
    // on success, reload and display the updated data from the server
  
    function postPlayer(userName) {
      $.post({
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: "text",
        url: "/players",
        data: JSON.stringify({ "username": userName })
      })
      .done(function( ) {
        showOutput( "Saved -- reloading");
        loadData();
      })
      .fail(function( jqXHR, textStatus ) {
        showOutput( "Failed: " + textStatus );
      });
    }
  
    $("#add_player").on("click", addPlayer);
  
    loadData();
  });