import { Outlet } from "@remix-run/react";
import classes from "./auth.module.css";

export const handle = { i18n: "auth" };

export default function Auth() {
  return (
    <>
      <div className={classes.mainWrapper}>
        <main className={classes.main}>
          <Outlet />
        </main>
      </div>

      <p>TODO footer</p>
    </>
  );
}
