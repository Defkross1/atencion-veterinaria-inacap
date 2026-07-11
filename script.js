// Arreglo global principal que mantiene las mascotas en memoria durante la sesion
let mascotas = [];

// Estados del filtro y orden para controlar lo que se dibuja en pantalla
let filtroEstadoActual = 'todos';
let terminoBusquedaActual = '';
let criterioOrdenActual = 'nombre-asc';

// Capturamos los elementos del DOM mas importantes que vamos a manipular frecuentemente
const formulario = document.getElementById('form-mascota');
const formEdicion = document.getElementById('form-edicion');
const alertError = document.getElementById('alert-error');
const alertErrorModal = document.getElementById('alert-error-modal');
const listaPacientesDOM = document.getElementById('lista-mascotas');
const buscadorInput = document.getElementById('filtro-buscar');
const selectorOrden = document.getElementById('selector-orden');

// Capturamos los campos de estadisticas del panel superior
const statTotal = document.getElementById('stat-total');
const statPendientes = document.getElementById('stat-pendientes');
const statAtendidos = document.getElementById('stat-atendidos');

// --- SISTEMA DE INICIALIZACIÓN Y EVENTOS ---

// Evento para procesar el envio del formulario de nueva mascota
formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    registrarMascota();
});

// Evento para procesar y guardar la edicion de un paciente existente
formEdicion.addEventListener('submit', function(e) {
    e.preventDefault();
    guardarEdicion();
});

// Listener interactivo para filtrar la tabla a medida que se escribe en el buscador
buscadorInput.addEventListener('input', function() {
    terminoBusquedaActual = buscadorInput.value.trim();
    mostrarMascotas();
});

// Listener para reordenar la tabla cuando cambie el criterio de ordenamiento
selectorOrden.addEventListener('change', function() {
    criterioOrdenActual = selectorOrden.value;
    mostrarMascotas();
});

// Asignamos controladores de clic a los botones de filtro de estado (Todos, Pendientes, Atendidos)
const botonesFiltro = document.querySelectorAll('.filtro-btn');
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', function() {
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        this.classList.add('activo');
        
        filtroEstadoActual = this.getAttribute('data-filtro');
        mostrarMascotas();
    });
});

// Evento que se ejecuta al presionar el boton de confirmacion definitiva de borrado
document.getElementById('confirmar-eliminacion-btn').addEventListener('click', function() {
    const idAEliminar = Number(document.getElementById('delete-id').value);
    efectuarEliminacion(idAEliminar);
});

// --- FUNCIONES OBLIGATORIAS REQUERIDAS POR LA RÚBRICA ---

// Funcion de validacion de campos que asegura que los datos cumplan con las reglas de negocio
function validarFormulario(nombre, especie, propietario, edad, contenedorAlerta) {
    contenedorAlerta.textContent = '';
    contenedorAlerta.style.display = 'none';

    // Verificamos si hay algun campo que haya quedado completamente vacio
    if (!nombre || !especie || !propietario || edad === '') {
        contenedorAlerta.textContent = 'Por favor, completa todos los campos del formulario.';
        contenedorAlerta.style.display = 'block';
        return false;
    }

    // El nombre del paciente debe tener al menos dos caracteres para ser un nombre real
    if (nombre.length < 2) {
        contenedorAlerta.textContent = 'El nombre de la mascota debe tener al menos 2 caracteres.';
        contenedorAlerta.style.display = 'block';
        return false;
    }

    // La edad del paciente no puede ser menor a cero bajo ninguna circunstancia
    const edadNumero = Number(edad);
    if (isNaN(edadNumero) || edadNumero < 0) {
        contenedorAlerta.textContent = 'La edad del paciente debe ser un número positivo (puede ser 0 si es cachorro).';
        contenedorAlerta.style.display = 'block';
        return false;
    }

    return true;
}

// Funcion que se encarga de crear el objeto de la mascota y agregarlo al listado global
function registrarMascota() {
    const nombre = document.getElementById('nombre').value.trim();
    const especie = document.getElementById('especie').value;
    const propietario = document.getElementById('propietario').value.trim();
    const edad = document.getElementById('edad').value.trim();

    // Invocamos la funcion validadora pasandole el contenedor de error del formulario principal
    if (!validarFormulario(nombre, especie, propietario, edad, alertError)) {
        return;
    }

    // Construimos la estructura del objeto tal cual lo pide la evaluacion practica
    const nuevaMascota = {
        id: Date.now(), // Generamos una clave unica basada en el timestamp de la maquina
        nombre: nombre,
        especie: especie,
        propietario: propietario,
        edad: Number(edad),
        atendido: false
    };

    mascotas.push(nuevaMascota);
    formulario.reset();
    alertError.style.display = 'none';

    // Sincronizamos la tabla y las estadisticas para mostrar el nuevo paciente de inmediato
    mostrarMascotas();
    actualizarEstadisticas();
}

// Funcion principal que filtra, ordena y construye los elementos visuales de la tabla en el DOM
function mostrarMascotas() {
    listaPacientesDOM.innerHTML = '';

    // Filtramos la lista de acuerdo con el texto ingresado en la barra de busqueda
    let datosProcesados = mascotas.filter(m => 
        m.nombre.toLowerCase().includes(terminoBusquedaActual.toLowerCase()) ||
        m.propietario.toLowerCase().includes(terminoBusquedaActual.toLowerCase())
    );

    // Filtramos los datos de acuerdo con el estado seleccionado en las pestañas
    if (filtroEstadoActual === 'pendientes') {
        datosProcesados = datosProcesados.filter(m => !m.atendido);
    } else if (filtroEstadoActual === 'atendidos') {
        datosProcesados = datosProcesados.filter(m => m.atendido);
    }

    // Ordenamos la lista segun el criterio que haya elegido el usuario en el select
    datosProcesados.sort((a, b) => {
        if (criterioOrdenActual === 'nombre-asc') {
            return a.nombre.localeCompare(b.nombre);
        } else if (criterioOrdenActual === 'nombre-desc') {
            return b.nombre.localeCompare(a.nombre);
        } else if (criterioOrdenActual === 'edad-asc') {
            return a.edad - b.edad;
        } else if (criterioOrdenActual === 'edad-desc') {
            return b.edad - a.edad;
        }
        return 0;
    });

    // Si la busqueda o el filtro no arrojan registros, mostramos un aviso informativo amigable
    if (datosProcesados.length === 0) {
        listaPacientesDOM.innerHTML = `
            <tr>
                <td colspan="6" class="vacio-mensaje">
                    No se encontraron pacientes para este criterio de búsqueda o estado.
                </td>
            </tr>
        `;
        return;
    }

    // Empezamos a crear dinamicamente las celdas de la tabla para cada mascota procesada
    datosProcesados.forEach(mascota => {
        const tr = document.createElement('tr');

        // Celda del nombre de la mascota
        const tdNombre = document.createElement('td');
        tdNombre.textContent = mascota.nombre;
        tdNombre.style.fontWeight = '700';
        tr.appendChild(tdNombre);

        // Celda de la especie seleccionada
        const tdEspecie = document.createElement('td');
        tdEspecie.textContent = mascota.especie;
        tr.appendChild(tdEspecie);

        // Celda del propietario responsable
        const tdPropietario = document.createElement('td');
        tdPropietario.textContent = mascota.propietario;
        tr.appendChild(tdPropietario);

        // Celda de la edad del animal
        const tdEdad = document.createElement('td');
        tdEdad.textContent = `${mascota.edad} ${mascota.edad === 1 ? 'año' : 'años'}`;
        tr.appendChild(tdEdad);

        // Celda de estado con su respectivo estilo de badge
        const tdEstado = document.createElement('td');
        const spanBadge = document.createElement('span');
        spanBadge.classList.add('badge');
        if (mascota.atendido) {
            spanBadge.textContent = 'Atendido';
            spanBadge.classList.add('badge-atendido');
        } else {
            spanBadge.textContent = 'Pendiente';
            spanBadge.classList.add('badge-pendiente');
        }
        tdEstado.appendChild(spanBadge);
        tr.appendChild(tdEstado);

        // Celda que agrupa todos los botones de accion interactivos
        const tdAcciones = document.createElement('td');

        // Creamos un contenedor flexbox para mantener los botones alineados en una sola fila
        const contenedorBotones = document.createElement('div');
        contenedorBotones.classList.add('contenedor-acciones');

        // Boton para cambiar el estado del paciente a Atendido
        const btnAtender = document.createElement('button');
        btnAtender.textContent = 'Atender';
        btnAtender.classList.add('btn', 'btn-atender');
        if (mascota.atendido) {
            btnAtender.disabled = true;
        } else {
            btnAtender.addEventListener('click', () => cambiarEstado(mascota.id));
        }
        contenedorBotones.appendChild(btnAtender);

        // Boton para abrir la configuracion de edicion del registro (Desafio extra)
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('btn', 'btn-editar');
        btnEditar.addEventListener('click', () => abrirModalEdicion(mascota.id));
        contenedorBotones.appendChild(btnEditar);

        // Boton para remover de forma definitiva al paciente (Desafio extra)
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btn', 'btn-eliminar');
        btnEliminar.addEventListener('click', () => abrirModalEliminar(mascota.id));
        contenedorBotones.appendChild(btnEliminar);

        // Agregamos el contenedor de botones a la celda y la celda a la fila
        tdAcciones.appendChild(contenedorBotones);
        tr.appendChild(tdAcciones);
        listaPacientesDOM.appendChild(tr);
    });
}

// Funcion que cambia la propiedad atendido de false a true en memoria
function cambiarEstado(id) {
    const mascota = mascotas.find(m => m.id === id);
    if (mascota) {
        mascota.atendido = true;
        mostrarMascotas();
        actualizarEstadisticas();
    }
}

// Funcion encargada de computar las estadisticas de control y actualizar el panel de la interfaz
function actualizarEstadisticas() {
    const total = mascotas.length;
    const pendientes = mascotas.filter(m => !m.atendido).length;
    const atendidos = mascotas.filter(m => m.atendido).length;

    statTotal.textContent = total;
    statPendientes.textContent = pendientes;
    statAtendidos.textContent = atendidos;
}

// --- CONTROL DE VENTANAS FLOTANTES (MODALES INTERACTIVOS) ---

// Abre el panel de edicion cargando los datos del objeto buscado por ID en los inputs
function abrirModalEdicion(id) {
    const mascota = mascotas.find(m => m.id === id);
    if (mascota) {
        document.getElementById('edit-id').value = mascota.id;
        document.getElementById('edit-nombre').value = mascota.nombre;
        document.getElementById('edit-especie').value = mascota.especie;
        document.getElementById('edit-propietario').value = mascota.propietario;
        document.getElementById('edit-edad').value = mascota.edad;

        alertErrorModal.style.display = 'none';
        document.getElementById('modal-edicion').classList.add('activo');
    }
}

// Cierra la ventana flotante indicada removiendo la clase CSS activa
function cerrarModal(idModal) {
    document.getElementById(idModal).classList.remove('activo');
}

// Aplica los cambios editados en el formulario del modal al objeto correspondiente
function guardarEdicion() {
    const id = Number(document.getElementById('edit-id').value);
    const nombre = document.getElementById('edit-nombre').value.trim();
    const especie = document.getElementById('edit-especie').value;
    const propietario = document.getElementById('edit-propietario').value.trim();
    const edad = document.getElementById('edit-edad').value.trim();

    // Evaluamos que la edicion cumpla tambien con las normas del sistema
    if (!validarFormulario(nombre, especie, propietario, edad, alertErrorModal)) {
        return;
    }

    const mascota = mascotas.find(m => m.id === id);
    if (mascota) {
        mascota.nombre = nombre;
        mascota.especie = especie;
        mascota.propietario = propietario;
        mascota.edad = Number(edad);

        cerrarModal('modal-edicion');
        mostrarMascotas();
        actualizarEstadisticas();
    }
}

// Abre el modal de confirmacion de borrado pasando el ID a un input oculto de control
function abrirModalEliminar(id) {
    document.getElementById('delete-id').value = id;
    document.getElementById('modal-eliminar').classList.add('activo');
}

// Elimina el objeto del arreglo global basandose en el ID almacenado en el modal
function efectuarEliminacion(id) {
    mascotas = mascotas.filter(m => m.id !== id);
    cerrarModal('modal-eliminar');
    mostrarMascotas();
    actualizarEstadisticas();
}

// Inicializamos el render y las estadisticas en cero al abrir la pagina por primera vez
mostrarMascotas();
actualizarEstadisticas();