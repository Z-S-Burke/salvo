new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/user_games",
            games: [],
            players_URL: "http://localhost:8080/api/playerList",
            players: [],
            proxy_URL: "proxyUrl: 'https://cors-anywhere.herokuapp.com/"
        };
    },
    methods: {
        getData(proxy_URL, games_URL) {
            fetch(games_URL, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    mode: "cors"
                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    this.games = data;
                    //console.log(Object.entries(this.games)); 
                    //this.games = this.convertObjects(this.games);
                    //this.games = this.games[1];
                })
                .catch(err => console.log(err))
        },
        convertObjects(dataObject) {
            let result = Object.keys(dataObject).map(function (key) {
                return [Number(key), dataObject[key]];
            });
            return result;
        },
        listGames(games) {
            let listAnchor = document.getElementById("game_list");
            document.createElement("ol")
        },
        login() {
            getData(this.proxy_URL, this.players_URL);
            let username = document.getElementById("loginUsername").innerHTML;
            let password = document.getElementById("loginPassword").innerHTML;

            // let loginAnchor = document.getElementById("login-form");
            // let username = document.createElement("label"); username.inputMode("text"); username.innerHTML("Username...");
            // let password = document.createElement("label"); password.inputMode("text"); password.innerHTML("Password...");
            // let submit = document.createElement("button"); submit.id = "submit-btn"; submit.innerHTML("Log In");
            // loginAnchor.appendChild(username); loginAnchor.appendChild(password); loginAnchor.appendChild(submit);
        }   
    },
    mounted() {
        this.getData(this.proxy_URL, this.games_URL);
    }
});