import Swal, {SweetAlertOptions} from 'sweetalert2';

const getErrorSwal = (message) => {
  return {
    icon: 'error',
    title: 'Error',
    text: message,
  } as SweetAlertOptions
}

export const SWAL_EMPTY_MAINTENANCE = getErrorSwal("No se puede crear un mantenimiento sin elementos")
export const SWAL_INCORRECT_INPUT = getErrorSwal("Los datos ingresados no son válidos")

