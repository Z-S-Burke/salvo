new Vue({
    el: "#app",
    data() {
        return {
            gamesURL: "https://zsburkesalvo.herokuapp.com/api/games",
            games: [],
            joinData: [],
            newGameURL: "https://zsburkesalvo.herokuapp.com/api/newGame",
            currentUserURL: "https://zsburkesalvo.herokuapp.com/api/username",
            currentUser: [],
            userGames: [],
            joinableGames: [],
            loginStatus: false,
            showRecord: false,
            loginURL: "https://zsburkesalvo.herokuapp.com/api/login",
            logoutURL: "https://zsburkesalvo.herokuapp.com/api/logout",
            registerURL: "https://zsburkesalvo.herokuapp.com/api/players",
            joinGameURL: "https://zsburkesalvo.herokuapp.com/api/games/join/",
            username: "",
            password: "",
            stillLoggedIn: false
        };
    },
    methods: {
        getData(gamesURL) {
            fetch(gamesURL, {
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors"
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.games = data;
                    console.log(this.games)
                    this.filterGames(this.games);
                    this.filterJoiningNewGames(this.games);
                })
                .catch(err => console.log(err))
        },
        login() {
            fetch(this.loginURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "username=" + this.username + "&password=" + this.password
            })
                .then(response => {
                    if (response.status == 200) {
                        this.loginStatus = true;
                        this.accountStatus();
                        // this.getData(this.gamesURL);
                        // let self = this;
                        // this.timer = setInterval(function () {
                        //     self.getData(self.gamesURL);
                        // }, 3000)
                    }
                })
                .catch(err => console.log(err))
        },
        filterGames(gameData) {
            gameData.games.forEach(game => {
                if (game.gamePlayers.length > 1) {
                    if (game.gamePlayers[0].player.username == this.currentUser.username ||
                        game.gamePlayers[1].player.username == this.currentUser.username) {
                        this.userGames.push(game);
                    }
                }
                console.log(this.userGames)
                return this.userGames;
            })
        },
        filterJoiningNewGames(gameData) {
            gameData.games.forEach(game => {
                if (game.gamePlayers.length == 1) {
                    if (game.gamePlayers[0].player.username != this.currentUser.username) {
                        this.joinableGames.push(game);
                    }
                }
                return this.joinableGames;
            })
        },
        addPlayerToGame(gameID) {
            fetch(this.joinGameURL + gameID, {
                method: "POST",
            })
                .then(response => {
                    console.log(response)
                    if (response.status == 200) {
                        console.log("success");
                        this.joinMatch(gameID);
                    }
                })
                .catch(err => console.log(err))
        },
        joinMatch(gameID) {
            fetch("https://zsburkesalvo.herokuapp.com/api/games/" + gameID, {
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.joinData = data;
                    console.log(this.joinData)
                    window.location.replace("https://zsburkesalvo.herokuapp.com/game_view.html" + "?userid=" + this.joinData.gamePlayerID);
                })
                .catch(err => console.log)
        },
        rejoin(game) {
            console.log(game)

            game.gamePlayers.forEach(gamePlayer => {
                if (gamePlayer.username == this.currentUser.username) {
                    window.location.replace("https://zsburkesalvo.herokuapp.com/game_view.html" + "?userid=" + gamePlayer.gamePlayerID);
                }
            })
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
                    if(data.username) {
                        this.currentUser = data;
                        this.loginStatus = true;
                        console.log(this.currentUser)
                        this.getData(this.gamesURL);
                    }
                })
                .catch(err => console.log(err))
        },
        newGame() {
            fetch(this.newGameURL, {
                method: "POST"
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    this.joinData = data;
                    console.log(this.joinData)
                    window.location.replace("https://zsburkesalvo.herokuapp.com/game_view.html" + "?userid=" + this.joinData.gamePlayerID);
                })
                .catch(err => console.log(err))
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
        showUserRecord() {
            this.showRecord = !this.showRecord;
            console.log(this.showRecord)
        },
        register() {
            $.post("/api/players", {
                username: this.username,
                password: this.password
            })
                .then(response => {
                    if (response == 200) {
                        this.loginStatus = true;
                    }
                })
                .fail(err => console.log(err))
        },
        convertObjects(dataObject) {
            let result = Object.keys(dataObject).map(function (key) {
                return [Number(key), dataObject[key]];
            });
            return result;
        }
    }, 
    mounted() {
        console.log(this.accountStatus())
    }
});