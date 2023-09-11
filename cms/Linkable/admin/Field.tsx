import React from "react";
import { useField } from "payload/components/forms";

type Props = {
  path: string
  showError?: boolean
  readOnly?: boolean
  className?: string
  required?: boolean
  placeholder?: Record<string, string> | string
  style?: React.CSSProperties
  width?: string
  label?: string
}

export const Field: React.FC<Props> = ({ path }) => {
  const { value } = useField<string>({ path });
  return (value && typeof value === 'string') ? (
    <div>
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
      >{value}</a>
      {' '}
      <span dangerouslySetInnerHTML={{
       __html: '&nearr;',
      }} />
    </div>
  ) : null
};

export default Field;