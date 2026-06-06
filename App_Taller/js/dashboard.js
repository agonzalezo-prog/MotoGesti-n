function cargarDashboard() {
    const ordenes = obtenerOrdenes();
    const hoy = new Date().toISOString().split("T")[0];

    let ingresadasHoy = ordenes.filter(o => o.fechaIngreso === hoy).length;
    let enProceso = ordenes.filter(o => o.estado !== "Entregada" && o.estado !== "Listo para entrega").length;
    let listas = ordenes.filter(o => o.estado === "Listo para entrega").length;
    let entregadas = ordenes.filter(o => o.estado === "Entregada").length;

    document.getElementById("totalHoy").innerText = ingresadasHoy;
    document.getElementById("totalProceso").innerText = enProceso;
    document.getElementById("totalListas").innerText = listas;
    document.getElementById("totalEntregadas").innerText = entregadas;

    // Agenda del día
    let agendaHTML = "";
    ordenes.filter(o => o.fechaIngreso === hoy).forEach(o => {
        agendaHTML += `<p>📌 ${o.codigo} - ${o.moto.placa} (${o.estado})</p>`;
    });
    document.getElementById("agendaDia").innerHTML = agendaHTML || "<p>No hay motos ingresadas hoy.</p>";

    // Alertas atrasadas (más de 3 días en taller)
    let alertasHTML = "";
    ordenes.forEach(o => {
        let fecha = new Date(o.fechaIngreso);
        let hoyFecha = new Date();
        let diffDias = (hoyFecha - fecha) / (1000 * 60 * 60 * 24);

        if (diffDias > 3 && o.estado !== "Entregada") {
            alertasHTML += `<p>⚠️ ${o.codigo} - ${o.moto.placa} lleva ${Math.floor(diffDias)} días en taller</p>`;
        }
    });

    document.getElementById("alertas").innerHTML = alertasHTML || "<p>No hay motos atrasadas.</p>";
}