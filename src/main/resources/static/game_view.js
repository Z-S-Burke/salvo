new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/gameplayers/" + this.urlParse(),
            shipsURL: "http://localhost:8080/api/games/players/" + this.gamePlayerId + "/ships",
            currentUserURL: "http://localhost:8080/api/username",
            logoutURL: "http://localhost:8080/api/logout",
            gamePlayerId: "",
            currentUser: [],
            readyToFire: false,
            startGame: false,
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
            console.log(shipsURL)
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
        sendShips(ships) {
            fetch(this.newGameURL, {
                method: "POST"
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.joinData = data;
                    console.log(this.joinData)
                    window.location.replace("http://localhost:8080/game_view.html" + "?userid=" + this.joinData.gamePlayerID);
                })
                .catch(err => console.log(err))
        },
        drag(event) {
            event.dataTransfer.setData("text", ev.target.id);
        },
        allowDrop(event) {
            event.preventDefault();
        },
        drop(event) {
            event.preventDefault();
            let info = event.dataTransfer.getData("text");
            event.target.innerHTML(document.getElementById(info));
        },
        urlParse() {
            let url = new URL(window.location.href);
            let searchParams = new URLSearchParams(url.search);
            return searchParams.get('userid');
        },
        clickEventListenerTest(cell) {
            console.log(cell.id)
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
                    cell.className = "grid-cell px-3 py-2 font-weight-bold text-dark bg-light border border-dark text-center";
                })
            })
        },
        howToPlay() {
            alert("HOW TO PLAY\n\nThe rules are simple.\n\n1) Begin by placing your ships on the board. Your fleet is located at the top of the screen. The number inside each cutout indicates the length of the ship as seen on the board. Click 'Change Orientation' if you want to switch between a horizontal and vertical placement tof the ship. When you have placed all five ships on the board and are happy to begin the game, click PLAY, located on the right hand side of the viewport.\n\n 2) Once your opponenent has readied up, the game will begin. Select five vectors on the attack board, located on the righthand side, to unleash a salvo in each location. You won't attack, and the game won't progress, until both you and your opponent hit 'FIRE'.\n\n 3) To win the game, you must destroy all of your opponent's ships before they can do the same to yours. Because both teams fire in unison, it is possible for the game to result in a draw. \n\nPlayers are awarded a score of 1 for winning, 0.5 for drawing, and 0 for a loss. Visit the 'GAMES' page to see your rank on the leaderboards.");
        },
        alertTest(event) {
            alert(event.target.id);
            event.target.className = "grid-cell text-light text-center bg-danger missMarker";
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