import { useMatches } from "@remix-run/react";
import Image from "../Image";
import classes from "./index.module.css";
import type { Media } from "payload/generated-types";

export default function PageHeader() {
  const data = useMatches();
  const page = data.find((x) => x.id === 'routes/__main/$page/index')?.data.page;

  return (
    <header className={classes.pageHeader}>
      { page?.image as Media && (
        <div className={classes.imageHeader}>
          <Image
            className={classes.headerImage}
            image={page.image as Media}
            srcSet={[
              { size: 'landscape-2560w', width: 2560 },
              { size: 'landscape-1920w', width: 1920 },
              { size: 'landscape-1280w', width: 1280 },
              { size: 'square-768w', width: 768 },
              { size: 'square-512w', width: 512 },
            ]}
            sizes={[
              '95vw',
            ]}
          />
        </div>
      )}
    </header>
  )
}
