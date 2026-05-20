/********************************
 DATABASE LOCAL STORAGE
********************************/

const DB = {
    scuderie: JSON.parse(localStorage.getItem("f1_scuderie")) || [],
    piloti: JSON.parse(localStorage.getItem("f1_piloti")) || [],
    circuiti: JSON.parse(localStorage.getItem("f1_circuiti")) || [],
    eventi: JSON.parse(localStorage.getItem("f1_eventi")) || [],
    vetture: JSON.parse(localStorage.getItem("f1_vetture")) || []
};

function salvaDatabase() {

    localStorage.setItem("f1_scuderie", JSON.stringify(DB.scuderie));
    localStorage.setItem("f1_piloti", JSON.stringify(DB.piloti));
    localStorage.setItem("f1_circuiti", JSON.stringify(DB.circuiti));
    localStorage.setItem("f1_eventi", JSON.stringify(DB.eventi));
    localStorage.setItem("f1_vetture", JSON.stringify(DB.vetture));
}

function generaId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

async function apriGeneratoreCircuito() {

    const nomeCircuito = prompt(
        "Inserisci il nome del circuito:"
    );

    if (!nomeCircuito) {
        return;
    }

    try {

        const circuito =
            await generaCircuito(nomeCircuito);

        mostraCircuito(circuito);

    }
    catch (errore) {

        alert(
            "Errore: " + errore.message
        );

        console.errore(errore);
    }
}

function mostraCircuito(circuito) {

    const div =
        document.getElementById(
            "risultatoCircuito"
        );

    div.innerHTML = `

        <h2>${circuito.nome}</h2>

        <p>
            Segmenti:
            ${circuito.segmenti}
        </p>

        <h3>Layout</h3>

        <textarea rows="5" cols="80">
${circuito.layout}
        </textarea>

        <h3>Larghezza</h3>

        <textarea rows="5" cols="80">
${circuito.larghezza}
        </textarea>

    `;
}

const contenuto = document.getElementById("contenuto");

// GESTIONE APERTURA MENU
document.querySelectorAll(".menu-title").forEach(title => {
  title.addEventListener("click", () => {
    const submenu = title.nextElementSibling;

    // chiude altri submenu
    document.querySelectorAll(".submenu").forEach(sm => {
      if (sm !== submenu) sm.style.display = "none";
    });

    // toggle
    submenu.style.display =
      submenu.style.display === "block" ? "none" : "block";
  });
});



/********************************
 EVENTI MENU
********************************/

document.querySelectorAll(".submenu li").forEach(item => {

    item.addEventListener("click", () => {

        console.log("CLICK MENU");
        console.log(item.dataset.action);
        const action = item.dataset.action;

        switch(action) {

            // SCUDERIE
            case "add-scuderia":
                formScuderia();
                break;

            case "edit-scuderia":
                elencoScuderie(true);
                break;

            case "delete-scuderia":
                elencoScuderie(false, true);
                break;

            // PILOTI
            case "add-pilota":
                formPilota();
                break;

            case "edit-pilota":
                elencoPiloti(true);
                break;

            case "delete-pilota":
                elencoPiloti(false, true);
                break;

                // CIRCUITI
                case "add-circuito":
                    formCircuito();
                    break;

                case "edit-circuito":
                    elencoCircuiti(true);
                    break;

                case "delete-circuito":
                    elencoCircuiti(false, true);
                    break;

                case "cerca-info-circuito":
                    console.log("passo");
                    apriGeneratoreCircuito();
                    break;
                
                // EVENTI
                case "add-evento":
                    formEvento();
                    break;

                case "edit-evento":
                    elencoEventi(true);
                    break;

                case "delete-evento":
                    elencoEventi(false, true);
                    break;


                // VETTURE
                case "add-vettura":
                    formVettura();
                    break;

                case "edit-vettura":
                    elencoVetture(true);
                    break;

                case "delete-vettura":
                    elencoVetture(false, true);
                    break;
        }
    });
});










/********************************
 SCUDERIE
********************************/

function formScuderia(scuderia = null) {

    contenuto.innerHTML = `
        <h2>${scuderia ? "Modifica" : "Nuova"} Scuderia</h2>

        <form id="formScuderia" class="form-db">

            <label>Descrizione Scuderia</label>

            <input
                type="text"
                id="nomeScuderia"
                value="${scuderia ? scuderia.descrizione : ""}"
                required
            >

            <label>Capitale Disponibile</label>

            <input
                type="number"
                id="capitaleScuderia"
                value="${scuderia ? scuderia.capitale : 0}"
                required
            >

            <label>Stato Scuderia</label>

            <select id="statoScuderia">

                <option value="0">
                    Attiva
                </option>

                <option value="1">
                    Non Attiva
                </option>

            </select>

            <button type="submit">
                Salva Scuderia
            </button>

        </form>
    `;

    document
        .getElementById("formScuderia")
        .addEventListener("submit", function(e) {

            e.preventDefault();

            const nuovaScuderia = {

                id: scuderia ? scuderia.id : generaId(),

                descrizione:
                    document.getElementById("nomeScuderia").value,

                capitale:
                    parseFloat(
                        document.getElementById("capitaleScuderia").value
                    ),

                stato:
                    parseInt(
                        document.getElementById("statoScuderia").value
                    )
            };

            if(scuderia) {

                const index =
                    DB.scuderie.findIndex(
                        s => s.id === scuderia.id
                    );

                DB.scuderie[index] = nuovaScuderia;

            } else {

                DB.scuderie.push(nuovaScuderia);
            }

            salvaDatabase();

            elencoScuderie();
        });
}

function elencoScuderie(edit = false, del = false) {

    let html = `
        <h2>Archivio Scuderie</h2>
    `;

    if(DB.scuderie.length === 0) {

        html += `
            <p>Nessuna scuderia presente</p>
        `;
    }

    DB.scuderie.forEach(scuderia => {

        html += `

            <div class="card-db">

                <h3>
                    ${scuderia.descrizione}
                </h3>

                <p>
                    Capitale:
                    ${scuderia.capitale}
                </p>

                <p>
                    Stato:
                    ${scuderia.stato === 0
                        ? "Attiva"
                        : "Non Attiva"}
                </p>

                ${
                    edit
                    ?
                    `
                    <button
                        onclick="modificaScuderia(${scuderia.id})">
                        Modifica
                    </button>
                    `
                    :
                    ""
                }

                ${
                    del
                    ?
                    `
                    <button
                        onclick="cancellaScuderia(${scuderia.id})">
                        Cancella
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });

    contenuto.innerHTML = html;
}

function modificaScuderia(id) {

    const scuderia =
        DB.scuderie.find(
            s => s.id === id
        );

    formScuderia(scuderia);
}

function cancellaScuderia(id) {

    DB.scuderie =
        DB.scuderie.filter(
            s => s.id !== id
        );

    salvaDatabase();

    elencoScuderie(false, true);
}

/********************************
 PILOTI
********************************/

function formPilota(pilota = null) {

    contenuto.innerHTML = `

        <h2>
            ${pilota ? "Modifica" : "Nuovo"} Pilota
        </h2>

        <form id="formPilota" class="form-db">

            <label>Nome Pilota</label>

            <input
                type="text"
                id="nomePilota"
                value="${pilota ? pilota.nome : ""}"
                required
            >

            <label>Età</label>

            <input
                type="number"
                id="etaPilota"
                value="${pilota ? pilota.eta : 18}"
                required
            >

            <label>Capacità Guida</label>

            <input
                type="number"
                min="0"
                max="100"
                id="guidaPilota"
                value="${pilota ? pilota.guida : 50}"
            >

            <label>Stato Fisico</label>

            <input
                type="number"
                min="0"
                max="100"
                id="fisicoPilota"
                value="${pilota ? pilota.fisico : 50}"
            >

            <label>Stato Psicologico</label>

            <input
                type="number"
                min="0"
                max="100"
                id="psicoPilota"
                value="${pilota ? pilota.psico : 50}"
            >

            <label>Stato Pilota</label>

            <select id="statoPilota">

                <option value="0">
                    Attivo
                </option>

                <option value="1">
                    Non Attivo
                </option>

            </select>

            <button type="submit">
                Salva Pilota
            </button>

        </form>
    `;

    document
        .getElementById("formPilota")
        .addEventListener("submit", function(e) {

            e.preventDefault();

            const nuovoPilota = {

                id: pilota ? pilota.id : generaId(),

                nome:
                    document.getElementById("nomePilota").value,

                eta:
                    parseInt(
                        document.getElementById("etaPilota").value
                    ),

                guida:
                    parseInt(
                        document.getElementById("guidaPilota").value
                    ),

                fisico:
                    parseInt(
                        document.getElementById("fisicoPilota").value
                    ),

                psico:
                    parseInt(
                        document.getElementById("psicoPilota").value
                    ),

                stato:
                    parseInt(
                        document.getElementById("statoPilota").value
                    )
            };

            if(pilota) {

                const index =
                    DB.piloti.findIndex(
                        p => p.id === pilota.id
                    );

                DB.piloti[index] = nuovoPilota;

            } else {

                DB.piloti.push(nuovoPilota);
            }

            salvaDatabase();

            elencoPiloti();
        });
}

function elencoPiloti(edit = false, del = false) {

    let html = `
        <h2>Archivio Piloti</h2>
    `;

    if(DB.piloti.length === 0) {

        html += `
            <p>Nessun pilota presente</p>
        `;
    }

    DB.piloti.forEach(pilota => {

        html += `

            <div class="card-db">

                <h3>
                    ${pilota.nome}
                </h3>

                <p>
                    Età:
                    ${pilota.eta}
                </p>

                <p>
                    Capacità Guida:
                    ${pilota.guida}
                </p>

                <p>
                    Stato:
                    ${pilota.stato === 0
                        ? "Attivo"
                        : "Non Attivo"}
                </p>

                ${
                    edit
                    ?
                    `
                    <button
                        onclick="modificaPilota(${pilota.id})">
                        Modifica
                    </button>
                    `
                    :
                    ""
                }

                ${
                    del
                    ?
                    `
                    <button
                        onclick="cancellaPilota(${pilota.id})">
                        Cancella
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });

    contenuto.innerHTML = html;
}

function modificaPilota(id) {

    const pilota =
        DB.piloti.find(
            p => p.id === id
        );

    formPilota(pilota);
}

function cancellaPilota(id) {

    DB.piloti =
        DB.piloti.filter(
            p => p.id !== id
        );

    salvaDatabase();

    elencoPiloti(false, true);
}


/********************************
 CIRCUITI
********************************/

function formCircuito(circuito = null) {

    contenuto.innerHTML = `

        <h2>
            ${circuito ? "Modifica" : "Nuovo"} Circuito
        </h2>

        <form id="formCircuito" class="form-db">

            <label>Descrizione Circuito</label>

            <input
                type="text"
                id="nomeCircuito"
                value="${circuito ? circuito.descrizione : ""}"
                required
            >

            <label>Lunghezza Circuito (Km)</label>

            <input
                type="number"
                step="0.01"
                id="lunghezzaCircuito"
                value="${circuito ? circuito.lunghezza : 0}"
                required
            >

            <label>Struttura Circuito</label>

            <input
                type="text"
                id="strutturaCircuito"
                value="${circuito ? circuito.struttura : ""}"
            >

            <label>Struttura2 Circuito</label>

            <input
                type="text"
                id="struttura2Circuito"
                value="${circuito ? circuito.struttura2 : ""}"
            >
    
    
            <label>Stato Circuito</label>

            <select id="statoCircuito">

                <option value="0">Attivo</option>
                <option value="1">Non Attivo</option>

            </select>

            <button type="submit">
                Salva Circuito
            </button>

        </form>
    `;

    document
        .getElementById("formCircuito")
        .addEventListener("submit", function(e) {

            e.preventDefault();

            const nuovoCircuito = {

                id: circuito ? circuito.id : generaId(),

                descrizione:
                    document.getElementById("nomeCircuito").value,

                lunghezza:
                    parseFloat(
                        document.getElementById("lunghezzaCircuito").value
                    ),

                struttura:
                    document.getElementById("strutturaCircuito").value,

                struttura2:
                    document.getElementById("struttura2Circuito").value,
            
                stato:
                    parseInt(
                        document.getElementById("statoCircuito").value
                    )
            };

            if(circuito) {

                const index =
                    DB.circuiti.findIndex(
                        c => c.id === circuito.id
                    );

                DB.circuiti[index] = nuovoCircuito;

            } else {

                DB.circuiti.push(nuovoCircuito);
            }

            salvaDatabase();

            elencoCircuiti();
        });
}

function elencoCircuiti(edit = false, del = false) {

    let html = `<h2>Archivio Circuiti</h2>`;

    DB.circuiti.forEach(circuito => {

        html += `

            <div class="card-db">

                <h3>${circuito.descrizione}</h3>

                <p>Lunghezza: ${circuito.lunghezza} Km</p>

                <p>Struttura: ${circuito.struttura}</p>
                    
                <p>Struttura2: ${circuito.struttura2}</p>
                ${
                    edit
                    ?
                    `
                    <button onclick="modificaCircuito(${circuito.id})">
                        Modifica
                    </button>
                    `
                    :
                    ""
                }

                ${
                    del
                    ?
                    `
                    <button onclick="cancellaCircuito(${circuito.id})">
                        Cancella
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });

    contenuto.innerHTML = html;
}

function modificaCircuito(id) {

    const circuito =
        DB.circuiti.find(
            c => c.id === id
        );

    formCircuito(circuito);
}

function cancellaCircuito(id) {

    DB.circuiti =
        DB.circuiti.filter(
            c => c.id !== id
        );

    salvaDatabase();

    elencoCircuiti(false, true);
}

/********************************
 EVENTI
********************************/

function formEvento(evento = null) {

    let opzioniCircuiti = "";

    DB.circuiti.forEach(c => {

        opzioniCircuiti += `
            <option value="${c.id}">
                ${c.descrizione}
            </option>
        `;
    });

    contenuto.innerHTML = `

        <h2>
            ${evento ? "Modifica" : "Nuovo"} Evento
        </h2>

        <form id="formEvento" class="form-db">

            <label>Tipo Evento</label>

            <select id="tipoEvento">

                <option value="1">Test Privati</option>
                <option value="2">Test Pubblici</option>
                <option value="3">Gara F1</option>

            </select>

            <label>Descrizione Evento</label>

            <input
                type="text"
                id="descrizioneEvento"
                value="${evento ? evento.descrizione : ""}"
            >

            <label>Anno Evento</label>

            <input
                type="number"
                id="annoEvento"
                value="${evento ? evento.anno : 2026}"
            >

            <label>Data Evento</label>

            <input
                type="date"
                id="dataEvento"
            >

            <label>Circuito</label>

            <select id="circuitoEvento">

                ${opzioniCircuiti}

            </select>

            <label>Stato Evento</label>

            <select id="statoEvento">

                <option value="0">Attivo</option>
                <option value="1">Non Attivo</option>

            </select>

            <button type="submit">
                Salva Evento
            </button>

        </form>
    `;

    document
        .getElementById("formEvento")
        .addEventListener("submit", function(e) {

            e.preventDefault();

            const nuovoEvento = {

                id: evento ? evento.id : generaId(),

                tipo:
                    parseInt(
                        document.getElementById("tipoEvento").value
                    ),

                descrizione:
                    document.getElementById("descrizioneEvento").value,

                anno:
                    parseInt(
                        document.getElementById("annoEvento").value
                    ),

                data:
                    document.getElementById("dataEvento").value,

                circuito:
                    parseInt(
                        document.getElementById("circuitoEvento").value
                    ),

                stato:
                    parseInt(
                        document.getElementById("statoEvento").value
                    )
            };

            if(evento) {

                const index =
                    DB.eventi.findIndex(
                        e => e.id === evento.id
                    );

                DB.eventi[index] = nuovoEvento;

            } else {

                DB.eventi.push(nuovoEvento);
            }

            salvaDatabase();

            elencoEventi();
        });
}

function elencoEventi(edit = false, del = false) {

    let html = `<h2>Calendario Eventi</h2>`;

    DB.eventi.forEach(evento => {

        html += `

            <div class="card-db">

                <h3>${evento.descrizione}</h3>

                <p>Anno: ${evento.anno}</p>

                <p>Data: ${evento.data}</p>

                ${
                    edit
                    ?
                    `
                    <button onclick="modificaEvento(${evento.id})">
                        Modifica
                    </button>
                    `
                    :
                    ""
                }

                ${
                    del
                    ?
                    `
                    <button onclick="cancellaEvento(${evento.id})">
                        Cancella
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });

    contenuto.innerHTML = html;
}

function modificaEvento(id) {

    const evento =
        DB.eventi.find(
            e => e.id === id
        );

    formEvento(evento);
}

function cancellaEvento(id) {

    DB.eventi =
        DB.eventi.filter(
            e => e.id !== id
        );

    salvaDatabase();

    elencoEventi(false, true);
}

/********************************
 VETTURE
********************************/

function formVettura(vettura = null) {

    let opzioniScuderie = "";
    let opzioniPiloti = "";

    DB.scuderie.forEach(s => {

        opzioniScuderie += `
            <option value="${s.id}">
                ${s.descrizione}
            </option>
        `;
    });

    DB.piloti.forEach(p => {

        opzioniPiloti += `
            <option value="${p.id}">
                ${p.nome}
            </option>
        `;
    });

    contenuto.innerHTML = `

        <h2>
            ${vettura ? "Modifica" : "Nuova"} Vettura
        </h2>

        <form id="formVettura" class="form-db">

            <label>Scuderia</label>

            <select id="scuderiaVettura">
                ${opzioniScuderie}
            </select>

            <label>Descrizione Vettura</label>

            <input
                type="text"
                id="descrizioneVettura"
                value="${vettura ? vettura.descrizione : ""}"
            >

            <label>Pilota</label>

            <select id="pilotaVettura">
                ${opzioniPiloti}
            </select>

            <label>Numero Vettura</label>

            <input
                type="number"
                id="numeroVettura"
                value="${vettura ? vettura.numero : 1}"
            >

            <label>Stato Motore</label>

            <input type="number" min="0" max="100"
                id="motoreVettura"
                value="${vettura ? vettura.motore : 100}"
            >

            <label>Stato Aerodinamica</label>

            <input type="number" min="0" max="100"
                id="aeroVettura"
                value="${vettura ? vettura.aerodinamica : 100}"
            >

            <button type="submit">
                Salva Vettura
            </button>

        </form>
    `;

    document
        .getElementById("formVettura")
        .addEventListener("submit", function(e) {

            e.preventDefault();

            const nuovaVettura = {

                id: vettura ? vettura.id : generaId(),

                scuderia:
                    parseInt(
                        document.getElementById("scuderiaVettura").value
                    ),

                descrizione:
                    document.getElementById("descrizioneVettura").value,

                pilota:
                    parseInt(
                        document.getElementById("pilotaVettura").value
                    ),

                numero:
                    parseInt(
                        document.getElementById("numeroVettura").value
                    ),

                motore:
                    parseInt(
                        document.getElementById("motoreVettura").value
                    ),

                aerodinamica:
                    parseInt(
                        document.getElementById("aeroVettura").value
                    )
            };

            if(vettura) {

                const index =
                    DB.vetture.findIndex(
                        v => v.id === vettura.id
                    );

                DB.vetture[index] = nuovaVettura;

            } else {

                DB.vetture.push(nuovaVettura);
            }

            salvaDatabase();

            elencoVetture();
        });
}

function elencoVetture(edit = false, del = false) {

    let html = `<h2>Archivio Vetture</h2>`;

    DB.vetture.forEach(vettura => {

        html += `

            <div class="card-db">

                <h3>${vettura.descrizione}</h3>

                <p>Numero: ${vettura.numero}</p>

                <p>Motore: ${vettura.motore}</p>

                ${
                    edit
                    ?
                    `
                    <button onclick="modificaVettura(${vettura.id})">
                        Modifica
                    </button>
                    `
                    :
                    ""
                }

                ${
                    del
                    ?
                    `
                    <button onclick="cancellaVettura(${vettura.id})">
                        Cancella
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });

    contenuto.innerHTML = html;
}

function modificaVettura(id) {

    const vettura =
        DB.vetture.find(
            v => v.id === id
        );

    formVettura(vettura);
}

function cancellaVettura(id) {

    DB.vetture =
        DB.vetture.filter(
            v => v.id !== id
        );

    salvaDatabase();

    elencoVetture(false, true);
}

/********************************
 CIRCUITI
********************************/

function formCircuito(circuito = null) {

    contenuto.innerHTML = `

        <h2>
            ${circuito ? "Modifica" : "Nuovo"} Circuito
        </h2>

        <form id="formCircuito" class="form-db">

            <label>Descrizione Circuito</label>

            <input
                type="text"
                id="descrizioneCircuito"
                value="${circuito ? circuito.descrizione : ""}"
                required
            >

            <label>Lunghezza Circuito (Km)</label>

            <input
                type="number"
                step="0.01"
                id="lunghezzaCircuito"
                value="${circuito ? circuito.lunghezza : 0}"
                required
            >
    
            <label>Struttura Circuito</label>

            <input
                type="text"
                id="strutturaCircuito"
                value="${circuito ? circuito.struttura : ""}"
            >

            <label>Struttura2 Circuito</label>

            <input
                type="text"
                id="struttura2Circuito"
                value="${circuito ? circuito.struttura2 : ""}"
            >

            <label>Stato Circuito</label>

            <select id="statoCircuito">

                <option value="0">
                    Attivo
                </option>

                <option value="1">
                    Non Attivo
                </option>

            </select>

            <button type="submit">
                Salva Circuito
            </button>

        </form>
    `;

    document
        .getElementById("formCircuito")
        .addEventListener("submit", function(e) {

            e.preventDefault();

            const nuovoCircuito = {

                id:
                    circuito
                        ? circuito.id
                        : generaId(),

                descrizione:
                    document.getElementById("descrizioneCircuito").value,

                lunghezza:
                    parseFloat(
                        document.getElementById("lunghezzaCircuito").value
                    ),

                struttura:
                    document.getElementById("strutturaCircuito").value,

                struttura2:
                    document.getElementById("struttura2Circuito").value,


                stato:
                    parseInt(
                        document.getElementById("statoCircuito").value
                    )
            };

            if(circuito) {

                const index =
                    DB.circuiti.findIndex(
                        c => c.id === circuito.id
                    );

                DB.circuiti[index] = nuovoCircuito;

            } else {

                DB.circuiti.push(nuovoCircuito);
            }

            salvaDatabase();

            elencoCircuiti();
        });
}

function elencoCircuiti(edit = false, del = false) {

    let html = `
        <h2>Archivio Circuiti</h2>
    `;

    if(DB.circuiti.length === 0) {

        html += `
            <p>Nessun circuito presente</p>
        `;
    }

    DB.circuiti.forEach(circuito => {

        html += `

            <div class="card-db">

                <h3>
                    ${circuito.descrizione}
                </h3>

                <p>
                    Lunghezza:
                    ${circuito.lunghezza} Km
                </p>

                <p>
                    Struttura:
                    ${circuito.struttura}
                </p>

                <p>
                    Struttura2:
                    ${circuito.struttura2}
                </p>
                    
                <p>
                    Stato:
                    ${circuito.stato === 0
                        ? "Attivo"
                        : "Non Attivo"}
                </p>

                ${
                    edit
                    ?
                    `
                    <button
                        onclick="modificaCircuito(${circuito.id})">
                        Modifica
                    </button>
                    `
                    :
                    ""
                }

                ${
                    del
                    ?
                    `
                    <button
                        onclick="cancellaCircuito(${circuito.id})">
                        Cancella
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });

    contenuto.innerHTML = html;
}

function modificaCircuito(id) {

    const circuito =
        DB.circuiti.find(
            c => c.id === id
        );

    formCircuito(circuito);
}

function cancellaCircuito(id) {

    DB.circuiti =
        DB.circuiti.filter(
            c => c.id !== id
        );

    salvaDatabase();

    elencoCircuiti(false, true);
}

/********************************
 CALENDARIO EVENTI
********************************/

function formEvento(evento = null) {

    let opzioniCircuiti = "";

    DB.circuiti.forEach(circuito => {

        opzioniCircuiti += `

            <option value="${circuito.id}">

                ${circuito.descrizione}

            </option>
        `;
    });

    contenuto.innerHTML = `

        <h2>
            ${evento ? "Modifica" : "Nuovo"} Evento
        </h2>

        <form id="formEvento" class="form-db">

            <label>Tipo Evento</label>

            <select id="tipoEvento">

                <option value="1">
                    Test Privati
                </option>

                <option value="2">
                    Test Pubblici
                </option>

                <option value="3">
                    Gara F1
                </option>

            </select>

            <label>Descrizione Evento</label>

            <input
                type="text"
                id="descrizioneEvento"
                value="${evento ? evento.descrizione : ""}"
                required
            >

            <label>Anno Evento</label>

            <input
                type="number"
                id="annoEvento"
                value="${evento ? evento.anno : 2026}"
            >

            <label>Data Evento</label>

            <input
                type="date"
                id="dataEvento"
                value="${evento ? evento.data : ""}"
            >

            <label>Circuito</label>

            <select id="circuitoEvento">

                ${opzioniCircuiti}

            </select>

            <label>Stato Evento</label>

            <select id="statoEvento">

                <option value="0">
                    Attivo
                </option>

                <option value="1">
                    Non Attivo
                </option>

            </select>

            <button type="submit">
                Salva Evento
            </button>

        </form>
    `;

    document
        .getElementById("formEvento")
        .addEventListener("submit", function(e) {

            e.preventDefault();

            const nuovoEvento = {

                id:
                    evento
                        ? evento.id
                        : generaId(),

                tipo:
                    parseInt(
                        document.getElementById("tipoEvento").value
                    ),

                descrizione:
                    document.getElementById("descrizioneEvento").value,

                anno:
                    parseInt(
                        document.getElementById("annoEvento").value
                    ),

                data:
                    document.getElementById("dataEvento").value,

                circuito:
                    parseInt(
                        document.getElementById("circuitoEvento").value
                    ),

                stato:
                    parseInt(
                        document.getElementById("statoEvento").value
                    )
            };

            if(evento) {

                const index =
                    DB.eventi.findIndex(
                        e => e.id === evento.id
                    );

                DB.eventi[index] = nuovoEvento;

            } else {

                DB.eventi.push(nuovoEvento);
            }

            salvaDatabase();

            elencoEventi();
        });
}

function elencoEventi(edit = false, del = false) {

    let html = `
        <h2>Calendario Eventi</h2>
    `;

    if(DB.eventi.length === 0) {

        html += `
            <p>Nessun evento presente</p>
        `;
    }

    DB.eventi.forEach(evento => {

        html += `

            <div class="card-db">

                <h3>
                    ${evento.descrizione}
                </h3>

                <p>
                    Anno:
                    ${evento.anno}
                </p>

                <p>
                    Data:
                    ${evento.data}
                </p>

                <p>
                    Tipo:
                    ${evento.tipo}
                </p>

                ${
                    edit
                    ?
                    `
                    <button
                        onclick="modificaEvento(${evento.id})">
                        Modifica
                    </button>
                    `
                    :
                    ""
                }

                ${
                    del
                    ?
                    `
                    <button
                        onclick="cancellaEvento(${evento.id})">
                        Cancella
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });

    contenuto.innerHTML = html;
}

function modificaEvento(id) {

    const evento =
        DB.eventi.find(
            e => e.id === id
        );

    formEvento(evento);
}

function cancellaEvento(id) {

    DB.eventi =
        DB.eventi.filter(
            e => e.id !== id
        );

    salvaDatabase();

    elencoEventi(false, true);
}

/********************************
 VETTURE
********************************/

function formVettura(vettura = null) {

    let opzioniScuderie = "";
    let opzioniPiloti = "";

    DB.scuderie.forEach(scuderia => {

        opzioniScuderie += `

            <option value="${scuderia.id}">

                ${scuderia.descrizione}

            </option>
        `;
    });

    DB.piloti.forEach(pilota => {

        opzioniPiloti += `

            <option value="${pilota.id}">

                ${pilota.nome}

            </option>
        `;
    });

    contenuto.innerHTML = `

        <h2>
            ${vettura ? "Modifica" : "Nuova"} Vettura
        </h2>

        <form id="formVettura" class="form-db">

            <label>Scuderia</label>

            <select id="scuderiaVettura">

                ${opzioniScuderie}

            </select>

            <label>Descrizione Vettura</label>

            <input
                type="text"
                id="descrizioneVettura"
                value="${vettura ? vettura.descrizione : ""}"
                required
            >

            <label>Pilota</label>

            <select id="pilotaVettura">

                ${opzioniPiloti}

            </select>

            <label>Numero Vettura</label>

            <input
                type="number"
                id="numeroVettura"
                value="${vettura ? vettura.numero : 1}"
            >

            <label>Stato Motore</label>

            <input
                type="number"
                min="0"
                max="100"
                id="motoreVettura"
                value="${vettura ? vettura.motore : 100}"
            >

            <label>Stato Aerodinamica</label>

            <input
                type="number"
                min="0"
                max="100"
                id="aeroVettura"
                value="${vettura ? vettura.aerodinamica : 100}"
            >

            <label>Stato Sospensioni</label>

            <input
                type="number"
                min="0"
                max="100"
                id="sospensioniVettura"
                value="${vettura ? vettura.sospensioni : 100}"
            >

            <label>Stato Cambio</label>

            <input
                type="number"
                min="0"
                max="100"
                id="cambioVettura"
                value="${vettura ? vettura.cambio : 100}"
            >

            <label>Stato Vettura</label>

            <select id="statoVettura">

                <option value="0">
                    Attiva
                </option>

                <option value="1">
                    Non Attiva
                </option>

            </select>

            <button type="submit">
                Salva Vettura
            </button>

        </form>
    `;

    document
        .getElementById("formVettura")
        .addEventListener("submit", function(e) {

            e.preventDefault();

            const nuovaVettura = {

                id:
                    vettura
                        ? vettura.id
                        : generaId(),

                scuderia:
                    parseInt(
                        document.getElementById("scuderiaVettura").value
                    ),

                descrizione:
                    document.getElementById("descrizioneVettura").value,

                pilota:
                    parseInt(
                        document.getElementById("pilotaVettura").value
                    ),

                numero:
                    parseInt(
                        document.getElementById("numeroVettura").value
                    ),

                motore:
                    parseInt(
                        document.getElementById("motoreVettura").value
                    ),

                aerodinamica:
                    parseInt(
                        document.getElementById("aeroVettura").value
                    ),

                sospensioni:
                    parseInt(
                        document.getElementById("sospensioniVettura").value
                    ),

                cambio:
                    parseInt(
                        document.getElementById("cambioVettura").value
                    ),

                stato:
                    parseInt(
                        document.getElementById("statoVettura").value
                    )
            };

            if(vettura) {

                const index =
                    DB.vetture.findIndex(
                        v => v.id === vettura.id
                    );

                DB.vetture[index] = nuovaVettura;

            } else {

                DB.vetture.push(nuovaVettura);
            }

            salvaDatabase();

            elencoVetture();
        });
}

function elencoVetture(edit = false, del = false) {

    let html = `
        <h2>Archivio Vetture</h2>
    `;

    if(DB.vetture.length === 0) {

        html += `
            <p>Nessuna vettura presente</p>
        `;
    }

    DB.vetture.forEach(vettura => {

        html += `

            <div class="card-db">

                <h3>
                    ${vettura.descrizione}
                </h3>

                <p>
                    Numero:
                    ${vettura.numero}
                </p>

                <p>
                    Motore:
                    ${vettura.motore}
                </p>

                <p>
                    Aerodinamica:
                    ${vettura.aerodinamica}
                </p>

                ${
                    edit
                    ?
                    `
                    <button
                        onclick="modificaVettura(${vettura.id})">
                        Modifica
                    </button>
                    `
                    :
                    ""
                }

                ${
                    del
                    ?
                    `
                    <button
                        onclick="cancellaVettura(${vettura.id})">
                        Cancella
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });

    contenuto.innerHTML = html;
}

function modificaVettura(id) {

    const vettura =
        DB.vetture.find(
            v => v.id === id
        );

    formVettura(vettura);
}

function cancellaVettura(id) {

    DB.vetture =
        DB.vetture.filter(
            v => v.id !== id
        );

    salvaDatabase();

    elencoVetture(false, true);
}
