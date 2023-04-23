import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/router";
import type { Page } from "payload/generated-types";
import { useTranslation } from "react-i18next";

export const loader = async ({ context: { payload }}: LoaderArgs) => {
  const site = await payload.findGlobal({
    slug: 'site',
  });
  
  throw redirect(`/${(site.homePage as Page)?.slug}`);
};

export default function Index() {
  const { t } = useTranslation();


  return (
    <div>
      <h1>{t('Welcome')}</h1>
    </div>
  );
}
