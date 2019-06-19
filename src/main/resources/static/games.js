new Vue({
    el: "#app",
    data() {
        return {
            gamesURL: "http://localhost:8080/api/games",
            games: [],
            currentUserURL: "http://localhost:8080/api/username",
            currentUser: [],
            userGames: [],
            loginStatus: false,
            loginURL: "http://localhost:8080/api/login",
            logoutURL: "http://localhost:8080/api/logout",
            registerURL: "http://localhost:8080/api/players",
            username: "",
            password: ""
        };
    },
    methods: {
        getData(games_URL) {
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
                    this.games = data;
                    this.filterGames(this.games);
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
                        console.log("You have successfully logged in")
                        this.loginStatus = true;
                        this.accountStatus();
                        this.getData(this.gamesURL);
                    }
                    return response.json();
                })
                .catch(err => console.log(err))
        },
        filterGames(gameData) {
            gameData.games.forEach(game => {
                if (game.gamePlayers[0].player.username == this.currentUser.username ||
                    game.gamePlayers[1].player.username == this.currentUser.username) 
                { 
                    this.userGames.push(game); 
                }
                console.log(this.userGames)
                return this.userGames;
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
                    this.currentUser = data;
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
                    }
                    return response.json();
                })
                .catch(err => console.log(err))
        },
        register() {
            $.post("/api/players", {
                    username: this.username, 
                    password: this.password
                })
            .then(response => {
                if(response == 200) {
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
});