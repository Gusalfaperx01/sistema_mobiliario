let inventario = [];
let editandoIndex = null;


function generarFolioUnico() {
    const fecha = new Date();
    const timestamp = fecha.getTime().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `UPN-${timestamp}-${random}`;
}

const form = document.getElementById('registroForm');
const qrcodeContainer = document.getElementById('qrcode');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const estado = document.getElementById('estado').value;
    const observaciones = document.getElementById('observaciones').value || 'Sin observaciones';

    let folioActual = "";

    if (editandoIndex !== null) {
        
        inventario[editandoIndex].tipo = tipo;
        inventario[editandoIndex].ubicacion = ubicacion;
        inventario[editandoIndex].estado = estado;
        inventario[editandoIndex].observaciones = observaciones;
        
        folioActual = inventario[editandoIndex].folio;
        editandoIndex = null;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fa-solid fa-qrcode"></i> Registrar y Generar Código QR';
    } else {
        
        folioActual = generarFolioUnico();
        const nuevoRegistro = { folio: folioActual, tipo, ubicacion, estado, observaciones };
        inventario.unshift(nuevoRegistro);
    }

    
    actualizarTabla();

    
    mostrarQRCard(folioActual, tipo, ubicacion, estado, observaciones);

    
    form.reset();
});

function actualizarTabla() {
    const tbody = document.getElementById('tablaCuerpo');
    tbody.innerHTML = "";

    document.getElementById('totalCount').textContent = inventario.length;

    inventario.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition";
        
        let badgeClass = "bg-green-100 text-green-800";
        if(item.estado === "Regular") badgeClass = "bg-amber-100 text-amber-800";
        if(item.estado === "Malo") badgeClass = "bg-red-100 text-red-800";
        if(item.estado === "Mantenimiento") badgeClass = "bg-purple-100 text-purple-800";

        tr.innerHTML = `
            <td class="py-2.5 px-3 font-mono font-semibold text-indigo-600 text-xs">${item.folio}</td>
            <td class="py-2.5 px-3 font-medium text-slate-800">${item.tipo}</td>
            <td class="py-2.5 px-3">${item.ubicacion}</td>
            <td class="py-2.5 px-3">
                <span class="text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}">${item.estado}</span>
            </td>
            <td class="py-2.5 px-3 text-center space-x-2">
                <button onclick="verQR('${item.folio}')" class="text-indigo-600 hover:text-indigo-800 text-xs font-semibold" title="Ver QR">
                    <i class="fa-solid fa-qrcode"></i>
                </button>
                <button onclick="prepararEdicion(${index})" class="text-amber-600 hover:text-amber-800 text-xs font-semibold" title="Modificar">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarRegistro(${index})" class="text-red-600 hover:text-red-800 text-xs font-semibold" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function mostrarQRCard(folio, tipo, ubicacion, estado, observaciones) {
    const contenidoQR = JSON.stringify({
        institucion: "UPN 041 Campeche",
        folio: folio,
        tipo: tipo,
        ubicacion: ubicacion,
        estado: estado,
        observaciones: observaciones
    });

    qrcodeContainer.innerHTML = "";
    new QRCode(qrcodeContainer, {
        text: contenidoQR,
        width: 120,
        height: 120,
        colorDark : "#1e1b4b",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    document.getElementById('resMueble').textContent = tipo;
    document.getElementById('resFolio').textContent = folio;
    document.getElementById('resUbicacion').textContent = ubicacion;
    document.getElementById('resEstado').textContent = estado;
    document.getElementById('qrCard').classList.remove('hidden');
}

function verQR(folio) {
    const item = inventario.find(i => i.folio === folio);
    if(item) {
        mostrarQRCard(item.folio, item.tipo, item.ubicacion, item.estado, item.observaciones);
    }
}

function prepararEdicion(index) {
    const item = inventario[index];
    document.getElementById('tipo').value = item.tipo;
    document.getElementById('ubicacion').value = item.ubicacion;
    document.getElementById('estado').value = item.estado;
    document.getElementById('observaciones').value = item.observaciones;

    editandoIndex = index;
    form.querySelector('button[type="submit"]').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Actualizar Mueble';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminarRegistro(index) {
    if (confirm("¿Estás seguro de eliminar este mueble del inventario?")) {
        inventario.splice(index, 1);
        actualizarTabla();
        document.getElementById('qrCard').classList.add('hidden');
    }
}


inventario = [
    { folio: "UPN-L8X9A1-9872", tipo: "Silla de Paleta / Aula", ubicacion: "Aula 1", estado: "Bueno", observaciones: "Sin detalles" },
    { folio: "UPN-L8X9B4-1145", tipo: "Mesa / Escritorio", ubicacion: "Oficina Administrativa", estado: "Regular", observaciones: "Desgaste leve" }
];
actualizarTabla();