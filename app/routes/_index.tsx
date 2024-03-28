import { redirect } from "@remix-run/node";

/**
 * Redirect to /news
 */
export const loader = () => {
  throw redirect("/news");
};

export default function Index() {
  return <></>;
}
