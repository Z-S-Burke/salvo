new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/gameplayers/",
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
                    this.players = data;
                    console.log(Object.entries(this.players)); 
                })
                .catch(err => console.log(err))
        },
        convertObjects(dataObject) {
            let result = Object.keys(dataObject).map(function (key) {
                return [Number(key), dataObject[key]];
            });
            return result;
        }
    },
    mounted() {
        this.getData(this.proxy_URL, this.games_URL);
    }
});