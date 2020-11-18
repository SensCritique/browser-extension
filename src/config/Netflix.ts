export class Netflix {
  static getUiVersion (): string {
    const headers = window.wrappedJSObject?.netflix?.reactContext?.models?.abContext?.data?.headers

    return headers?.['X-Netflix.uiVersion']
  }

  static async canABTest (): Promise<boolean> {
    let url = 'https://www.netflix.com/api/shakti/%uiVersion%/account/donottest'
    const uiVersion = Netflix.getUiVersion()
    if (uiVersion) {
      url = url.replace(/%uiVersion%/, uiVersion)
      const response = await fetch(url)
      const json = await response.json()

      return json?.canABTest != null ? json.canABTest : false
    }

    return false
  }
}
