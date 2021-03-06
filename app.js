require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
//const { mostrarMenu, pausa } = require('./helpers/mensajes');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

const main = async () => {
  //console.log('probando');
  let opt = '';
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    //cargarTareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    //opt = await mostrarMenu();
    opt = await inquirerMenu();
    //console.log({ opt });
    //const tareas = new Tareas();
    //const tarea = new Tarea('Comprar comida');
    //console.log(tarea);
    //tareas._listado[tarea.id] = tarea;
    //console.log(tareas);

    switch (opt) {
      case '1':
        //crear opcion
        const desc = await leerInput('Descripcion:');
        tareas.crearTarea(desc);
        break;
      case '2':
        tareas.listadoCompleto();
        break;
      case '3': //listar completadas
        tareas.listadoPendientesCompletadas();
        break;
      case '4': // listar pendientes
        tareas.listadoPendientesCompletadas(false);
        break;
      case '5': // completado | pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case '6': //borrar tarea
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== '0') {
          const ok = await confirmar(`Desea borrar la tarea ${id}?`);
          if (ok) {
            tareas.borrarTarea(id);
            console.log('Tarea borrada');
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();

    // if (opt !== '0') {
    //     await pausa();
    // }
  } while (opt !== '0');

  //pausa();
};

main();
