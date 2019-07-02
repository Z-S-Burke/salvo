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
            shipLocations: [],
            selectedLength: null,
            shipValidated: false,
            player: [],
            hits: [],
            misses: [],
            p1: [],
            ships: [],
            verticalOrientation: false,
            shipBuilder: [],
            patrolBoat: false,
            destroyer: false,
            submarine: false,
            battleship: false,
            aircraftCarrier: false,
            numeralArray: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            alphaArray: { "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8, "I": 9, "J": 10 }
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
                    this.gamePlayerId = Number(this.player.id);
                    console.log(this.gamePlayerId)
                    this.ships = this.player.ships;
                    console.log(this.ships)
                    this.accountStatus();
                    this.mainGridMaker(this.numeralArray, this.alphaArray);
                    this.hitGridMaker(this.numeralArray, this.alphaArray);

                })
                .catch(err => console.log(err))
        },
        placePatrolBoat() {
            this.patrolBoat = !this.patrolBoat;
            this.destroyer = false;
            this.submarine = false;
            this.battleship = false;
            this.aircraftCarrier = false;
            this.selectedLength = 1;
        },
        placeDestroyer() {
            this.destroyer = !this.destroyer;
            this.patrolBoat = false;
            this.submarine = false;
            this.battleship = false;
            this.aircraftCarrier = false;
            this.selectedLength = 2;
        },
        placeSubmarine() {
            this.submarine = !this.submarine;
            this.destroyer = false;
            this.patrolBoat = false;
            this.battleship = false;
            this.aircraftCarrier = false;
            this.selectedLength = 2;
        },
        placeBattleship() {
            this.battleship = !this.battleship;
            this.destroyer = false;
            this.submarine = false;
            this.patrolBoat = false;
            this.aircraftCarrier = false;
            this.selectedLength = 3;
        },
        placeAircraftCarrier() {
            this.aircraftCarrier = !this.aircraftCarrier;
            this.destroyer = false;
            this.submarine = false;
            this.battleship = false;
            this.patrolBoat = false;
            this.selectedLength = 4;
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
                })
                .catch(err => console.log(err))
        },
        resetBoard() {
            this.shipLocations = [];
            console.log(this.shipLocations);
        },
        sendShips() {
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
            for (let alpha in alphaArray) {
                let row = table.insertRow();
                numeralArray.forEach(numeral => {
                    let cell = row.insertCell();
                    cell.innerHTML = alpha + numeral;
                    cell.id = alpha + numeral;
                    cell.addEventListener("mouseover", this.shipTest);
                    cell.addEventListener("mouseout", this.clearPreview);
                    cell.addEventListener("click", this.addShip);
                    cell.className = "grid-cell text-dark text-center bg-light";
                })
            }
            this.mainShipLocator(this.player);
        },
        hitGridMaker(numeralArray, alphaArray) {
            const table = document.getElementById("hitGrid");
            table.className = "board";
            for (let alpha in alphaArray) {
                let row = table.insertRow();
                numeralArray.forEach(numeral => {
                    let cell = row.insertCell();
                    cell.innerHTML = alpha + numeral;
                    cell.id = "hit" + alpha + numeral;
                    cell.className = "grid-cell text-dark bg-light text-center";
                })
            }
        },
        howToPlay() {
            alert("HOW TO PLAY\n\nThe rules are simple.\n\n1) Begin by placing your ships on the board. Your fleet is located at the top of the screen. The number inside each cutout indicates the length of the ship as seen on the board. Click 'Change Orientation' if you want to switch between a horizontal and vertical placement tof the ship. When you have placed all five ships on the board and are happy to begin the game, click PLAY, located on the right hand side of the viewport.\n\n 2) Once your opponenent has readied up, the game will begin. Select five vectors on the attack board, located on the righthand side, to unleash a salvo in each location. You won't attack, and the game won't progress, until both you and your opponent hit 'FIRE'.\n\n 3) To win the game, you must destroy all of your opponent's ships before they can do the same to yours. Because both teams fire in unison, it is possible for the game to result in a draw. \n\nPlayers are awarded a score of 1 for winning, 0.5 for drawing, and 0 for a loss. Visit the 'GAMES' page to see your rank on the leaderboards.");
        },
        orientation() {
            this.verticalOrientation = !this.verticalOrientation;
            console.log(this.verticalOrientation)
        },
        shipTest(event) {

            this.shipBuilder = [];

            if (this.selectedLength != null) {
                let finalPreview = "";
                let invalidPlacement = false;
                let coordinate = event.target.id;
                console.log(coordinate)
                coordinate = coordinate.match(/[^\d]+|\d+/g);
                let x = coordinate[0];
                const y = Number(coordinate[1]);
                for (let alpha in this.alphaArray) {
                    if (x === alpha) {
                        x = Number(this.alphaArray[alpha]);
                    }
                }
                if (this.verticalOrientation) {
                    console.log("vert = " + this.verticalOrientation)
                    console.log("y = " + y + " select.leng. = " + this.selectedLength)
                    if (0 < y + this.selectedLength < 11 || 0 < y + this.selectedLength < 11) {
                        if (this.shipLocations.length != 0) {
                            console.log(this.shipLocations)
                            this.shipLocations.forEach(location => {
                                console.log(location)
                                console.log("location = " + location + " vert = " + this.verticalOrientation)
                                let checkY = 0;
                                for (let i = 0; i <= this.selectedLength; i++) {
                                    checkY = x + i;
                                    if (checkY < 11) {
                                        if (location != null) {
                                            for (let alpha in this.alphaArray) {
                                                if (checkY === this.alphaArray[alpha]) {
                                                    let checkY = alpha;
                                                    if (location == checkY.concat(y)) {
                                                        invalidPlacement = true;
                                                    }
                                                    else {
                                                        this.shipBuilder.push(checkY.concat(y));
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        invalidPlacement = true;
                                    }
                                }
                            })
                        } else {
                            console.log("the desired else")
                            let checkY = 0;
                            for (let i = 0; i <= this.selectedLength; i++) {
                                checkY = x + i;
                                if (checkY < 11) {
                                    for (let alpha in this.alphaArray) {
                                        if (checkY === this.alphaArray[alpha]) {
                                            let checkY = alpha;
                                            console.log("Alpha = " + checkY)
                                            this.shipBuilder.push(checkY.concat(y));
                                        }
                                    }
                                }
                                else {
                                    invalidPlacement = true;
                                }
                            }
                        }
                    } else {
                        invalidPlacement = true;
                    }
                } else {
                    if (0 < x + this.selectedLength < 11 || 0 < x + this.selectedLength < 11) {
                        console.log(x)
                        if (this.shipLocations.length != 0) {
                            this.shipLocations.forEach(location => {
                                if (location != event.target.id && this.selectedLength != null) {
                                    let staticPoint = String(x);
                                    for (let alpha in this.alphaArray) {
                                        if (x === this.alphaArray[alpha]) {
                                            staticPoint = alpha;
                                        }
                                    }
                                    let checkX = 0;
                                    for (let i = 0; i <= this.selectedLength; i++) {
                                        checkX = Number(y) + i;
                                        if (checkX < 11) {
                                            for (let alpha in this.alphaArray) {
                                                if (location == staticPoint.concat(checkX)) {
                                                    invalidPlacement = true;
                                                }
                                                else {
                                                    if (x === this.alphaArray[alpha]) {
                                                        this.shipBuilder.push(staticPoint.concat(checkX));
                                                    }
                                                }

                                            }
                                        } else {
                                            invalidPlacement = true;
                                        }
                                    }
                                } else {
                                    invalidPlacement = true;
                                }
                            })
                        } else {
                            let staticPoint = String(x);
                            for (let alpha in this.alphaArray) {
                                if (x === this.alphaArray[alpha]) {
                                    staticPoint = alpha;
                                }
                            }
                            let checkX = 0;
                            for (let i = 0; i <= this.selectedLength; i++) {
                                checkX = Number(y) + i;
                                if (checkX < 11) {
                                    for (let alpha in this.alphaArray) {
                                        if (location == staticPoint.concat(checkX)) {
                                            invalidPlacement = true;
                                        }
                                        else {
                                            if (x === this.alphaArray[alpha]) {
                                                this.shipBuilder.push(staticPoint.concat(checkX));
                                            }
                                        }

                                    }
                                } else {
                                    invalidPlacement = true;
                                }
                            }
                        }
                    }
                }

                if (invalidPlacement == true) {
                    this.shipValidated = false;
                    this.shipBuilder = [...new Set(this.shipBuilder)];
                    console.log(this.shipBuilder)
                    this.shipBuilder.forEach(location => {
                        finalPreview = document.getElementById(location);
                        finalPreview.className = "invalidLocation grid-cell text-light text-center";
                    })
                } else {
                    console.log(this.shipBuilder)
                    this.shipBuilder = [...new Set(this.shipBuilder)];
                    console.log("setting up submit")
                    console.log(this.shipBuilder)

                    this.shipValidated = true;

                    this.shipBuilder.forEach(location => {
                        finalPreview = document.getElementById(location);
                        finalPreview.classList.add("validLocation", "grid-cell", "text-dark", "text-center");
                    })
                    // document.getElementById(event.target.id).addEventListener("click", this.submitShip;
                }
            }
        },
        addShip() {
            console.log(this.shipValidated)
            if (this.shipValidated && this.ships.length <= 5) {
                let submissionStyle = "";
                console.log("submit ship")
                let ship = {};
                if (this.patrolBoat == true) {
                    ship = { 'type': "patrol boat", 'locationOnBoard': this.shipBuilder };
                    this.patrolBoat = false;
                    this.patrolBoat.submitted = true;
                } else if (this.destroyer == true) {
                    ship = { 'type': "destroyer", 'locationOnBoard': this.shipBuilder };
                    this.destroyer = false;
                } else if (this.submarine == true) {
                    ship = { 'type': "submarine", 'locationOnBoard': this.shipBuilder };
                    this.submarine = false;
                } else if (this.battleship == true) {
                    ship = { 'type': "battleship", 'locationOnBoard': this.shipBuilder };
                    this.battleship = false;
                } else {
                    ship = { 'type': "aircraft carrier", 'locationOnBoard': this.shipBuilder };
                    this.aircraftCarrier = false;
                }
                this.ships.push(ship);
                this.shipBuilder.forEach(location => {
                    submissionStyle = document.getElementById(location).classList.add("roll-in-blurred-top");
                    this.shipLocations.push(location);
                })
            }
            this.selectedLength = null;
            this.clearPreview();
            this.shipValidated = false;
            this.shipBuilder = [];
            console.log(this.ships)
        },
        submitShips() {
            fetch(this.shipsURL, {
                method: "POST",
                body: JSON.stringify(this.ships)
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.ships = data;
                    console.log(this.ships)
                })
                .catch(err => console.log(err))
        },
        clearPreview() {
            console.log("clearPreview")
            let endPreview = "";
            if (this.shipLocations.length != 0) {
                this.shipBuilder.forEach(location => {
                    endPreview = document.getElementById(location);
                    this.shipLocations.forEach(vector => {
                        if (String(vector) != String(location)) {
                            endPreview.className = "";
                            endPreview.className = "grid-cell text-dark bg-light text-center";
                        } else {
                            endPreview.className = "";
                            endPreview.className = "ship-location text-light text-center";
                        }
                    })
                })
            } else {
                this.shipBuilder.forEach(location => {
                    endPreview = document.getElementById(location);
                    endPreview.className = "";
                    endPreview.className = "grid-cell text-dark bg-light text-centter";
                })
            }
            if (this.shipLocations.length != 0) {
                this.shipLocations.forEach(vector => {
                    endPreview = document.getElementById(vector);
                    endPreview.className = "";
                    endPreview.className = "ship-location text-light text-center";
                })
            }
        },
        mainShipLocator() {
            if (this.ships) {
                let locations = [];
                locations.push(this.ships);
                locations.forEach(target => {
                    target.forEach(ship => {
                        ship.locationOnBoard.forEach(cell => {
                            let location = document.getElementById(cell);
                            this.shipLocations.push(location.id);
                            location.classList.remove("grid-cell");
                            location.className = "ship-location bg-danger text-light text-center";
                        })
                    })
                })
            }
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