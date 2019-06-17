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
        getData(proxy_URL, playes_URL) {
            fetch(players_URL, {
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
                })
                .catch(err => console.log(err))
        },
        login() {
            // getData(this.proxy_URL, this.players_URL);
            // let username = document.getElementById("loginUsername").innerHTML;
            // let password = document.getElementById("loginPassword").innerHTML;
        }   
    },
    mounted() {
        // this.getData(this.proxy_URL, this.games_URL);
        this.login();
    }
});