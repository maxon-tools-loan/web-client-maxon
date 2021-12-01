import {SweetAlertOptions} from 'sweetalert2'

export const SWAL_MAINTENANCE_CONFIRM = {
  title: "¿Seguro que quieres registrar un mantenimiento?",
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