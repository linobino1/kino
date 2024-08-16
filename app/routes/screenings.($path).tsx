import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

// redirect /screenings/* to /events/*
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const relPath = params.path ? `/${params.path}` : "";
  return redirect(`/events${relPath}`, {
    status: 302,
  });
};
