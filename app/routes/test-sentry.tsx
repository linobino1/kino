import { Form, useActionData } from "@remix-run/react";
import Gutter from "~/components/Gutter";

export const action = async () => {
  throw new Error("this is a server error on /test-sentry");
};

export default function TestSentry() {
  const data = useActionData<typeof action>();

  const handleClick = () => {
    throw new Error("this is a browser error on /test-sentry");
  };

  return (
    <Gutter>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={handleClick}>Throw a browser error</button>
      <Form method="post">
        <button type="submit">Throw a server error</button>
      </Form>
    </Gutter>
  );
}
