new Vue({
    el: "#app",
    data() {
        return {
            currentUser: [],
            currentUserURL: "http://localhost:8080/api/username",
            loginStatus: false,
            loginURL: "http://localhost:8080/api/login",
            username: "",
            password: ""
        };
    },
    methods: {
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
                        loginStatus = true;
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
    },
});