import environment from "./environment"

export const mediaUrl = (filename: string): string => (
  `${environment().PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/media/${filename}`
)
