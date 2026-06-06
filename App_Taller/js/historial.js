function mostrarHistorialFacturas() {
    const ordenes = obtenerOrdenes();
    const contenedor = document.getElementById("listaFacturas");

    const busqueda = document.getElementById("buscarFactura").value.toLowerCase();

    // Filtrar solo las órdenes que tienen factura
    let facturas = ordenes.filter(o => o.factura !== null);

    // Aplicar filtro de búsqueda
    if (busqueda.trim() !== "") {
        facturas = facturas.filter(o =>
            o.propietario.nombre.toLowerCase().includes(busqueda) ||
            o.moto.placa.toLowerCase().includes(busqueda)
        );
    }

    if (facturas.length === 0) {
        contenedor.innerHTML = "<p>❌ No hay facturas registradas.</p>";
        return;
    }

    let html = `
        <table class="tabla">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Placa</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Pago</th>
                    <th>Método</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    facturas.forEach(o => {
        html += `
            <tr>
                <td>${o.codigo}</td>
                <td>${o.propietario.nombre}</td>
                <td>${o.moto.placa}</td>
                <td>${o.factura.fecha}</td>
                <td>$${o.factura.total.toLocaleString()}</td>
                <td>${o.factura.estadoPago}</td>
                <td>${o.factura.metodoPago}</td>
                <td>
                    <button class="btn-secundario" onclick="imprimirFacturaHistorial('${o.codigo}')">
                        🖨️ Imprimir
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    contenedor.innerHTML = html;
}

function imprimirFacturaHistorial(codigo) {
    const ordenes = obtenerOrdenes();
    const orden = ordenes.find(o => o.codigo === codigo);

    if (!orden) return;

    let ventana = window.open("", "_blank");

    let html = `
        <html>
        <head>
            <title>Factura ${orden.codigo}</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
            </style>
        </head>
        <body>

            <h2>🧾 FACTURA - ${orden.codigo}</h2>
            <p><b>Cliente:</b> ${orden.propietario.nombre}</p>
            <p><b>Documento:</b> ${orden.propietario.documento}</p>
            <p><b>Teléfono:</b> ${orden.propietario.telefono}</p>

            <p><b>Moto:</b> ${orden.moto.marca} ${orden.moto.modelo}</p>
            <p><b>Placa:</b> ${orden.moto.placa}</p>

            <h3>Repuestos</h3>
            <table>
                <tr><th>Nombre</th><th>Cantidad</th><th>Valor</th><th>Subtotal</th></tr>
    `;

    orden.repuestos.forEach(r => {
        html += `
            <tr>
                <td>${r.nombre}</td>
                <td>${r.cantidad}</td>
                <td>$${r.valor.toLocaleString()}</td>
                <td>$${r.subtotal.toLocaleString()}</td>
            </tr>
        `;
    });

    html += `
            </table>

            <h3>Servicios</h3>
            <table>
                <tr><th>Servicio</th><th>Valor</th></tr>
    `;

    orden.servicios.forEach(s => {
        html += `
            <tr>
                <td>${s.servicio}</td>
                <td>$${s.valor.toLocaleString()}</td>
            </tr>
        `;
    });

    html += `
            </table>

            <h3>Total: $${orden.factura.total.toLocaleString()}</h3>
            <p><b>Estado Pago:</b> ${orden.factura.estadoPago}</p>
            <p><b>Método Pago:</b> ${orden.factura.metodoPago}</p>
            <p><b>Fecha:</b> ${orden.factura.fecha}</p>

            <script>
                window.print();
            </script>
        </body>
        </html>
    `;

    ventana.document.write(html);
    ventana.document.close();
}