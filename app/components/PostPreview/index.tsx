import type { Post, Media } from "payload/generated-types";
import React from "react";
import Date from "~/components/Date";
import Image from "~/components/Image";
import RichText from "~/components/RichText";
import classes from "./index.module.css";
import { useTranslation } from "react-i18next";
import type { LinkableCollection } from "cms/types";
import { Link } from "~/components/localized-link";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

export const PostPreview: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { post } = props;
  let link: string | undefined;
  let target = "_self";
  switch (post.link?.type) {
    case "internal":
      link = (post.link.doc?.value as LinkableCollection)?.url;
      break;
    case "external":
      link = post.link?.url ?? "";
      target = "_blank";
      break;
    case "none":
      link = post.details?.length ? post.url : undefined;
  }
  return (
    <div {...props} className={`${classes.container} ${props.className}`}>
      <Image
        image={post.header as Media}
        onClick={link ? () => window.open(link, target) : undefined}
        className={link ? classes.link : undefined}
        srcSet={[
          { options: { width: 500 }, size: "500w" },
          { options: { width: 768 }, size: "768w" },
          { options: { width: 1000 }, size: "1000w" },
          { options: { width: 1500 }, size: "1500w" },
        ]}
        sizes="(max-width: 768px) 100vw, 500px"
      />
      <Date className={classes.date} iso={post.date} format="PPP" />
      <h2>{post.title}</h2>
      <RichText content={post.content} className={classes.content} />
      {post.details?.length ? (
        <Link className={classes.more} to={post.url}>
          {t("Read more")}
        </Link>
      ) : null}
    </div>
  );
};

export default PostPreview;
