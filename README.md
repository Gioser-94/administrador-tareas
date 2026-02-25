Administrados de tareas

- Requisitos para ejecutar:
    1. Tener Node.js (LTS) instalado.
    2. Tener Git instalado.

- Pasos a seguir para ejecutar:
    1. En terminal, ejecutar "git clone https://github.com/Gioser-94/administrador-tareas.git" para clonar el repositorio.
    2. En terminal, ejecutar "cd administrador-tareas"
    3. En terminal, ejecutar "npm install" para instalar las dependencias.
    4. En terminal, ejecutar "ng serve" o "ng serve --open" para arrancar la app.
    5. Si no se ha ejecutado la opción con --open, en el navegador, se buscara la URL 
    "http://localhost:4200"

- Idea de la app:
    Se centra en 3 componentes, un componente padre (app) y dos hijos, uno para el formulario (form) y otro para el listado (list).
    También se ha implementado una interfaz para la estructura y creación del tipo de objeto Tarea.

- Comunicación:
    El componente padre actua de enlace entre los dos hijos, recibiendo y enviando datos a traves de @Output u @Input.
    Al tener todos los componentes la importación de la interfaz, les aporta coherencia y seguridad entre componentes, con la implementación de tipado bien definido.

- Form:
    Formulario simple basado en template, sin el uso de ReactiveFormsModule.
    Se usa la directiva ngModel para hacer uso de two-way binding (enlace bidireccional) y asi poder validar el formulario de una forma simple en la lógica de TS.
    Si todo esta correcto, crea un objeto de tipo Tarea y lo emite al padre.

- App:
    Al cargarse el componente padre, se comprueba si existen valores guardados en localStorage, si existen, se guardan en el array tareas, que es el que se usa para la comunicación entre componentes.
    App se encarga de recibir y enviar datos con los componentes y de guardalos en localStorage, ya sea si han sido modificados o no.

- List:
    Solo se renderiza la tabla si existen valores en el array tareas, una vez que existen, los imprime y aporta funcionalidades de completar tareas y borrarlas a través de acción de los botones.

- Estilos:
    Para que las tareas tengan diversos colores, se implementa una propiedad de la clase list, la cual se encarga, a través del uso de la directiva ngClass, de añadir la clase que se requiere en cada caso para los diferentes options, haciendo uso del value del option y "comparandolo" con las claves de la propiedad.


- Cosas a mejorar:
    Asociar cada tarea a un usuario/empleado, para ello se crearia la interfaz usuario/empleado, un nuevo campo en el formulario y cada tarea estaria asignada a un empleado.
    Se podria implementar el tiempo de entrega de tareas, desde que se crea, hasta que se debe de entragar (plazo máximo) y un contador con una cuenta atrás en cada tarea.
    Creación de filtros, ordenación y estadísticas (tiempos de entrega, cantidad de tareas segun su estado...) para las tareas.
    Gran parte de la app se puede centralizar con la creación de un servicio, el cual controlaria la lista de tareas, todo el CRUD, la gestión del localStorage, filtros y ordenación de tareas...
