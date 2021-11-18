export class FormatService {
  capitalize(v) {
    return v[0].toUpperCase() + v.slice(1).toLowerCase()
  }

  amount(v) {
    return v ?? 0
  }
}
