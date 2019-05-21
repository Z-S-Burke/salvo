new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/games/game_info",
            games: [],
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
        }
    },
    mounted() {
        this.getData(this.proxy_URL, this.games_URL);
    }
});