class myFrame extends HTMLElement {
    id

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    
    connectedCallback() {
        // Este método se llama cuando el elemento se conecta al DOM
        // Aquí puedes inicializar elementos, establecer eventos, etc.
    }

    static get observedAttributes() {
        return ["uri"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        let [, , id] = newVal.split(":");
        const uri = this.getAttribute("uri")
        const type = uri.split(":")[1]
        this.id = id;
        this.type = type;
        this.shadowRoot.innerHTML = `
            <iframe class="spotify-iframe" width="100%" height="100%" src="https://open.spotify.com/embed/${this.type}/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
        if (type == "track"){
            this.shadowRoot.innerHTML = `
            <iframe class="spotify-iframe" width="100%" height="100%" src="https://open.spotify.com/embed/${this.type}/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
        }
    }
};
customElements.define("my-frame", myFrame);

const albumTracks = async (uri) =>{
    let id = uri.split(":")[2]
    const url = `https://spotify23.p.rapidapi.com/albums/?ids=${id}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '340d44197bmshc4390e4cf318650p1f0228jsn8fbaebff229a',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const tracks = result.albums[0].tracks.items;
        let maquetacion = "";
        for (let i = 0; i < tracks.length; i++) {
            maquetacion += `
            <div uri="${tracks[i].uri}" class="track2">
                <i class='bx bx-align-middle'></i>
                <div class="img">
                    <img src="${result.albums[0].images[0].url}">
                </div>
                <div class="track_text">
                    <h3>${tracks[i].name}</h3>
                    <p>${tracks[i].artists[0].name}</p>
                </div>
            </div>
            `;
            let section = document.querySelector('.track_container');
            section.innerHTML = maquetacion;
            section.querySelectorAll(".track2").forEach(track => {
                track.addEventListener("click", () => {
                    let uri = track.getAttribute("uri");
                    console.log(uri);
                    let frame = document.querySelector("my-frame");
                    frame.setAttribute("uri", uri);
                    let caratula = document.querySelector(".caratula");
                    let img = caratula.querySelector("img");
                    let left = document.querySelector(".left")
                    let player = document.querySelector(".player")
                    let right = document.querySelector(".track_list")
                    img.setAttribute("src", result.albums[0].images[0].url)
                    caratula.style.display = "block";
                    caratula.addEventListener('click', () => {
                        player.style.order = "0"
                        left.style.order = "1"
                        right.style.order = "2"
                    })
                });
            });
        }
        let section = document.querySelector('.track_container');
        let frame = document.querySelector("my-frame");
        frame.setAttribute("uri", uri);
    } catch (error) {
        console.error(error);
    }

    let busqueda2 = document.querySelector(".busqueda2")
    const boton_input = busqueda2.querySelector('.boton_input');
    const input = busqueda2.querySelector('.input');
    boton_input.addEventListener('click', () => {
        const searchTerm = input.value.trim();
        if (searchTerm !== '') {
            console.log("asa");
            loadAlbums(searchTerm);
        }
    });

    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = input.value.trim();
            if (searchTerm !== '') {
                console.log("asa");
                listaAlbums(searchTerm);
            }
        }
    });

}

class albumsBusqueda extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        let items = ["a", "b", "c","d", "e", "f", "g", "h", "i", "j", "k","l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y","z","1","2","3","4","5","6","7","8","9","10"]
        let uri = items[Math.floor(Math.random()*items.length)];
        uri = uri.replace(" ", "%20");
        const listaAlbums = async (uri) => {
            const url = `https://spotify23.p.rapidapi.com/search/?q=${uri}&type=albums&offset=0&limit=10&numberOfTopResults=5`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '340d44197bmshc4390e4cf318650p1f0228jsn8fbaebff229a',
                    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
                }
            };
            
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                console.log(result);

                if (result.albums && result.albums.items) {
                    let maquetacion = "";
                    for (let i = 0; i < result.albums.items.length; i++) {
                        if (result.albums.items[i]) {
                            console.log(result.albums.items[i]);
                            maquetacion += `
                            <div uri="${result.albums.items[i].data.uri}" class="album">
                                <img src="${result.albums.items[i].data.coverArt.sources[0].url}">
                                <h2>${result.albums.items[i].data.name}</h2>
                                <p>${result.albums.items[i].data.artists.items[0].profile.name}</p>
                            </div>
                            `;
                        }
                        this.innerHTML = maquetacion;
                    }
                } else {
                    console.error("La respuesta de la API no contiene los datos esperados.");
                    this.innerHTML = "<p>No se encontraron álbumes.</p>";
                }
                this.querySelectorAll(".album").forEach(album => {
                    album.addEventListener("click", () => {
                        let uri = album.getAttribute("uri");
                        console.log(uri);
                        albumTracks(uri)
                        let caratula = document.querySelector(".caratula");
                        let img = caratula.querySelector("img");
                        let left = document.querySelector(".left")
                        let player = document.querySelector(".player")
                        let right = document.querySelector(".track_list")
                        let img2 = album.querySelector("img");
                        img.setAttribute("src", img2.getAttribute("src"))
                        caratula.style.display = "block";
                        caratula.addEventListener('click', () => {
                            player.style.order = "0"
                            left.style.order = "1"
                            right.style.order = "2"
                        })
                    });
                });
            } catch (error) {
                console.error("Error al obtener los álbumes:", error);
                this.innerHTML = "<p>Error al cargar los álbumes.</p>";
            }
        };
        listaAlbums(uri);

        const boton_input = document.querySelector('.boton_input');
        const input = document.querySelector('.input');
        boton_input.addEventListener('click', () => {
            const searchTerm = input.value.trim();
            if (searchTerm !== '') {
                loadAlbums(searchTerm);
            }
        });

        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const searchTerm = input.value.trim();
                if (searchTerm !== '') {
                    listaAlbums(searchTerm);
                }
            }
        });
    }
}   
customElements.define('albums-list', albumsBusqueda);

class mayLike extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        let items = ["a", "b", "c","d", "e", "f", "g", "h", "i", "j", "k","l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y","z","1","2","3","4","5","6","7","8","9","10"]
        let uri = items[Math.floor(Math.random()*items.length)];
        uri = uri.replace(" ", "%20");
        const listaTrack = async (uri) => {
            const url = `https://spotify23.p.rapidapi.com/search/?q=${uri}&type=tracks&offset=0&limit=10&numberOfTopResults=5`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '340d44197bmshc4390e4cf318650p1f0228jsn8fbaebff229a',
                    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                console.log(result);

                if (result.tracks && result.tracks.items) {
                    let maquetacion = "";
                    for (let i = 0; i < result.tracks.items.length; i++) {
                        if (result.tracks.items[i]) {
                            console.log(result.tracks.items[i]);
                            maquetacion += `
                            <div uri="${result.tracks.items[i].data.uri}" class="track">
                                <div class="img">
                                    <img src="${result.tracks.items[i].data.albumOfTrack.coverArt.sources[0].url}">
                                </div>
                                <div class="track_text">
                                    <h3>${result.tracks.items[i].data.name}</h3>
                                    <p>${result.tracks.items[i].data.artists.items[0].profile.name}</p>
                                </div>
                            </div>
                            `;
                        }
                        this.innerHTML = maquetacion;
                    }
                } else {
                    console.error("La respuesta de la API no contiene los datos esperados.");
                    this.innerHTML = "<p>No se encontraron Tracks.</p>";
                }
                this.querySelectorAll(".track").forEach(track => {
                    track.addEventListener("click", () => {
                        let uri = track.getAttribute("uri");
                        console.log(uri);
                        let frame = document.querySelector("my-frame");
                        frame.setAttribute("uri", uri);
                        let caratula = document.querySelector(".caratula");
                        let img = caratula.querySelector("img");
                        let left = document.querySelector(".left")
                        let player = document.querySelector(".player")
                        let right = document.querySelector(".track_list")
                        let img2 = (track.querySelector(".img")).querySelector("img");
                        img.setAttribute("src", img2.getAttribute("src"))
                        caratula.style.display = "block";
                        caratula.addEventListener('click', () => {
                            player.style.order = "0"
                            left.style.order = "1"
                            right.style.order = "2"
                        })
                    });
                });
            } catch (error) {
                console.error(error);
            }
        }
        listaTrack(uri)
    }
}
customElements.define('track-list', mayLike);

