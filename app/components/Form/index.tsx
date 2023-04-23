import React, { Children, useEffect } from "react"
import classes from "./index.module.css"
import type { FormProps} from '@remix-run/react';
import { Form as ReactForm } from '@remix-run/react';
import { useActionData } from '@remix-run/react';

export const Form: React.FC<FormProps> = (props) => {
  const data = useActionData();
  const form = React.useRef<HTMLFormElement>(null);
  const formErrors = React.useRef<HTMLDivElement>(null);
  const items = React.useRef<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    if (!data?.success) {
      // clear global error messages
      if (formErrors.current) formErrors.current.innerHTML = '';

      // handle form errors
      if (data?.errors) {

        for (const error of data?.errors) {
          // add error class to form element
          form.current?.querySelector(`[data-form-elem="${error.field}"]`)?.classList.add(classes.error)

          // host for field error message
          const host = items.current[error.field]?.querySelector(`.${classes.errorMessage}`);

          // add error message to field host or global host
          if (host) {
            host.innerHTML = error.message;
          } else if (formErrors.current) {
            formErrors.current.innerHTML += error.message;
          }
        }
      }
    }
  }, [data]);
  const updatedProps = {...props};
  updatedProps.className = `${classes.form} ${props.className}`;
  return data?.success ? (
    <div className={classes.success}>
      { data.message }
    </div>
  ) : (
    <ReactForm
      ref={form}
      {...updatedProps}
    >
      <div ref={formErrors} className={classes.formErrors} />
      { Children.map(Children.toArray(props.children), (child) => {
        // check if child is a form element, if not, return it as is
        if (!React.isValidElement<{
          name?: string,
          'data-name'?: string,
          'aria-label': string,
          type?: HTMLInputElement['type'],
          'data-type'?: string
        }>(child)) {
          return child;
        }
        
        // name or data-name attribute is required
        let name = child.props.name || child.props['data-name'] || '';
        if (!name) {
          return child;
        }

        // if it doesn't have the type or data-type attribute, try to get it from the type of the element
        // if the element is a custom component, it's type will be a function and thus it will not be
        // rendered as a form element. To include it, set the type attribute on the element.
        let type = child.props.type || child.props['data-type'];
        if (!type) {
          if (typeof child.type === 'string') {
            type = child.type;
          } else {
            return child;
          }
        }
        
        return (
          <div
            key={name}
            ref={(elem) => { items.current[name] = elem as HTMLDivElement}}
            data-form-elem={name}
            data-form-elem-type={type}
            className={classes.formElem}
          >
            { child.props['aria-label'] && (
              <label htmlFor={name}>{child.props['aria-label']}</label>
            )}
            {child}
            <div className={classes.errorMessage} />
          </div>
        )
      })}
    </ReactForm>
  )
}

export default Form;
