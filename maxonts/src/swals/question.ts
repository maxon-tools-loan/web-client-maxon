import {SweetAlertOptions} from 'sweetalert2'

export const SWAL_MAINTENANCE_CONFIRM = {
  title: "¿Seguro que quieres registrar un mantenimiento?",
  type: "warning",
  showCancelButton: true,
  closeOnConfirm: true,
  closeOnCancel: true,
} as SweetAlertOptions


export const SWAL_EMPLOYEE_DEBT = {
  title: "El empleado debe material ¿Deseas continuar con el prestamo?",
  type: "warning",
  showCancelButton: true,
  closeOnConfirm: true,
  closeOnCancel: true,
} as SweetAlertOptions

export const SWAL_UPS_CONFIRM = {
  title: "¿Deseas Guardar Los Cambios?",
  type: "warning",
  showCancelButton: true,
  closeOnConfirm: true,
  closeOnCancel: true,
} as SweetAlertOptions

export const  confirmChangeMaintenance= (idMantenimiento,actual,nuevo) => {
  return {
  title: `El Mantenimiento ${idMantenimiento} cambiara de ${actual} a ${nuevo} ¿Confirmar Cambio?`,
  type: "warning",
  showCancelButton: true,
  closeOnConfirm: true,
  closeOnCancel: true,
} as SweetAlertOptions
}

export const SWAL_LOANUPDATE_CONFIRM = {
  title: "¿Deseas Guardar Los Cambios?",
  type: "warning",
  showCancelButton: true,
  closeOnConfirm: true,
  closeOnCancel: true,
} as SweetAlertOptions

export const SWAL_SUCCESS = {
  title: "Operacion Exitosa",
  text: "",
  button: "Close", // Text on button
  icon: "success", //built in icons: success, warning, error, info
} as SweetAlertOptions

