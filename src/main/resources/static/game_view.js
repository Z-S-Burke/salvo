new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/gameplayers/",
            players: [],
            proxy_URL: "proxyUrl: 'https://cors-anywhere.herokuapp.com/",
            numeralArray: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            alphaArray: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
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
                })
                .catch(err => console.log(err))
        },
        mainGridMaker(numeralArray, alphaArray) {
            const table = document.getElementById("shipGrid");
            table.className = "board";
            numeralArray.forEach(numeral => {
                let row = table.insertRow();
                alphaArray.forEach(alpha => {
                    let cell = row.insertCell();
                    cell.innerHTML = numeral + alpha;
                    cell.id = numeral + alpha;
                    cell.className = "grid-cell text-light text-center";
                })
            })
        }, 
        hitGridMaker(numeralArray, alphaArray) {
            const table = document.getElementById("hitGrid");
            numeralArray.forEach(numeral => {
                let row = table.insertRow();
                alphaArray.forEach(alpha => {
                    let cell = row.insertCell();
                    cell.innerHTML = numeral + alpha;
                    cell.id = numeral + alpha;
                    cell.className = "p-1 text-light border border-light text-center"
                    this.shipLocator(this.players);
                })
            })
        }, 
        shipLocator(players) {
            let target = [];
            players.forEach(player => {
                if (player.ships) {
                    console.log(player.ships.locationOnBoard)
                    target = player.ships.locationOnBoard;
                }
            })
        }
    },
    mounted() {
        this.getData(this.proxy_URL, this.games_URL);
    }
});