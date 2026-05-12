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


// GESTIONE CLICK AZIONI
document.querySelectorAll(".submenu li").forEach(item => {
  item.addEventListener("click", () => {
    const action = item.dataset.action;
    const contenuto = document.getElementById("contenuto");

    switch (action) {
      case "add-scuderia":
        contenuto.innerHTML = "<h2>Aggiungi Scuderia</h2>";
        break;

      case "edit-scuderia":
        contenuto.innerHTML = "<h2>Modifica Scuderia</h2>";
        break;

      case "delete-scuderia":
        contenuto.innerHTML = "<h2>Cancella Scuderia</h2>";
        break;

      case "add-pilota":
        contenuto.innerHTML = "<h2>Aggiungi Pilota</h2>";
        break;

      case "edit-pilota":
        contenuto.innerHTML = "<h2>Modifica Pilota</h2>";
        break;

      case "delete-pilota":
        contenuto.innerHTML = "<h2>Cancella Pilota</h2>";
        break;

      case "add-circuito":
        contenuto.innerHTML = "<h2>Aggiungi Circuito</h2>";
        break;
            
      case "edit-circuito":
          contenuto.innerHTML = "<h2>Modifica Circuito</h2>";
          break;
            
      case "delete-circuito":
          contenuto.innerHTML = "<h2>Cancella Circuito</h2>";
          break;
        
      case "add-gara":
          contenuto.innerHTML = "<h2>Aggiungi Evento</h2>";
          break;
              
      case "edit-gara":
            contenuto.innerHTML = "<h2>Modifica Evento</h2>";
            break;
              
      case "delete-gara":
            contenuto.innerHTML = "<h2>Cancella Evento</h2>";
            break;
       
      case "add-vettura":
            contenuto.innerHTML = "<h2>Aggiungi Vettura</h2>";
            break;
                
      case "edit-vettura":
              contenuto.innerHTML = "<h2>Modifica Vettura</h2>";
              break;
                
      case "delete-vettura":
              contenuto.innerHTML = "<h2>Cancella Vettura</h2>";
              break;
        
        default:
        contenuto.innerHTML = "<h2>Azione non riconosciuta</h2>";
    }
  });
});
