function cargarOrdenesFactura() {
    const ordenes = obtenerOrdenes();
    const select = document.getElementById("selectOrdenFactura");

    select.innerHTML = "<option value=''>Seleccione...</option>";

    ordenes.forEach(o => {
        select.innerHTML += `<option value="${o.codigo}">${o.codigo} - ${o.moto.placa}</option>`;
    });

    select.onchange = mostrarResumenFactura;
}

function mostrarResumenFactura() {
    const codigo = document.getElementById("selectOrdenFactura").value;
    const ordenes = obtenerOrdenes();
    const orden = ordenes.find(o => o.codigo === codigo);

    if (!orden) return;

    let html = `
        <h3>Resumen Orden ${orden.codigo}</h3>
        <p><b>Cliente:</b> ${orden.propietario.nombre}</p>
        <p><b>Moto:</b> ${orden.moto.marca} - ${orden.moto.placa}</p>
        <p><b>Estado:</b> ${orden.estado}</p>

        <h4>Repuestos</h4>
    `;

    orden.repuestos.forEach(r => {
        html += `<p>${r.nombre} x${r.cantidad} = $${r.subtotal.toLocaleString()}</p>`;
    });

    html += `<h4>Servicios</h4>`;

    orden.servicios.forEach(s => {
        html += `<p>${s.servicio} = $${s.valor.toLocaleString()}</p>`;
    });

    const total = calcularTotal(orden);

    html += `<h3>Total a pagar: $${total.toLocaleString()}</h3>`;

    document.getElementById("resumenFactura").innerHTML = html;
}

function guardarFactura() {
    const codigo = document.getElementById("selectOrdenFactura").value;
    const ordenes = obtenerOrdenes();
    const orden = ordenes.find(o => o.codigo === codigo);

    if (!orden) return;

    orden.factura = {
        total: calcularTotal(orden),
        estadoPago: document.getElementById("estadoPago").value,
        metodoPago: document.getElementById("metodoPago").value,
        fecha: new Date().toLocaleString()
    };

    if (orden.factura.estadoPago === "Pagado") {
        orden.estado = "Entregada";
    }

    guardarOrdenes(ordenes);

    document.getElementById("mensajeFactura").innerText = "✅ Factura guardada correctamente.";
    cargarDashboard();
}

function imprimirFactura() {
    window.print();
}