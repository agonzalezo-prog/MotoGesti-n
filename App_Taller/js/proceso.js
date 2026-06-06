function cargarOrdenesProceso() {
    const ordenes = obtenerOrdenes();
    const select = document.getElementById("selectOrdenProceso");

    select.innerHTML = "<option value=''>Seleccione...</option>";

    ordenes.forEach(o => {
        select.innerHTML += `<option value="${o.codigo}">${o.codigo} - ${o.moto.placa}</option>`;
    });

    select.onchange = mostrarInfoProceso;
}

function mostrarInfoProceso() {
    const codigo = document.getElementById("selectOrdenProceso").value;
    const ordenes = obtenerOrdenes();
    const orden = ordenes.find(o => o.codigo === codigo);

    if (!orden) return;

    document.getElementById("infoOrdenProceso").innerHTML = `
        <p><b>Cliente:</b> ${orden.propietario.nombre}</p>
        <p><b>Moto:</b> ${orden.moto.marca} - ${orden.moto.placa}</p>
        <p><b>Estado actual:</b> ${orden.estado}</p>
    `;

    document.getElementById("estadoProceso").value = orden.estado;

    actualizarBarraProgreso(orden.estado);
    mostrarListasProceso(orden);
}

function actualizarEstadoProceso() {
    const codigo = document.getElementById("selectOrdenProceso").value;
    const estadoNuevo = document.getElementById("estadoProceso").value;

    const ordenes = obtenerOrdenes();
    const orden = ordenes.find(o => o.codigo === codigo);

    if (!orden) return;

    orden.estado = estadoNuevo;
    guardarOrdenes(ordenes);

    actualizarBarraProgreso(estadoNuevo);
    mostrarInfoProceso();
    cargarDashboard();
}

function actualizarBarraProgreso(estado) {
    const barra = document.getElementById("progresoBarra");

    let porcentaje = 0;

    if (estado === "Diagnóstico") porcentaje = 20;
    if (estado === "Desarme") porcentaje = 40;
    if (estado === "Reparación") porcentaje = 60;
    if (estado === "Pruebas") porcentaje = 80;
    if (estado === "Listo para entrega") porcentaje = 100;

    barra.style.width = porcentaje + "%";
}

function agregarBitacora() {
    const codigo = document.getElementById("selectOrdenProceso").value;
    const ordenes = obtenerOrdenes();
    const orden = ordenes.find(o => o.codigo === codigo);

    if (!orden) return;

    const registro = {
        fecha: new Date().toLocaleString(),
        mecanico: document.getElementById("mecanico").value,
        actividad: document.getElementById("actividad").value,
        observacion: document.getElementById("observacion").value
    };

    orden.bitacora.push(registro);
    guardarOrdenes(ordenes);

    document.getElementById("mecanico").value = "";
    document.getElementById("actividad").value = "";
    document.getElementById("observacion").value = "";

    mostrarInfoProceso();
}

function agregarRepuesto() {
    const codigo = document.getElementById("selectOrdenProceso").value;
    const ordenes = obtenerOrdenes();
    const orden = ordenes.find(o => o.codigo === codigo);

    if (!orden) return;

    const nombre = document.getElementById("repuestoNombre").value;
    const cantidad = parseInt(document.getElementById("repuestoCantidad").value);
    const valor = parseInt(document.getElementById("repuestoValor").value);

    const subtotal = cantidad * valor;

    orden.repuestos.push({ nombre, cantidad, valor, subtotal });
    guardarOrdenes(ordenes);

    document.getElementById("repuestoNombre").value = "";
    document.getElementById("repuestoCantidad").value = "";
    document.getElementById("repuestoValor").value = "";

    mostrarInfoProceso();
}

function agregarServicio() {
    const codigo = document.getElementById("selectOrdenProceso").value;
    const ordenes = obtenerOrdenes();
    const orden = ordenes.find(o => o.codigo === codigo);

    if (!orden) return;

    const servicio = document.getElementById("servicioNombre").value;
    const valor = parseInt(document.getElementById("servicioValor").value);

    orden.servicios.push({ servicio, valor });
    guardarOrdenes(ordenes);

    document.getElementById("servicioNombre").value = "";
    document.getElementById("servicioValor").value = "";

    mostrarInfoProceso();
}

function calcularTotal(orden) {
    let totalRepuestos = orden.repuestos.reduce((sum, r) => sum + r.subtotal, 0);
    let totalServicios = orden.servicios.reduce((sum, s) => sum + s.valor, 0);

    return totalRepuestos + totalServicios;
}

function mostrarListasProceso(orden) {
    let bitacoraHTML = "<h4>Bitácora</h4>";
    orden.bitacora.forEach(b => {
        bitacoraHTML += `<p>🕒 ${b.fecha} - <b>${b.mecanico}</b>: ${b.actividad} (${b.observacion})</p>`;
    });
    document.getElementById("listaBitacora").innerHTML = bitacoraHTML;

    let repuestosHTML = "<h4>Repuestos</h4>";
    orden.repuestos.forEach(r => {
        repuestosHTML += `<p>${r.nombre} x${r.cantidad} = $${r.subtotal}</p>`;
    });
    document.getElementById("listaRepuestos").innerHTML = repuestosHTML;

    let serviciosHTML = "<h4>Servicios</h4>";
    orden.servicios.forEach(s => {
        serviciosHTML += `<p>${s.servicio} = $${s.valor}</p>`;
    });
    document.getElementById("listaServicios").innerHTML = serviciosHTML;

    document.getElementById("totalGeneralProceso").innerText =
        "$" + calcularTotal(orden).toLocaleString();
}