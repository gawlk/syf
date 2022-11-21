const abortControllers = new Map<string, AbortController>()

export const createManagedAbortController = (name: string) => {
  const oldController = abortControllers.get(name)

  if (oldController) {
    oldController.abort()
  }

  const newController = new AbortController()

  abortControllers.set(name, newController)

  return newController
}
