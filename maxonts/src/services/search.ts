import { UNDEFINED } from './../utils/index';
export class SearchService {
  createFilter(template: {}) {
    return (query: {}, values: []) => {
      return values.filter((value) => {
        let valid = true
        for (const [key, expected] of Object.entries(query ?? {})) {
          if ((expected ?? UNDEFINED) === UNDEFINED)
            continue
          valid = valid && template[key].evaluator(expected)(value[key])
        }
        return valid
      })
    }
  }

  getUniqueProperties(values, transform=v=>v): [] {
    return Array.from(new Set(values.map(value => transform(value)))) as []
  }
}
