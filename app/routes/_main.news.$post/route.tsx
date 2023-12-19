import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { Media } from "payload/generated-types";
import { useLoaderData } from "@remix-run/react";
import { Page } from "~/components/Page";
import { mergeMeta, pageDescription, pageTitle } from "~/util/pageMeta";
import i18next from "~/i18next.server";
import classes from "./index.module.css";
import { Image } from "~/components/Image";
import Date from "~/components/Date";
import Blocks from "~/components/Blocks";
import RichText from "~/components/RichText";
import { JsonLd } from "cms/structured-data";
import { postPreviewSchema } from "cms/structured-data/post";
import type { loader as rootLoader } from "app/root";
import { serializeToPlainText } from "~/components/RichText/Serialize";

export const loader = async ({
  request,
  params,
  context: { payload },
}: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  const data = await payload.find({
    collection: "posts",
    locale,
    where: {
      slug: {
        equals: params.post,
      },
    },
  });

  if (!data.docs.length) {
    throw new Response("Post not found", { status: 404 });
  }

  return {
    post: data.docs[0],
  };
};

export const meta: MetaFunction<
  typeof loader,
  {
    root: typeof rootLoader;
  }
> = mergeMeta(({ data, matches }) => {
  const site = matches.find((match) => match?.id === "root")?.data.site;

  return [
    {
      title: pageTitle(site?.meta?.title, data?.post.title),
      description: pageDescription(
        site?.meta?.description,
        serializeToPlainText({ content: data?.post.content })
      ),
      "og:image": (data?.post.header as Media)?.url,
    },
  ];
});

export default function Index() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Page className={classes.container}>
      {JsonLd(postPreviewSchema(post))}
      <div className={classes.header}>
        <Date iso={post.date} format="PPP" /> {post.title}
      </div>
      <Image className={classes.image} image={post.header as Media} />
      <h1>{post.title}</h1>
      <RichText content={post.content} className={classes.preview} />
      <Blocks blocks={post.details as []} />
    </Page>
  );
}
