function abrirMenu() {
    const menu = document.getElementById('menu-lateral');
    // Esto lee el CSS real del navegador, no solo el del HTML
    const displayActual = window.getComputedStyle(menu).display;

    if (displayActual === "none") {
        menu.style.setProperty("display", "flex", "important");
    } else {
        menu.style.setProperty("display", "none", "important");
    }
}

// CERRAR AL HACER CLIC FUERA
window.onclick = function(event) {
    const menu = document.getElementById('menu-lateral');
    const botonAbrir = document.querySelector('.icono-menu');

    // Si el menú está abierto...
    if (menu.style.display === "flex") {
        // ...y el clic NO ha sido ni en el menú ni en el botón de abrir...
        if (!menu.contains(event.target) && event.target !== botonAbrir) {
            menu.style.display = "none"; // Se cierra
        }
    }
}
