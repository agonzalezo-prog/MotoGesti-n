function obtenerOrdenes() {
    return JSON.parse(localStorage.getItem("ordenes")) || [];
}

function guardarOrdenes(ordenes) {
    localStorage.setItem("ordenes", JSON.stringify(ordenes));
}

function generarCodigoOrden() {
    return "ORD-" + Date.now();
}