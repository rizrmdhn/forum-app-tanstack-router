const APP_NAME = "Forums App"

export function pageHead(title: string, description?: string) {
  return {
    meta: [
      { title: `${title} | ${APP_NAME}` },
      ...(description
        ? [{ name: "description" as const, content: description }]
        : []),
    ],
  }
}
