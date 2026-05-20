async function generaCircuito(nomeCircuito) {

  const searchUrl =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeCircuito)}&format=json`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (!searchData.length) {
    throw new Error("Circuito non trovato");
  }

  const circuito = searchData[0];

  const lat = circuito.lat;
  const lon = circuito.lon;

  const overpassQuery = `
    [out:json][timeout:25];
  
    (
      way(around:3000,${lat},${lon})["sport"="motor"];
      relation(around:3000,${lat},${lon})["sport"="motor"];
      way(around:3000,${lat},${lon})["leisure"="track"];
    );
  
    out geom;
  `;

  const trackRes = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: overpassQuery
    }
  );
  
    if (!trackRes.ok) {
        
        throw new Error(
            'Errore HTTP: ${trackRes.status}'
        );
    }
    
    /* console.log(trackRes);  inibita 19/0//26 ire 16:37 */
   
    const testo = await trackRes.text();
    
    console.log(testo);
    
    const trackData = JSON.parse(testo);
    
    console.log(trackData);

  if (!trackData.elements ||
      !trackData.elements.length) {
    throw new Error("Tracciato non trovato");
  }

  /* const points = trackData.elements[0].geometry; */

    let points = [];

    for (const el of trackData.elements) {

        if (el.geometry) {

            points.push(...el.geometry);
        }
    }

    console.log(
        "punti totali:",
        points.length
    );

    console.log(points.length);
    
  const segmenti100m =
        creaSegmenti100m(points);
    
    console.log(
        "lunghezza stimata:",
        segmenti100m.length * 100
    );

    console.log(
        "numero segmenti:",
        segmenti100m.length
    );
    
  console.log("segmenti100m:",segmenti100m.lenght);
    
  let layout = "";
  let larghezza = "";

  /* for (let i = 1; i < points.length - 1; i++) { */

  for (let i = 1;
         i < segmenti100m.length - 1;
         i++) {
        
    /* const p1 = points[i - 1];
    const p2 = points[i];
    const p3 = points[i + 1];

    const angolo = calcolaAngolo(p1, p2, p3); */

    const angolo = calcolaAngolo(
          segmenti100m[i - 1],
          segmenti100m[i],
          segmenti100m[i + 1]
    );
      
    if (angolo < 8) {
      layout += "R";
      larghezza += "4";
    }
    else if (angolo < 25) {
      layout += "C";
      larghezza += "3";
    }
    else {
      layout += "G";
      larghezza += "2";
    }
  }

  return {
    nome: circuito.display_name,
    layout,
    larghezza,
    segmenti: layout.length
  };
}
