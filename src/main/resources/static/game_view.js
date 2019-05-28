new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/gameplayers/",
            ships_URL: "http://localhost:8080/api/ships",
            players: [],
            hits: [],
            misses: [],
            p1: [],
            p2: [],
            ships: [],
            proxy_URL: "proxyUrl: 'https://cors-anywhere.herokuapp.com/",
            numeralArray: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            alphaArray: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        };
    },
    methods: {
        getPlayerData(proxy_URL, games_URL) {
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
                    this.players = data;
                    this.p1 = data[0];
                    this.p2 = data[1];
                    this.mainGridMaker(this.numeralArray, this.alphaArray);
                    this.hitGridMaker(this.numeralArray, this.alphaArray);

                })
                .catch(err => console.log(err))
        },
        mainGridMaker(numeralArray, alphaArray) {
            const table = document.getElementById("shipGrid");
            table.className = "board";
            alphaArray.forEach(alpha => {
                let row = table.insertRow();
                numeralArray.forEach(numeral => {
                    let cell = row.insertCell();
                    cell.innerHTML = alpha + numeral;
                    cell.id = alpha + numeral;
                    cell.className = "grid-cell text-light text-center";
                })
            })
            this.mainShipLocator(this.p1, this.p2);
        },
        hitGridMaker(numeralArray, alphaArray) {
            const table = document.getElementById("hitGrid");
            alphaArray.forEach(alpha => {
                let row = table.insertRow();
                numeralArray.forEach(numeral => {
                    let cell = row.insertCell();
                    cell.innerHTML = alpha + numeral;
                    cell.id = "hit" + alpha + numeral;
                    cell.className = "p-1 border border-dark font-weight-bold text-dark border border-light text-center";
                })
            })
        },
        mainShipLocator(p1) {
            let locations = [];
            locations.push(p1.ships);
            locations.forEach(target => {
                target.forEach(ship => {
                    ship.locationOnBoard.forEach(cell => {
                        let location = document.getElementById(cell);
                        location.classList.remove("grid-cell");
                        location.className = "ship-location bg-danger text-light text-center";
                    })
                })
            })
        }
    },
    mounted() {
        this.getPlayerData(this.proxy_URL, this.games_URL);
    }
});