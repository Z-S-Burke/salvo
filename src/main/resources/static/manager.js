new Vue({
    el: "#app",
    data() {
        return {
            url: "http://localhost:8080/players",
            players: []
        };
    },
    methods: {
        getData(url) {
            console.log(url)
            fetch(url, {
                    headers: {
                        "Access-Control-Allow-Credentials": true,
                        "Content-Type": "application/json"
                    },
                    mode: "cors"
                })
                .then(response => {
                    console.log(response)
                    return response.json();
                    console.log(response)
                })
                .then(data => {
                    console.log(data)
                    this.players = data;
                    // this.showOutput(this.players);
                })
                .catch(err => console.log(err))
        },
        postPlayer(userName) {
            post({
                headers: {
                    'Content-Type': 'application/json'
                },
                dataType: "text",
                data: JSON.stringify({
                    "username": userName
                })
            })
        },
        loadData() {
            fetch("/players")
                .then(function (data) {
                    showOutput(JSON.stringify(data, null, 2));
                })
        },
        addPlayer() {
            let name = username.val();
            if (name) {
                postPlayer(name);
            }
        },
        showOutput(text) {
            document.getElementById("output").innerHTML = text;
        }
    },
    mounted() {
        this.getData(this.url);
    }
});