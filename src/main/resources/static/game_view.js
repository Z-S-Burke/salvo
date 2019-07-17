new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/gameplayers/" + this.urlParse(),
            shipsURL: "http://localhost:8080/api/games/players/" + this.gamePlayerId + "/ships",
            salvoResultsURL: "http://localhost:8080/api/games/players/" + this.gamePlayerId + "/salvos",
            currentUserURL: "http://localhost:8080/api/username",
            logoutURL: "http://localhost:8080/api/logout",
            gamePlayerId: 0,
            currentUser: [],
            readyToFire: false,
            startGame: false,
            shipLocations: [],
            selectedLength: null,
            shipValidated: false,
            shotsFiredThisRound: [],
            opponentShipsSunk: [],
            allShotsFired: [],
            allEnemyShotsFired: [],
            opponent: [],
            fleetDeployed: false,
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
                    this.gamePlayerId = this.player.id;
                    this.ships = this.player.ships;
                    this.fleetDeployed = this.player.fleetDeployed;
                    this.allShotsFired = this.player.salvoes;
                    this.salvoResultsFetch();
                    this.accountStatus();
                    this.mainGridMaker(this.numeralArray, this.alphaArray);
                    this.hitGridMaker(this.numeralArray, this.alphaArray);
                    this.userShipStatus(this.player);
                    this.opponentShipStatusFetch;
                })
                .catch(err => console.log(err))
        },
        singleSalvo(event) {
            let location = document.getElementById(event.target.id);
            let shotValid = true;
            if (this.shotsFiredThisRound.length < 5) {
                if (this.shotsFiredThisRound.length == 0) {
                    shotValid = true;
                }
                else {

                    this.shotsFiredThisRound.forEach(shot => {
                        if (shot.location == event.target.id.substring(3)) {
                            shotValid = false;
                        }
                    })

                    this.allShotsFired.forEach(pastShot => {
                        if (event.target.id.substring(3) == pastShot.location) {
                            console.log(event.target.id.substring(3) + "!!!!" + pastShot.location)
                            shotValid = false;
                        }
                    })
                }

                if (shotValid) {
                    location.classList.add("pendingHit");
                    let salvo = { 'turnFired': this.turnCounter, 'location': event.target.id.substring(3) };

                    this.shotsFiredThisRound.push(salvo);
                }
            }
        },
        fireAway() {
            $.post({
                url: "http://localhost:8080/api/games/players/" + this.gamePlayerId + "/salvos",
                data: JSON.stringify(this.shotsFiredThisRound),
                dataType: "text",
                contentType: "application/json"
            })
                .then(response => {
                    this.clearCannons();
                })
        },
        clearCannons() {
            this.shotsFiredThisRound.forEach(shot => {
                let cleanCannon = document.getElementById("hit" + shot.location);
                cleanCannon.classList.remove("pendingHit");
                this.allShotsFired.push(shot);
            })
            this.shotsFiredThisRound = [];
            this.salvoResultsFetch();
        },
        salvoResultsFetch() {
            fetch("http://localhost:8080/api/games/players/" + this.player.id + "/salvos", {
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    this.player = data;
                    this.allShotsFired = data.salvoes;
                    this.opponentSalvoFetch(this.player.opponent);
                    this.hitOrMissSideBoard();
                    this.hitOrMissMainBoard();
                })
                .catch(err => console.log(err))
        },
        opponentSalvoFetch(id) {
            fetch("http://localhost:8080/api/games/players/opponent/" + id + "/salvos", {
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.allEnemyShotsFired = data;
                    this.hitOrMissMainBoard();
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
            window.location.reload();
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
                    window.location.replace("http://localhost:8080/game_view.html" + "?userid=" + this.joinData.gamePlayerID);
                })
                .catch(err => console.log(err))
        },
        urlParse() {
            let url = new URL(window.location.href);
            let searchParams = new URLSearchParams(url.search);
            return searchParams.get('userid');
        },
        urlParseOpponent() {
            let url = new URL(window.location.href);
            let searchParams = new URLSearchParams(url.search);
            return searchParams.get('opponentId');
        },
        lockFleet(numeralArray, alphaArray) {
            const table = document.getElementById("shipGrid");
            table.className = "board";
            for (let alpha in alphaArray) {
                let row = table.insertRow();
                numeralArray.forEach(numeral => {
                    let cell = document.getElementById(alpha + numeral);
                    cell.removeEventListener("mouseover", this.shipTest);
                    cell.removeEventListener("mouseout", this.clearPreview);
                    cell.removeEventListener("click", this.addShip);
                })
            }
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
                    cell.addEventListener("click", this.singleSalvo);
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

            if (this.selectedLength != null && this.ships.length <= 4) {
                let finalPreview = "";
                let invalidPlacement = false;
                let coordinate = event.target.id;
                coordinate = coordinate.match(/[^\d]+|\d+/g);
                let x = coordinate[0];
                const y = Number(coordinate[1]);
                for (let alpha in this.alphaArray) {
                    if (x === alpha) {
                        x = Number(this.alphaArray[alpha]);
                    }
                }
                if (this.verticalOrientation) {
                    if (0 < y + this.selectedLength < 11 || 0 < y + this.selectedLength < 11) {
                        if (this.shipLocations.length != 0) {
                            this.shipLocations.forEach(location => {
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
                            let checkY = 0;
                            for (let i = 0; i <= this.selectedLength; i++) {
                                checkY = x + i;
                                if (checkY < 11) {
                                    for (let alpha in this.alphaArray) {
                                        if (checkY === this.alphaArray[alpha]) {
                                            let checkY = alpha;
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
                    this.shipBuilder.forEach(location => {
                        finalPreview = document.getElementById(location);
                        finalPreview.className = "invalidLocation grid-cell text-light text-center";
                    })
                } else {
                    this.shipBuilder = [...new Set(this.shipBuilder)];


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
            if (this.shipValidated && this.ships.length <= 5) {
                let ship = {};
                let disable = "";
                if (this.patrolBoat == true) {
                    ship = { 'type': "patrolBoat", 'locationOnBoard': this.shipBuilder };
                    this.patrolBoat = false;
                    disable = document.getElementById('patrolBoat');
                } else if (this.destroyer == true) {
                    ship = { 'type': "destroyer", 'locationOnBoard': this.shipBuilder };
                    this.destroyer = false;
                    disable = document.getElementById('destroyer');
                } else if (this.submarine == true) {
                    ship = { 'type': "submarine", 'locationOnBoard': this.shipBuilder };
                    this.submarine = false;
                    disable = document.getElementById('submarine');
                } else if (this.battleship == true) {
                    ship = { 'type': "battleship", 'locationOnBoard': this.shipBuilder };
                    this.battleship = false;
                    disable = document.getElementById('battleship');
                } else {
                    ship = { 'type': "aircraftCarrier", 'locationOnBoard': this.shipBuilder };
                    this.aircraftCarrier = false;
                    disable = document.getElementById('aircraftCarrier');
                }
                this.ships.push(ship);
                this.shipBuilder.forEach(location => {
                    submissionStyle = document.getElementById(location).classList.add("roll-in-blurred-top");
                    this.shipLocations.push(location);
                })
                disable.removeEventListener('click', this.addShip);
            }
            this.selectedLength = null;
            this.clearPreview();
            this.shipValidated = false;
            this.shipBuilder = [];
            this.patrolBoat = false;
            this.destroyer = false;
            this.submarine = false;
            this.battleship = false;
            this.aircraftCarrier = false;
            this.selectedLength = 0;
        },
        submitShips() {
            $.post({
                url: "http://localhost:8080/api/games/players/" + this.gamePlayerId + "/ships",
                data: JSON.stringify(this.ships),
                dataType: "text",
                contentType: "application/json"
            })
                .then(response => {
                    this.fleetDeployed = true;
                    this.lockFleet();
                    const stopSubmit = document.getElementById("fleetButton");
                    stopSubmit.disable;
                })
        },
        clearPreview() {
            if (!this.fleetDeployed) {
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
                                endPreview.className = "ship-location grid-cell text-light text-center";
                            }
                        })
                    })
                } else {
                    this.shipBuilder.forEach(location => {
                        endPreview = document.getElementById(location);
                        endPreview.className = "";
                        endPreview.className = "grid-cell text-dark bg-light text-center";
                    })
                }
                if (this.shipLocations.length != 0) {
                    this.shipLocations.forEach(vector => {
                        endPreview = document.getElementById(vector);
                        endPreview.className = "";
                        endPreview.className = "ship-location text-light text-center";
                    })
                }
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
                            location.className = "ship-location bg-black text-light text-center";
                        })
                    })
                })
            }
        },
        hitOrMissMainBoard() {
            this.allEnemyShotsFired.forEach(shot => {
                if (shot.hit) {
                    let hitMarker = document.getElementById(shot.location);
                    hitMarker.classList.remove("ship-location");
                    hitMarker.classList.add("hitMarker");
                }
                else {
                    let missMarker = document.getElementById(shot.location)
                    missMarker.classList.add("missMarker");
                }
            })

            this.userShipStatus(this.player);
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
        hitOrMissSideBoard() {
            this.allShotsFired.forEach(shot => {
                if (shot.hit) {
                    let hitMarker = document.getElementById("hit" + shot.location);
                    hitMarker.classList.add("hitMarker");
                }
                else {
                    let missMarker = document.getElementById("hit" + shot.location)
                    missMarker.classList.add("missMarker");
                }
            })
        },
        userShipStatus(user) {
            user.ships.forEach(ship => {
                if (ship.sink) {
                    let avatar = document.getElementById(ship.type);
                    avatar.classList.remove("gameViewShipSelector");
                    avatar.classList.add("shipSunk");
                    avatar.innerHTML = "";
                }
            })

            this.opponentShipStatusFetch();
        },
        opponentShipStatus(shipList) {
            shipList.forEach(ship => {
                if (ship.sink) {
                    let avatar = document.getElementById(ship.type + "Opponent");
                    avatar.classList.remove("opponentShipRender");
                    avatar.classList.add("shipSunkOpponent");
                    avatar.innerHTML = "";
                }
            })
        },
        opponentShipStatusFetch() {
            fetch("http://localhost:8080/api/games/opponent/ships/" + this.player.opponent + "/sink", {
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.opponentShipStatus(data);
                })
                .catch(err => console.log(err))
        },
    },
    mounted() {
        this.getPlayerData(this.games_URL);
    }
});