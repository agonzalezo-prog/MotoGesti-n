document.getElementById("formIngreso").addEventListener("submit", function(e) {
    e.preventDefault();

    const ordenes = obtenerOrdenes();
    const codigo = generarCodigoOrden();

    const hoy = new Date().toISOString().split("T")[0];

    const nuevaOrden = {
        codigo: codigo,
        fechaIngreso: hoy,
        estado: "Diagnóstico",
        propietario: {
            nombre: document.getElementById("propietario").value,
            documento: document.getElementById("documento").value,
            telefono: document.getElementById("telefono").value
        },
        moto: {
            marca: document.getElementById("marca").value,
            modelo: document.getElementById("modelo").value,
            cilindraje: document.getElementById("cilindraje").value,
            placa: document.getElementById("placa").value,
            color: document.getElementById("color").value,
            anio: document.getElementById("anio").value
        },
        kilometraje: document.getElementById("km").value,
        tipoServicio: document.getElementById("tipoServicio").value,
        descripcion: document.getElementById("descripcion").value,
        
        bitacora: [],
        repuestos: [],
        servicios: [],
        factura: null
    };

    ordenes.push(nuevaOrden);
    guardarOrdenes(ordenes);

    document.getElementById("mensajeIngreso").innerHTML =
        `✅ Orden guardada con código: <b>${codigo}</b>`;

    document.getElementById("formIngreso").reset();

    cargarDashboard();
});