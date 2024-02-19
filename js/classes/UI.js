import { eliminarCita, cargarEdicion, DB } from "../funciones.js";
import { contenedorCitas, heading } from "../selectores.js";

class UI {
   imprimirAlerta(mensaje, tipo) {
      const divMensaje = document.createElement("div");
      divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

      if (tipo === "error") {
         divMensaje.classList.add("alert-danger");
      } else {
         divMensaje.classList.add("alert-success");
      }

      divMensaje.textContent = mensaje;
      document
         .querySelector("#contenido")
         .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

      setTimeout(() => {
         divMensaje.remove();
      }, 3000);
   }

   imprimirCitas() {
      this.limpiarHTML();

      const objectStore = DB.transaction("citas").objectStore("citas");
      objectStore.openCursor().onsuccess = function (e) {
         const cursor = e.target.result;

         if (cursor) {
            const {
               mascota,
               propietario,
               telefono,
               fecha,
               hora,
               sintomas,
               id,
            } = cursor.value;

            const divCita = document.createElement("div");
            divCita.classList.add("cita", "p-3");
            divCita.dataset.id = id;
            // Agregar el bloque DIV Cita al conenedor
            contenedorCitas.appendChild(divCita);

            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.classList.add("card-title", "font-weight-bold");
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement("p");
            propietarioParrafo.innerHTML = `
             <span class="font-weight-bold">Propietario: </span> ${propietario}
          `;

            const telefonoParrafo = document.createElement("p");
            telefonoParrafo.innerHTML = `
             <span class="font-weight-bold">Telefono: </span> ${telefono}
          `;

            const fechaParrafo = document.createElement("p");
            fechaParrafo.innerHTML = `
             <span class="font-weight-bold">Fecha: </span> ${fecha}
          `;

            const horaParrafo = document.createElement("p");
            horaParrafo.innerHTML = `
             <span class="font-weight-bold">Hora: </span> ${hora}
          `;

            const sintomasParrafo = document.createElement("p");
            sintomasParrafo.innerHTML = `
             <span class="font-weight-bold">Sintomas: </span> ${sintomas}
          `;

            const divBotones = document.createElement("div");
            divBotones.classList.add("d-grid", "gap-2", "d-md-block");

            const cita = cursor.value;

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "mr-2");
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>`;
            btnEliminar.onclick = () => eliminarCita(id);

            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn", "btn-primary", "mr-2");
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>`;
            btnEditar.onclick = () => cargarEdicion(cita);

            // Agregamos los parrafos al DIV
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            sintomasParrafo.appendChild(divBotones);
            divBotones.appendChild(btnEliminar);
            divBotones.appendChild(btnEditar);

            // Ve al siguiente elemento
            cursor.continue();
         }
      };
   }

   textoHeading(citas) {
      if (citas.length > 0) {
         heading.textContent = "Administra tus Citas";
      } else {
         heading = "No hay ditas registradas, crea tu cita";
      }
   }

   limpiarHTML() {
      while (contenedorCitas.firstChild) {
         contenedorCitas.removeChild(contenedorCitas.firstChild);
      }
   }
}

export default UI;
