function mostrarModulo(id) {
    document.querySelectorAll(".modulo").forEach(modulo => {
        modulo.classList.remove("activo");
    });

    document.getElementById(id).classList.add("activo");

    if (id === "dashboard") cargarDashboard();
    if (id === "proceso") cargarOrdenesProceso();
    if (id === "factura") cargarOrdenesFactura();
    if (id === "historial") mostrarHistorialFacturas();
}

window.onload = function() {
    cargarDashboard();
};