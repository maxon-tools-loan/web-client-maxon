
///Servicio de diucado a formatos erspeciales y parseo de resultados
export class FormatService {
  private capitalize(v) {
    return v[0].toUpperCase() + v.slice(1).toLowerCase()
  }

  private amount(v) {
    return v ?? 0
  }
}
