import Citas from "./classes/Citas.js";
import UI from "./classes/UI.js";
import {
   mascotaInput,
   propietarioInput,
   telefonoInput,
   fechaInput,
   horaInput,
   sintomasInput,
   formulario,
} from "./selectores.js";

let editando = false;
export let DB;

const ui = new UI();
const administrarCitas = new Citas();

const citaObj = {
   mascota: "",
   propietario: "",
   telefono: "",
   fecha: "",
   hora: "",
   sintomas: "",
};

export function datosCita(e) {
   citaObj[e.target.name] = e.target.value;
   //console.log(citaObj);
}

export function nuevaCita(e) {
   e.preventDefault();
   const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

   if (
      mascota === "" ||
      propietario === "" ||
      telefono === "" ||
      fecha === "" ||
      hora === "" ||
      sintomas === ""
   ) {
      ui.imprimirAlerta("Todos los campos son obligatios", "error");
      return;
   }

   if (editando) {
      administrarCitas.editarCita({ ...citaObj });

      // Edita en IndexDB
      const transaction = DB.transaction(["citas"], "readwrite");
      const objectStore = transaction.objectStore("citas");
      objectStore.put(citaObj);

      transaction.oncomplete = () => {
         ui.imprimirAlerta("Cita modificada correctamente", "exito");
         formulario.querySelector('button[type="submit"]').textContent =
            "Crear Cita";
         editando = false;
      };

      transaction.onerror = function () {
         console.log("Hubo un error al actualizar el registro");
      };
   } else {
      // Generar un ID unico
      citaObj.id = Date.now();
      // Crear la cita
      administrarCitas.agregarCita({ ...citaObj });
      // Insertar registro en IndexDB
      const transaction = DB.transaction(["citas"], "readwrite");
      const objectStore = transaction.objectStore("citas");
      objectStore.add(citaObj);

      transaction.oncomplete = function () {
         ui.imprimirAlerta("Cita agregada correctamente", "exito");
      };
   }
   formulario.reset();
   resetObj();

   // Mostrar la cita en el HTML
   ui.imprimirCitas();
}

function resetObj() {
   citaObj.mascota = "";
   citaObj.propietario = "";
   citaObj.telefono = "";
   citaObj.fecha = "";
   citaObj.hora = "";
   citaObj.sintomas = "";
}

export function eliminarCita(id) {
   //console.log("eliminando cita: " + id);
   const transaction = DB.transaction(["citas"], "readwrite");
   const objectStore = transaction.objectStore("citas");
   objectStore.delete(id);

   transaction.oncomplete = function () {
      ui.imprimirAlerta("La cita se ha eliminado correctamente", "exito");
      ui.imprimirCitas();
   };
   transaction.onerror = function () {
      console.log("Hubo un error al eliminar");
   };
}

export function cargarEdicion(cita) {
   const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

   // Llenar el formulario con la cita a editar
   mascotaInput.value = mascota;
   propietarioInput.value = propietario;
   telefonoInput.value = telefono;
   fechaInput.value = fecha;
   horaInput.value = hora;
   sintomasInput.value = sintomas;

   // Llenar el Objeto
   citaObj.mascota = mascota;
   citaObj.propietario = propietario;
   citaObj.telefono = telefono;
   citaObj.fecha = fecha;
   citaObj.hora = hora;
   citaObj.sintomas = sintomas;
   citaObj.id = id;

   formulario.querySelector('button[type="submit"]').textContent =
      "Guardar Cambios";

   editando = true;
}

export function crearDB() {
   const crearDB = window.indexedDB.open("citas", 1);

   //Si hay un error
   crearDB.onerror = function () {};

   //Si todo OK
   crearDB.onsuccess = function () {
      DB = crearDB.result;
      ui.imprimirCitas();
   };

   //Definir el schema
   crearDB.onupgradeneeded = function (e) {
      const db = e.target.result;
      const objectStore = db.createObjectStore("citas", {
         keyPath: "id",
         autoIncrement: true,
      });
      objectStore.createIndex("mascota", "mascota", { unique: false });
      objectStore.createIndex("propietario", "propietario", { unique: false });
      objectStore.createIndex("telefono", "telefono", { unique: false });
      objectStore.createIndex("fecha", "fecha", { unique: false });
      objectStore.createIndex("hora", "hora", { unique: false });
      objectStore.createIndex("sintomas", "sintomas", { unique: false });
      objectStore.createIndex("id", "id", { unique: true });
   };
}
