// script.js

// script.js

function enviarProducto() {
    // Obtener valores del formularios
    var nombre = document.getElementById("nombre").value;
    var tipo = document.getElementById("tipo").value;
    var fechaCaducidad = document.getElementById("fechaCaducidad").value;
    var cantidad = document.getElementById("cantidad").value;
    var precio = document.getElementById("precio").value;
    console.log(precio);
    // Validar que todos los campos estén completos
    if (nombre && tipo && fechaCaducidad && cantidad && precio) {
        // Crear un objeto con los datos del producto
        

        // Enviar los datos al servidor utilizando Fetch
        fetch('http://localhost:3000/enviarProducto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                tipo: tipo,
                fechaCaducidad: fechaCaducidad,
                cantidad: cantidad,
                precio: precio
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar el producto');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message); // Mensaje de éxito del servidor
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al enviar el producto');
        });
    } else {
        alert("Por favor, complete todos los campos");
    }
}
function mostrarTabla2() {
    fetch('http://localhost:3000/verInventario', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener el inventario');
        }
        return response.json();
    })
    .then(data => {
        // Crea una cadena de texto con el contenido del inventario
        var contenidoTexto = "ID\tNombre del Producto\tFecha de Caducidad\n";

        // Calcula la longitud máxima de cada columna
        var maxLengthID = 2; // Por defecto, asumiendo que los IDs son números
        var maxLengthNombre = 20; // Ajusta según tus necesidades
        var maxLengthFechaCaducidad = 15; // Ajusta según tus necesidades

        // Calcula las longitudes máximas reales
        data.productos.forEach(function(producto) {
            maxLengthID = Math.max(maxLengthID, producto.id.toString().length);
            maxLengthNombre = Math.max(maxLengthNombre, producto.nombre_producto.length);
            maxLengthFechaCaducidad = Math.max(maxLengthFechaCaducidad, producto.fecha_caducidad.length);
        });

        // Agrega información de productos al contenido de texto
        data.productos.forEach(function(producto) {
            contenidoTexto += `${producto.id.toString().padEnd(maxLengthID)}\t${producto.nombre_producto.padEnd(maxLengthNombre)}\t${producto.fecha_caducidad.padEnd(maxLengthFechaCaducidad)}\n`;
        });

        // Guarda el contenido en un archivo de texto
        descargarArchivo("inventario.txt", contenidoTexto);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al obtener el inventario');
    });
}



function descargarArchivo(nombreArchivo, contenido) {
    // Crea un elemento enlace
    var enlace = document.createElement("a");
    
    // Crea un objeto Blob con el contenido de texto
    var blob = new Blob([contenido], { type: "text/plain" });
    
    // Asigna el Blob como el contenido del enlace
    enlace.href = window.URL.createObjectURL(blob);
    
    // Establece el nombre del archivo
    enlace.download = nombreArchivo;
    
    // Añade el enlace al documento
    document.body.appendChild(enlace);
    
    // Simula un clic en el enlace para iniciar la descarga
    enlace.click();
    
    // Elimina el enlace del documento
    document.body.removeChild(enlace);
}




function verInventario() {
    fetch('http://localhost:3000/verInventario', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener el inventario');
        }
        return response.json();
    })
    .then(data => {
        // Aquí puedes implementar la lógica para mostrar la tabla en el cliente
        mostrarTabla(data.productos);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al obtener el inventario');
    });
}


function mostrarTabla(productos) {
    // Obtén el elemento donde se mostrará la tabla
    var tablaContainer = document.getElementById("tablaContainer");

    // Crea una tabla HTML
    var tabla = document.createElement("table");
    tabla.border = "1";

    // Agrega un título a la tabla
    var tituloTabla = tabla.createCaption();
    tituloTabla.innerHTML = "TABLA ACTUALIZADA";
    tituloTabla.style.textAlign = "center";  // Alinea el título al centro

    // Crea la fila de encabezado
    var encabezado = tabla.createTHead();
    var encabezadoFila = encabezado.insertRow();

    // Agrega celdas al encabezado
    var encabezadoID = encabezadoFila.insertCell(0);
    var encabezadoNombre = encabezadoFila.insertCell(1);
    var encabezadoFechaCaducidad = encabezadoFila.insertCell(2);

    // Establece el contenido de las celdas de encabezado
    encabezadoID.innerHTML = "ID";
    encabezadoNombre.innerHTML = "Nombre del Producto";
    encabezadoFechaCaducidad.innerHTML = "Fecha de Caducidad";

    // Crea el cuerpo de la tabla
    var cuerpoTabla = tabla.createTBody();

    // Recorre los productos y agrega filas a la tabla
    productos.forEach(function(producto) {
        var fila = cuerpoTabla.insertRow();

        // Agrega celdas a la fila
        var celdaID = fila.insertCell(0);
        var celdaNombre = fila.insertCell(1);
        var celdaFechaCaducidad = fila.insertCell(2);

        // Establece el contenido de las celdas
        celdaID.innerHTML = producto.id;
        celdaNombre.innerHTML = producto.nombre_producto;
        celdaFechaCaducidad.innerHTML = producto.fecha_caducidad;
    });

    // Agrega la tabla al contenedor
    tablaContainer.innerHTML = "";
    tablaContainer.appendChild(tabla);
}


