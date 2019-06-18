new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/user_games",
            games: [],
            currentUserURL: "http://localhost:8080/api/username",
            currentUser: [],
            loginStatus: false,
            loginURL: "http://localhost:8080/api/login",
            logoutURL: "http://localhost:8080/api/logout",
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
                })
                .catch(err => console.log(err))
        },
        login() {
            console.log('logging in')
            console.log(this.username)
            console.log(this.password)
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
                    console.log(response)
                    if (response.status == 200) {
                        console.log("You have successfully logged in")
                        this.loginStatus = true;
                        this.accountStatus();
                    }
                    return response.json();
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
        logout() {
            console.log("Logging out")
            fetch(this.logoutURL, {
                method: "POST"
            })
                .then(response => {
                    console.log(response)
                    if (response.status == 200) {
                        console.log("You have successfully logged out")
                        this.loginStatus = false;
                        this.username = "";
                        this.password = "";
                    }
                    return response.json();
                })
                .catch(err => console.log(err))
        },
        convertObjects(dataObject) {
            let result = Object.keys(dataObject).map(function (key) {
                return [Number(key), dataObject[key]];
            });
            return result;
        },
        signup() {

        }
    },
});