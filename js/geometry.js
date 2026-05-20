function calcolaAngolo(a, b, c) {

  const abx = b.lon - a.lon;
  const aby = b.lat - a.lat;

  const bcx = c.lon - b.lon;
  const bcy = c.lat - b.lat;

  const dot = abx * bcx + aby * bcy;

  const mag1 = Math.sqrt(abx * abx + aby * aby);
  const mag2 = Math.sqrt(bcx * bcx + bcy * bcy);

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  let cos = dot / (mag1 * mag2);

  cos = Math.max(-1, Math.min(1, cos));

  return Math.acos(cos) * 180 / Math.PI;
}

function calcolaDistanza(a, b) {

    const R = 6371e3;

    const lat1 =
        a.lat * Math.PI / 180;

    const lat2 =
        b.lat * Math.PI / 180;

    const deltaLat =
        (b.lat - a.lat) *
        Math.PI / 180;

    const deltaLon =
        (b.lon - a.lon) *
        Math.PI / 180;

    const x =
        Math.sin(deltaLat / 2) *
        Math.sin(deltaLat / 2) +

        Math.cos(lat1) *
        Math.cos(lat2) *

        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const y =
        2 * Math.atan2(
            Math.sqrt(x),
            Math.sqrt(1 - x)
        );

    return R * y;
}

function creaSegmenti100m(points) {

    let distanzaAccum = 0;

    let segmenti = [];

    segmenti.push(points[0]);

    for (let i = 1; i < points.length; i++) {

        distanzaAccum +=
            calcolaDistanza(
                points[i - 1],
                points[i]
            );

        if (distanzaAccum >= 100) {

            segmenti.push(points[i]);

            distanzaAccum -= 100;
        }
    }

    return segmenti;
}
