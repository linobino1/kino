import { redirect } from "@remix-run/router";

/**
 * Redirect to /blog
 */
export const loader = () => {
  throw redirect('/blog');
};

export default function Index() {
  return (<></>);
}
