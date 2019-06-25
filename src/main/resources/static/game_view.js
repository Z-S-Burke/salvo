new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/gameplayers/" + this.urlParse(),
            shipsURL: "http://localhost:8080/api/games/players/gameId=" + this.gamePlayerId + "/ships",
            currentUserURL: "http://localhost:8080/api/username",
            logoutURL: "http://localhost:8080/api/logout",
            gamePlayerId: "",
            currentUser: [],
            player: [],
            hits: [],
            misses: [],
            p1: [],
            ships: [],
            gamePlayerShips: [],
            patrolBoat: [],
            destroyer: [],
            submarine: [],
            battleship: [],
            aircraftCarrier: [],
            numeralArray: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            alphaArray: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        };
    },
    methods: {
        getPlayerData(games_URL) {
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
                    this.player = data;
                    console.log(this.player)
                    this.gamePlayerId = this.player.id;
                    console.log(this.gamePlayerId)
                    this.ships = this.player.ships;
                    console.log(this.ships)
                    this.accountStatus();
                    this.getPlayerShips();
                    this.mainGridMaker(this.numeralArray, this.alphaArray);
                    this.hitGridMaker(this.numeralArray, this.alphaArray);

                })
                .catch(err => console.log(err))
        },
        accountStatus() {
            fetch(this.currentUserURL, {
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.currentUser = data;
                })
                .catch(err => console.log(err))
        },
        getPlayerShips(shipsURL) {
            fetch(shipsURL, {
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
            })
                .then(response => {
                    response.json()
                })
                .then(data => {
                    this.ships = data;
                    console.log(this.ships);
                })
        },
        urlParse() {
            let url = new URL(window.location.href);
            let searchParams = new URLSearchParams(url.search);
            return searchParams.get('userid');
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
            this.mainShipLocator(this.player);
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
            //this.hitOrMissSideBoard(this.player);
        },
        mainShipLocator(p1) {
            let locations = [];
            locations.push(this.ships);
            locations.forEach(target => {
                target.forEach(ship => {
                    ship.locationOnBoard.forEach(cell => {
                        let location = document.getElementById(cell);
                        location.classList.remove("grid-cell");
                        location.className = "ship-location bg-danger text-light text-center";
                    })
                })
            })
            //this.hitOrMissMainBoard(locations, this.player)
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
    logout() {
        fetch(this.logoutURL, {
            method: "POST"
        })
            .then(response => {
                if (response.status == 200) {
                    console.log("You have successfully logged out")
                    this.loginStatus = false;
                    this.username = "";
                    this.password = "";
                    this.userGames = [];
                    this.currentUser = [];
                    this.joinableGames = [];
                }
                return response.json();
            })
            .catch(err => console.log(err))
    },
    mounted() {
        this.getPlayerData(this.games_URL);
    }
});