new Vue({
    el: "#app",
    data() {
        return {
            games_URL: "http://localhost:8080/api/gameplayers/",
            players: [],
            proxy_URL: "proxyUrl: 'https://cors-anywhere.herokuapp.com/",
            numeralArray: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            alphaArray: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        };
    },
    methods: {
        getData(proxy_URL, games_URL) {
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
                    this.players = data;
                })
                .catch(err => console.log(err))
        },
        gridMaker(numeralArray, alphaArray) {
            const table = document.getElementById("shipGrid");
            table.className = "board";
            numeralArray.forEach(numeral => {
                let row = table.insertRow();
                alphaArray.forEach(alpha => {
                    let cell = row.insertCell();
                    cell.innerHTML = numeral + alpha;
                    cell.id = numeral + alpha;
                    cell.className = "grid-cell bg-white text-dark text-center"
                })
            })
        }
    },
    mounted() {
        this.getData(this.proxy_URL, this.games_URL);
    }
});