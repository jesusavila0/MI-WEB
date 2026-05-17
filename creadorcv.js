let categoriasSkills = [];
let experiencias = [];
let idiomas = [];
let cursosLista = []; 
let seccionesBorradas = {};
let accionConfirmada = null;

const temas = {
    "daw": { color: "#2ecc71", fuente: "monospace" },
    "web": { color: "#2980b9", fuente: "sans-serif" },
    "retro": { color: "#e67e22", fuente: "'OCR A Std', monospace" }
};

// --- SISTEMA DE MODAL PERSONALIZADO ---

function mostrarModal(titulo, mensaje, callback) {
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('modal-message').innerText = mensaje;
    modal.style.display = 'flex';
    accionConfirmada = callback;
}

document.getElementById('modal-cancel').onclick = () => {
    document.getElementById('custom-modal').style.display = 'none';
};

document.getElementById('modal-confirm').onclick = () => {
    if (accionConfirmada) accionConfirmada();
    document.getElementById('custom-modal').style.display = 'none';
};

// --- UTILIDADES Y FOTO ---

function formatearTexto(texto) {
    if (!texto) return "";
    return texto.replace(/"([^"]+)"/g, '<b style="color:#000;">$1</b>');
}

function leerFoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => { 
            const img = document.getElementById('preview-foto');
            img.src = e.target.result;
            img.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// --- GESTIÓN DE DATOS ---

function añadirCategoriaSkill() {
    const cat = document.getElementById('skill-categoria-input').value;
    const names = document.getElementById('skill-nombres-input').value;
    if(cat && names) {
        categoriasSkills.push({ titulo: cat, lista: names.split(',').map(s => s.trim()) });
        document.getElementById('skill-categoria-input').value = "";
        document.getElementById('skill-nombres-input').value = "";
        delete seccionesBorradas['skills'];
        actualizarCV();
    }
}

function añadirExperiencia() {
    const tit = document.getElementById('exp-titulo').value;
    if(tit) {
        experiencias.push({
            titulo: tit,
            empresa: document.getElementById('exp-empresa').value,
            desc: document.getElementById('exp-descripcion').value,
            inicio: document.getElementById('exp-inicio').value,
            fin: document.getElementById('exp-fin').value,
            url: document.getElementById('exp-url').value 
        });
        document.getElementById('exp-titulo').value = "";
        document.getElementById('exp-empresa').value = "";
        document.getElementById('exp-descripcion').value = "";
        document.getElementById('exp-inicio').value = "";
        document.getElementById('exp-fin').value = "";
        document.getElementById('exp-url').value = "";
        delete seccionesBorradas['exp'];
        actualizarCV();
    }
}

function añadirIdioma() {
    const nom = document.getElementById('nombre-idioma').value;
    const niv = parseInt(document.getElementById('nivel-idioma').value);
    if(nom) {
        idiomas.push({ nombre: nom, nivel: niv });
        document.getElementById('nombre-idioma').value = "";
        delete seccionesBorradas['idiomas'];
        actualizarCV();
    }
}

function añadirCurso() {
    const nom = document.getElementById('curso-nombre').value;
    const anio = document.getElementById('curso-anio').value;
    if(nom) {
        cursosLista.push({ nombre: nom, anio: anio });
        document.getElementById('curso-nombre').value = "";
        document.getElementById('curso-anio').value = "";
        delete seccionesBorradas['cursos'];
        actualizarCV();
    }
}

function eliminarSeccion(boton) {
    const seccion = boton.parentElement;
    const id = seccion.getAttribute('data-id');
    seccionesBorradas[id] = true;
    if (id === 'idiomas') idiomas = [];
    if (id === 'exp') experiencias = [];
    if (id === 'skills') categoriasSkills = [];
    if (id === 'cursos') cursosLista = [];
    actualizarCV(); 
}

function limpiarFormulario() {
    mostrarModal(
        "✨ Limpiar Lienzo", 
        "¿Deseas vaciar el editor actual? Esto no borrará tus archivos guardados.",
        () => {
            document.querySelectorAll('.form-container input, .form-container textarea').forEach(el => el.value = "");
            document.getElementById('fuentePersonalizada').value = "default";
            document.getElementById('colorPersonalizado').value = "#3498db";
            document.getElementById('comandoEstilo').value = "";
            categoriasSkills = []; experiencias = []; idiomas = []; cursosLista = []; seccionesBorradas = {};
            const img = document.getElementById('preview-foto');
            img.src = ""; img.style.display = "none";
            actualizarCV();
        }
    );
}

// --- RENDERIZADO Y ACTUALIZACIÓN ---

function actualizarCV() {
    document.getElementById('preview-nombre').innerText = document.getElementById('nombre').value || "Tu Nombre";

    const resumenTexto = document.getElementById('resumen').value || "";
    const secResumen = document.querySelector('[data-id="resumen"]');
    const tituloSobreMi = document.getElementById('preview-titulo-sobremi');
    const previewResumen = document.getElementById('preview-resumen');
    const previewContacto = document.getElementById('preview-contacto');

    const email = document.getElementById('email').value;
    const tlf = document.getElementById('telefono').value;
    const ubi = document.getElementById('ubicacion').value;

    let partes = [];
    if (ubi) partes.push(`<span style="color:#333; font-weight:bold;">${ubi}</span>`);
    if (email) partes.push(`<span style="color:#333; font-weight:bold;">${email}</span>`);
    if (tlf) partes.push(`<span style="color:#333; font-weight:bold;">${tlf}</span>`);

    previewContacto.innerHTML = partes.join(`<span style="color: #bbb; padding: 0 15px;">|</span>`);

    if (secResumen && !seccionesBorradas['resumen']) {
        if (partes.length > 0 || resumenTexto.trim() !== "") {
            secResumen.classList.remove('hidden');

            if (resumenTexto.trim() === "") {
                if(tituloSobreMi) tituloSobreMi.style.display = "none";
                if(previewResumen) previewResumen.style.display = "none";
                previewContacto.style.borderTop = "none";
                previewContacto.style.marginTop = "0";
                previewContacto.style.paddingTop = "0";
            } else {
                if(tituloSobreMi) tituloSobreMi.style.display = "block";
                if(previewResumen) {
                    previewResumen.style.display = "block";
                    previewResumen.innerHTML = formatearTexto(resumenTexto);
                }
                previewContacto.style.borderTop = "1px solid #eee";
                previewContacto.style.marginTop = "10px";
                previewContacto.style.paddingTop = "10px";
            }
        } else {
            secResumen.classList.add('hidden');
        }
    }

    const gestionarSeccion = (id, tieneContenido, callbackContenido) => {
        const sec = document.querySelector(`[data-id="${id}"]`);
        if (sec) {
            if (tieneContenido && !seccionesBorradas[id]) {
                sec.classList.remove('hidden');
                if (callbackContenido) callbackContenido();
            } else {
                sec.classList.add('hidden');
            }
        }
    };

    // --- CORRECCIÓN EN ESTUDIOS ---
    const tituloEst = document.getElementById('titulo-estudios').value;
    gestionarSeccion('estudios', tituloEst, () => {
        // Envolvemos el título en un div para que ocupe toda la línea
        let contenido = `<div style="margin-bottom: 2px;"><b class="titulo-interno">${tituloEst}</b></div>`;
        const descEst = document.getElementById('desc-estudios').value;
        if(descEst) contenido += `<p class="texto-justificado">${formatearTexto(descEst)}</p>`;
        const inicioEst = document.getElementById('inicio-estudios').value;
        const finEst = document.getElementById('fin-estudios').value;
        // Cambiamos span por div para forzar que baje
        if(inicioEst || finEst) contenido += `<div style="color:#333; font-weight:bold; font-size:11px;">${inicioEst} - ${finEst}</div>`;
        document.getElementById('preview-estudios').innerHTML = contenido;
    });

    gestionarSeccion('licencias', document.getElementById('licencias').value, () => {
        document.getElementById('preview-licencias').innerHTML = formatearTexto(document.getElementById('licencias').value);
    });

    gestionarSeccion('cursos', cursosLista.length > 0, () => {
        document.getElementById('preview-cursos').innerHTML = cursosLista.map(c => `
            <div style="margin-bottom: 5px; display: flex; justify-content: space-between; font-size:12px;">
                <span>${c.nombre}</span><b>${c.anio}</b>
            </div>`).join('');
    });

    // --- CORRECCIÓN EN EXPERIENCIA ---
    gestionarSeccion('exp', experiencias.length > 0, () => {
        document.getElementById('preview-exp-lista').innerHTML = experiencias.map(e => `
            <div style="margin-bottom:15px">
                <div style="display:block; margin-bottom: 2px;">
                    <b class="titulo-interno">${e.titulo}</b> ${e.empresa ? '<span style="color:#666;">| ' + e.empresa + '</span>' : ''}
                </div>
                ${e.desc ? `<p class="texto-justificado">${formatearTexto(e.desc)}</p>` : ''}
                <div style="font-size:11px; font-weight:bold; color:#333;">${e.inicio} - ${e.fin}</div>
                ${e.url ? `<div><a href="${e.url.startsWith('http') ? e.url : 'https://'+e.url}" target="_blank" style="color: #000; font-size: 11px; text-decoration: underline;">${e.url}</a></div>` : ''}
            </div>`).join('');
    });

    gestionarSeccion('skills', categoriasSkills.length > 0, () => {
        document.getElementById('preview-skills').innerHTML = categoriasSkills.map(c => `
            <div class="categoria-skill-bloque" style="margin-bottom:10px;">
                <span class="titulo-interno" style="display:block; margin-bottom:5px;">${c.titulo}:</span>
                <div style="display:flex; flex-wrap:wrap; gap:5px;">
                    ${c.lista.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
            </div>`).join('');
    });

    gestionarSeccion('idiomas', idiomas.length > 0, () => {
        document.getElementById('preview-idiomas').innerHTML = idiomas.map(i => `
            <div class="idioma-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                <span>${i.nombre}</span>
                <div class="nivel-circulos" style="display:flex; gap:4px;">
                    <div class="circulo ${i.nivel >= 1 ? 'lleno' : ''}"></div>
                    <div class="circulo ${i.nivel >= 2 ? 'lleno' : ''}"></div>
                    <div class="circulo ${i.nivel >= 3 ? 'lleno' : ''}"></div>
                </div>
            </div>`).join('');
    });

    const cmd = document.getElementById('comandoEstilo').value.toLowerCase();
    const colorFinal = temas[cmd] ? temas[cmd].color : document.getElementById('colorPersonalizado').value;
    const hoja = document.getElementById('hoja-cv');
    hoja.style.setProperty('--tema-color', colorFinal);
    if(document.getElementById('fuentePersonalizada').value !== "default") {
        hoja.style.fontFamily = document.getElementById('fuentePersonalizada').value;
    }
}

// --- PERSISTENCIA LOCAL ---

function guardarEnLocalStorage() {
    const nombreUsuario = document.getElementById('nombre').value || "Sin Nombre";
    const timestamp = new Date().toLocaleString();
    const datos = {
        meta: `${nombreUsuario} (${timestamp})`,
        nombre: document.getElementById('nombre').value,
        resumen: document.getElementById('resumen').value,
        email: document.getElementById('email').value,
        ubicacion: document.getElementById('ubicacion').value,
        telefono: document.getElementById('telefono').value,
        estudios: {
            titulo: document.getElementById('titulo-estudios').value,
            desc: document.getElementById('desc-estudios').value,
            inicio: document.getElementById('inicio-estudios').value,
            fin: document.getElementById('fin-estudios').value
        },
        licencias: document.getElementById('licencias').value,
        comandoEstilo: document.getElementById('comandoEstilo').value,
        color: document.getElementById('colorPersonalizado').value,
        fuente: document.getElementById('fuentePersonalizada').value,
        categoriasSkills, experiencias, idiomas, cursosLista, seccionesBorradas,
        foto: document.getElementById('preview-foto').src
    };
    let biblioteca = JSON.parse(localStorage.getItem('biblioteca_cvs') || "[]");
    biblioteca.push(datos);
    localStorage.setItem('biblioteca_cvs', JSON.stringify(biblioteca));
    renderizarListaArchivos();
}

function renderizarListaArchivos() {
    const contenedor = document.getElementById('lista-archivos-guardados');
    const biblioteca = JSON.parse(localStorage.getItem('biblioteca_cvs') || "[]");
    if (biblioteca.length === 0) {
        contenedor.innerHTML = '<p style="font-size: 11px; color: #555; text-align: center;">Vacío</p>';
        return;
    }
    contenedor.innerHTML = biblioteca.map((doc, index) => `
        <div class="archivo-item" onclick="cargarArchivo(${index})">
            <span class="archivo-nombre">${doc.meta}</span>
            <span class="btn-borrar-archivo" onclick="event.stopPropagation(); borrarArchivo(${index})">×</span>
        </div>
    `).join('');
}

function cargarArchivo(index) {
    const biblioteca = JSON.parse(localStorage.getItem('biblioteca_cvs') || "[]");
    const d = biblioteca[index];
    if (!d) return;

    document.getElementById('nombre').value = d.nombre || "";
    document.getElementById('resumen').value = d.resumen || "";
    document.getElementById('email').value = d.email || "";
    document.getElementById('ubicacion').value = d.ubicacion || "";
    document.getElementById('telefono').value = d.telefono || "";
    document.getElementById('titulo-estudios').value = d.estudios.titulo || "";
    document.getElementById('desc-estudios').value = d.estudios.desc || "";
    document.getElementById('inicio-estudios').value = d.estudios.inicio || "";
    document.getElementById('fin-estudios').value = d.estudios.fin || "";
    document.getElementById('licencias').value = d.licencias || "";
    document.getElementById('comandoEstilo').value = d.comandoEstilo || "";
    document.getElementById('colorPersonalizado').value = d.color || "#3498db";
    document.getElementById('fuentePersonalizada').value = d.fuente || "default";
    
    categoriasSkills = d.categoriasSkills || [];
    experiencias = d.experiencias || [];
    idiomas = d.idiomas || [];
    cursosLista = d.cursosLista || [];
    seccionesBorradas = d.seccionesBorradas || {};
    
    const img = document.getElementById('preview-foto');
    img.src = d.foto || "";
    img.style.display = d.foto ? "block" : "none";

    actualizarCV();
}

function borrarArchivo(index) {
    const biblioteca = JSON.parse(localStorage.getItem('biblioteca_cvs') || "[]");
    mostrarModal(
        "🗑️ Borrar Archivo", 
        `¿Seguro que quieres eliminar "${biblioteca[index].meta}"?`,
        () => {
            let bibActualizada = JSON.parse(localStorage.getItem('biblioteca_cvs') || "[]");
            bibActualizada.splice(index, 1);
            localStorage.setItem('biblioteca_cvs', JSON.stringify(bibActualizada));
            renderizarListaArchivos();
        }
    );
}

function generarPDF() {
    const element = document.getElementById('hoja-cv');
    element.style.boxShadow = "none";
    element.style.backgroundImage = "none";

    const opt = {
        margin: 0,
        filename: 'Curriculum.pdf',
        image: { type: 'jpeg', quality: 1.0 }, 
        html2canvas: { scale: 4, useCORS: true, letterRendering: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', precision: 32 }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
        element.style.backgroundImage = "linear-gradient(#ccc 2px, transparent 2px)";
    });
}

Sortable.create(document.getElementById('sortable-container'), { animation: 150 });
window.onload = renderizarListaArchivos;