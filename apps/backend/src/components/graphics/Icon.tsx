import type { ServerComponentProps } from 'payload'

export const Icon: React.FC<ServerComponentProps> = async () => {
  return <img src={'/favicon.ico'} className="" />
}
