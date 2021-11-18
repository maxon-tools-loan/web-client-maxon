export class SearchService {
  createFilter(template: {}) {
    return (query: {}, values: []) => {
      return values.filter((value) => {
        let valid = true
        for (const [key, expected] of Object.entries(query ?? {})) {
          valid = valid && template[key].evaluator(expected)(value[key])
        }
        return valid
      })
    }
  }

}
