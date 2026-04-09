document.addEventListener('DOMContentLoaded', () => {
    // Usamos querySelector con un punto (.) porque es una CLASE
    const contenedor = document.querySelector('.proyectos-columna');
    
    if (!contenedor) {
        // Ya no saldrá el alert si no encuentra el contenedor, 
        // así no molesta en otras páginas de la web.
        return; 
    }

    const proyectos = Array.from(contenedor.children);
    
    if (proyectos.length > 2) {
        // Mezclamos el orden
        proyectos.sort(() => Math.random() - 0.5);
        
        // Vaciamos el div
        contenedor.innerHTML = '';
        
        // Metemos solo los 2 primeros
        contenedor.appendChild(proyectos[0]);
        contenedor.appendChild(proyectos[1]);
    }
});