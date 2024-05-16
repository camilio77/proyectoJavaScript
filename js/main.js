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
            <iframe class="spotify-iframe" width="654" height="800" src="https://open.spotify.com/embed/${this.type}/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
        if (type == "track"){
            this.shadowRoot.innerHTML = `
            <iframe class="spotify-iframe" width="50%" height="400" src="https://open.spotify.com/embed/${this.type}/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
        }
    }
};
customElements.define("my-frame", myFrame);

class albumsBusqueda extends HTMLElement {
    constructor() {
        super();
    }
    async connectedCallback() {
        let uri = "%3CREQUIRED%3E";
        uri = uri.replace(" ", "%20");
        const listaAlbums = async (uri) => {
            const url = `https://spotify23.p.rapidapi.com/search/?q=${uri}&type=albums&offset=0&limit=10&numberOfTopResults=5`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '050ce98713mshc39f94907960c39p1bfff7jsndda4a1fa91ce',
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
                        let frame = document.querySelector("my-frame");
                        frame.setAttribute("uri", uri);
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
