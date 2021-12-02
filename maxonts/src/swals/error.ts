import {SweetAlertOptions} from 'sweetalert2';

export const  getErrorSwal = (message) => {
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

export const SWAL_CANCELLED = getErrorSwal("Cancelado")
export const SWAL_ERROR = getErrorSwal("Ocurrio un error")

