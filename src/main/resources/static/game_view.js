new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "https://zsburkesalvo.herokuapp.com/api/gameplayers/" + this.urlParse(),
            shipsURL: "https://zsburkesalvo.herokuapp.com/api/games/players/" + this.gamePlayerId + "/ships",
            salvoResultsURL: "https://zsburkesalvo.herokuapp.com/api/games/players/" + this.gamePlayerId + "/salvos",
            currentUserURL: "https://zsburkesalvo.herokuapp.com/api/username",
            logoutURL: "https://zsburkesalvo.herokuapp.com/api/logout",
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
            opponentFleetDeployed: false,
            opponentTurnCounter: 0,
            gameStatus: null,
            opponentWinner: false,
            opponentFleetRemaining: null,
            enterSalvo: false,
            player: [],
            hits: [],
            misses: [],
            p1: [],
            ships: [],
            verticalOrientation: false,
            shipBuilder: [],
            patrolBoat: false,
            patrolBoatPlaced: false,
            destroyer: false,
            destroyerPlaced: false,
            submarine: false,
            submarinePlaced: false,
            battleship: false,
            battleshipPlaced: false,
            aircraftCarrier: false,
            aircraftCarrierPlaced: false,
            showRecord: false,
            showRules: false,
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
                    console.log(response)
                    return response.json();
                })
                .then(data => {
                    this.player = data;
                    console.log(data);
                    this.gamePlayerId = this.player.id;
                    this.ships = this.player.ships;
                    this.fleetDeployed = this.player.fleetDeployed;
                    this.allShotsFired = this.player.salvoes;
                    this.salvoResultsFetch();
                    this.accountStatus();
                    this.mainGridMaker(this.numeralArray, this.alphaArray);
                    this.hitGridMaker(this.numeralArray, this.alphaArray);
                    this.userShipStatus(this.player);
                    this.updatePlayerData(this.games_URL);
                    if (this.player.opponent) {
                        this.opponentShipStatusFetch;
                    }
                    //starts the interval function
                    let self = this;
                    this.timer = setInterval(function () {
                        self.updatePlayerData(self.games_URL);
                        console.log("Fleet Remaining: " + self.player.fleetRemaining)
                        console.log("GameOver: " + self.player.gameInstance.gameOver)
                        console.log("winner? = " + self.player.winner)
                        console.log("opponentWinner? " + self.opponentTurnCounter)
                    }, 5000)
                })
                .catch(err => console.log(err))
        },
        updatePlayerData(games_URL) {
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
                    if (this.player.opponent) {
                        if (this.fleetDeployed) {
                            this.ships = this.player.ships;
                            this.patrolBoatPlaced = true;
                            this.destroyerPlaced = true;
                            this.submarinePlaced = true;
                            this.battleshipPlaced = true;
                            this.aircraftCarrierPlaced = true;
                        }
                        this.fleetDeployed = this.player.fleetDeployed;
                        this.allShotsFired = this.player.salvoes;
                        if (this.opponentTurnCounter == this.player.currentTurn) {
                            this.salvoResultsFetch();
                        }
                        this.accountStatus();
                        this.userShipStatus(this.player);
                        this.opponentShipStatusFetch;
                        if (this.shotsFiredThisRound.length < 5 && this.opponentFleetDeployed &&
                            this.fleetDeployed && this.opponentTurnCounter >= this.player.currentTurn) {
                            this.enterSalvo = true;
                        }
                        else {
                            this.enterSalvo = false;
                        }
                    }
                })
                .catch(err => console.log(err))
        },
        singleSalvo(event) {
            let location = document.getElementById(event.target.id);
            let shotValid = true;
            if (this.shotsFiredThisRound.length < 5 && this.opponentFleetDeployed &&
                this.fleetDeployed && this.opponentTurnCounter >= this.player.currentTurn) {
                this.enterSalvo = true;
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
            } else {
                this.enterSalvo = false;
            }
        },
        fireAway() {
            $.post({
                url: "https://zsburkesalvo.herokuapp.com/api/games/players/" + this.gamePlayerId + "/salvos",
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
            fetch("https://zsburkesalvo.herokuapp.com/api/games/players/" + this.player.id + "/salvos", {
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
            fetch("https://zsburkesalvo.herokuapp.com/api/games/players/opponent/" + id + "/salvos", {
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
                    window.location.replace("https://zsburkesalvo.herokuapp.com/game_view.html" + "?userid=" + this.joinData.gamePlayerID);
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
        showHowToPlay() {
          this.showRules = !this.showRules;
        },
        orientation() {
            this.verticalOrientation = !this.verticalOrientation;
            console.log(this.verticalOrientation)
        },
        shipTest(event) {

            this.shipBuilder = [];

            if (this.selectedLength != null && this.selectedLength != 0 && this.ships.length <= 4) {
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
                    this.patrolBoatPlaced = true;
                    disable = document.getElementById('patrolBoat');
                } else if (this.destroyer == true) {
                    ship = { 'type': "destroyer", 'locationOnBoard': this.shipBuilder };
                    this.destroyer = false;
                    this.destroyerPlaced = true;
                    disable = document.getElementById('destroyer');
                } else if (this.submarine == true) {
                    ship = { 'type': "submarine", 'locationOnBoard': this.shipBuilder };
                    this.submarine = false;
                    this.submarinePlaced = true;
                    disable = document.getElementById('submarine');
                } else if (this.battleship == true) {
                    ship = { 'type': "battleship", 'locationOnBoard': this.shipBuilder };
                    this.battleship = false;
                    this.battleshipPlaced = true;
                    disable = document.getElementById('battleship');
                } else {
                    ship = { 'type': "aircraftCarrier", 'locationOnBoard': this.shipBuilder };
                    this.aircraftCarrier = false;
                    this.aircraftCarrierPlaced = true;
                    disable = document.getElementById('aircraftCarrier');
                }
                this.ships.push(ship);
                this.shipBuilder.forEach(location => {
                    submissionStyle = document.getElementById(location).classList.add("roll-in-blurred-top");
                    this.shipLocations.push(location);
                })
                disable.removeEventListener('click', this.addShip);
            }
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
                url: "https://zsburkesalvo.herokuapp.com/api/games/players/" + this.gamePlayerId + "/ships",
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
                    window.location.replace("https://zsburkesalvo.herokuapp.com/games.html");

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
                    console.log(ship.type)
                    let avatar = document.getElementById(ship.type);
                    avatar.classList.remove("gameViewShipSelectorSubmitted");
                    avatar.classList.add("shipSunk");
                    avatar.innerHTML = "";
                } else {
                    let avatar = document.getElementById(ship.type);
                    avatar.innerHTML = ship.locationOnBoard.length;
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
            fetch("https://zsburkesalvo.herokuapp.com/api/games/opponent/ships/" + this.player.opponent + "/sink", {
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
                    this.turnCounter();
                })
                .catch(err => console.log(err))
        },
        turnCounter() {
            fetch("https://zsburkesalvo.herokuapp.com/api/games/opponent/" + this.player.opponent + "/turn", {
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.opponentTurnCounter = data[0].currentTurn;
                    console.log(this.opponentTurnCounter)
                    this.opponentFleetDeployed = data[0].fleetDeployed;
                    console.log(this.opponentFleetDeployed)
                    this.opponentWinner = data[0].winner;
                    console.log(this.opponentWinner)
                    this.opponentFleetRemaining = data[0].fleetRemaining;
                    console.log(this.opponentFleetRemaining)
                    if (this.opponentWinner == false || this.opponentFleetRemaining == 0) {
                        this.setWinner();
                    }
                    if (this.opponentWinner && this.player.winner) {
                        this.gameStatus == 1;
                    }
                    if (this.opponentWinner && !this.player.winner && this.player.currentTurn == this.opponentTurnCounter) {
                        this.gameStatus = 0;
                    }
                })
                .catch(err => console.log(err))
        },
        submitScore() {
            fetch("https://zsburkesalvo.herokuapp.com/api/scoreSubmission/" + this.player.id + "/" + this.gameStatus, {
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
            })
                .then(response => {
                    this.gameBrowser();
                    return response.json();
                })
                .catch(err => console.log(err))
        },
        setWinner() {
            fetch("https://zsburkesalvo.herokuapp.com/api/setWinner/" + this.player.id, {
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (this.player.currentTurn != this.opponentTurnCounter) {
                        console.log("do nothing")
                    }
                    else {
                        if (this.player.winner && this.opponentWinner) {
                            console.log("playerWinner: " + this.player.winner)
                            console.log("opponentWinner: " + this.opponentWinner)
                            console.log("DRAW")
                            this.gameStatus = 1;
                        }
                        else if (this.player.winner && !this.opponentWinner) {
                            console.log("playerWinner: " + this.player.winner)
                            console.log("opponentWinner: " + this.opponentWinner)
                            console.log("WIN")
                            this.gameStatus = 2;
                        }
                        else {
                            console.log("playerWinner: " + this.player.winner)
                            console.log("opponentWinner: " + this.opponentWinner)
                            console.log("LOSE")
                            this.gameStatus = 0;
                        }
                    }
                })
                .catch(err => console.log(err))
        },
        gameBrowser() {
            window.location.replace("https://zsburkesalvo.herokuapp.com/games.html");
        },
        showUserRecord() {
            this.showRecord = !this.showRecord;
            console.log(this.showRecord)
        },
        authorizeUser() {
            fetch(this.games_URL + "/authorize", {
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
            })
                .then(response => {
                    console.log(response)
                    if(response.status == 401) {
                        window.location.replace("cheat.html");
                    } else {
                        this.getPlayerData(this.games_URL);
                    }
                    return response.json();
                })
                .catch(err => console.log(err))
        }
    },
    mounted() {
        // this.getPlayerData(this.games_URL);
        this.authorizeUser();
    }
});