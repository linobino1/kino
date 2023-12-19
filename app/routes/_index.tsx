import { redirect } from "@remix-run/router";

/**
 * Redirect to /news
 */
export const loader = () => {
  throw redirect("/news");
};

export default function Index() {
  return <></>;
}
