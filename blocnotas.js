const getEl = (id) => document.getElementById(id);

window.onload = mostrarNotas;

// Función centralizada para avisos visuales (sustituye a los alert)
function mostrarAviso(texto, tipo) {
    const mensajeEl = getEl('mensaje');
    if (!mensajeEl) return;

    mensajeEl.innerText = texto;
    mensajeEl.className = tipo === 'error' ? 'msg-error' : 'msg-exito';

    // El mensaje desaparece a los 3 segundos
    setTimeout(() => {
        mensajeEl.innerText = "";
        mensajeEl.className = "";
    }, 3000);
}

function mostrarNotas() {
    const contenedor = getEl('listaNotasGuardadas');
    if (!contenedor) return;

    const notas = JSON.parse(localStorage.getItem('misNotasArray')) || [];
    let htmlFinal = `<h3>Notas Guardadas (${notas.length}/3):</h3>`;

    notas.forEach((nota, index) => {
        htmlFinal += `
            <div style="margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div class="tarjeta-nota" 
                     onclick="toggleNota(${index})" 
                     style="background: #eee; padding: 10px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                    <strong>${nota.titulo}</strong>
                    <button class="btn-borrar" onclick="event.stopPropagation(); borrarNota(${index})">Borrar</button>
                </div>
                <div id="cuerpo-${index}" class="cuerpo-nota" style="display: none; padding: 15px; background: white; white-space: pre-wrap;">${nota.contenido}</div>
            </div>
        `;
    });
    contenedor.innerHTML = htmlFinal;
}

function gestionarGuardado() {
    const inputNombre = getEl('nombreNota');
    const areaTexto = getEl('textoNota');
    
    let notas = JSON.parse(localStorage.getItem('misNotasArray')) || [];

    // Validaciones con mensajes visuales en lugar de alerts
    if (notas.length >= 3) {
        mostrarAviso("¡Límite alcanzado! Borra una nota para continuar.", "error");
        return;
    }

    const tituloLimpio = inputNombre.value.trim();
    const contenidoLimpio = areaTexto.value.trim();

    if (!tituloLimpio || !contenidoLimpio) {
        mostrarAviso("Debes rellenar el nombre y el contenido.", "error");
        return;
    }

    const nuevaNota = {
        titulo: tituloLimpio,
        contenido: contenidoLimpio
    };

    notas.push(nuevaNota);
    localStorage.setItem('misNotasArray', JSON.stringify(notas));
    
    inputNombre.value = "";
    areaTexto.value = "";
    
    mostrarAviso("✓ Nota guardada en tu dispositivo", "exito");
    mostrarNotas();
}

function borrarNota(index) {
    let notas = JSON.parse(localStorage.getItem('misNotasArray')) || [];
    notas.splice(index, 1);
    localStorage.setItem('misNotasArray', JSON.stringify(notas));
    mostrarAviso("Nota eliminada", "exito");
    mostrarNotas();
}

function toggleNota(index) {
    const cuerpo = getEl(`cuerpo-${index}`);
    if (cuerpo.style.display === "none") {
        cuerpo.style.display = "block";
    } else {
        cuerpo.style.display = "none";
    }
}