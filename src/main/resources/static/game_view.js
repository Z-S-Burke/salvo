new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/gameplayers",
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
                    this.ships = this.p1.ships;
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
                    cell.className = "grid-cell text-dark text-center bg-light";
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
                    cell.className = "px-3 py-2 font-weight-bold text-dark bg-light border border-dark text-center";
                })
            })
            this.hitOrMissSideBoard(this.p1, this.p2);
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
            this.hitOrMissMainBoard(locations, this.p1, this.p2)
        },
        hitOrMissMainBoard(userShipLocations, user, opponent) {
            let opponentSalvoes = opponent.salvoes;
            opponentSalvoes.forEach(salvo => {
                userShipLocations.forEach(shipMap => {
                    shipMap.forEach(ship => {
                        ship.locationOnBoard.forEach(vector => {
                            if (vector == salvo.location) {
                                let hitMarker = document.getElementById(vector);
                                hitMarker.className = "hitMarker";
                                hitMarker.innerHTML = "";
                            } else if (salvo.location != vector) {
                                let missMarker = document.getElementById(salvo.location);
                                if (missMarker.className == "hitMarker") {
                                    console.log("Please don't touch this");
                                } else {
                                    missMarker.className = "missMarker";
                                    missMarker.innerHTML = "";
                                }
                            }
                        })
                    })
                })
            })
        },
        hitOrMissSideBoard(user, opponent) {
            let userSalvoes = user.salvoes;
            let opponentShipLocations = opponent.ships;
            userSalvoes.forEach(salvo => {
                opponentShipLocations.forEach(ship => {
                    ship.locationOnBoard.forEach(vector => {
                        if (vector == salvo.location) {
                            let hitMarker = document.getElementById("hit" + vector);
                            hitMarker.className = "hitMarker2";
                            hitMarker.innerHTML = "";
                        } else if (salvo.location != vector) {
                            let missMarker = document.getElementById("hit" + salvo.location);
                            if (missMarker.className == "hitMarker2") {
                                console.log("Don't touch this")
                            } else {
                                missMarker.className = "missMarker2";
                                missMarker.innerHTML = "";
                            }
                        }
                    })
                })
            })
        }
    },
    mounted() {
        this.getPlayerData(this.proxy_URL, this.games_URL);
    }
});