import {SweetAlertOptions} from 'sweetalert2';

const getErrorSwal = (message) => {
  return {
    icon: 'error',
    title: 'Error',
    text: message,
  } as SweetAlertOptions
}

export const SWAL_EMPTY_MAINTENANCE = getErrorSwal("No se puede crear un mantenimiento sin elementos")

export const SWAL_INCORRECT_INPUT = getErrorSwal("Los datos ingresados no son válidos")

export const SWAL_LOAN_MATERIAL_REMAINING = getErrorSwal("El empleado debe material")
export const SWAL_LOAN_NO_ELEMENTS = getErrorSwal("No se han asignado elementos para el préstamo")

export const SWAL_EMPLOYEE_NOT_EXISTS = getErrorSwal("El empleado no existe")

export const SWAL_LOGIN_INCOMPLETE_CREDENTIALS = getErrorSwal("Es necesario llenar los campos de usuario y contraseña")
export const SWAL_LOGIN_INVALID_CREDENTIALS = getErrorSwal("El usuario o la contraseña son incorrectos")

export const SWAL_UNKNOWN_ERROR = getErrorSwal("Un error desconocido ha ocurrido, porfavor contacte a su administrador")
