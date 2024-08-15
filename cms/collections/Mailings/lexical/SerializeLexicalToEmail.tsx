import React, { Fragment } from "react";
import escapeHTML from "escape-html";
import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  IS_CODE,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
} from "./RichTextNodeFormat";
import type { SerializedLexicalNode } from "./types";
import { Heading, Text, Link, Hr } from "@react-email/components";

interface Props {
  nodes: SerializedLexicalNode[];
  color?: string;
}
const fontSize = "16px";

export function SerializeLexicalToEmail({ nodes, color }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node.type === "text") {
          let text = (
            <span
              key={index}
              dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }}
            />
          );
          if (
            typeof node.format === "number" ||
            typeof node.format === "bigint"
          ) {
            if (node.format & IS_BOLD) {
              text = <strong key={index}>{text}</strong>;
            }
            if (node.format & IS_ITALIC) {
              text = <em key={index}>{text}</em>;
            }
            if (node.format & IS_STRIKETHROUGH) {
              text = (
                <span key={index} className="line-through">
                  {text}
                </span>
              );
            }
            if (node.format & IS_UNDERLINE) {
              text = (
                <span key={index} className="underline">
                  {text}
                </span>
              );
            }
            if (node.format & IS_CODE) {
              text = <code key={index}>{text}</code>;
            }
            if (node.format & IS_SUBSCRIPT) {
              text = <sub key={index}>{text}</sub>;
            }
            if (node.format & IS_SUPERSCRIPT) {
              text = <sup key={index}>{text}</sup>;
            }
          }

          return text;
        }

        if (node == null) {
          return null;
        }

        // alignment
        let textAlign = (node.format ?? "left") as "left" | "center" | "right";

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (
          node: SerializedLexicalNode
        ): JSX.Element | null => {
          if (node.children == null) {
            return null;
          } else {
            if (node?.type === "list" && node?.listType === "check") {
              for (const item of node.children) {
                if (!item?.checked) {
                  item.checked = false;
                }
              }
              return SerializeLexicalToEmail({ nodes: node.children });
            } else {
              return SerializeLexicalToEmail({ nodes: node.children });
            }
          }
        };

        const serializedChildren = serializedChildrenFn(node);

        switch (node.type) {
          case "linebreak": {
            return <br key={index} />;
          }
          case "paragraph": {
            return (
              <Text key={index} style={{ textAlign, fontSize }}>
                {serializedChildren}
              </Text>
            );
          }
          case "heading": {
            let fontSize = "16px";
            let fontWeight = "normal";
            let marginBlock = "1em";
            switch (node.tag) {
              case "h1":
                fontSize = "23px";
                fontWeight = "bold";
                marginBlock = "50px";
                break;
            }

            return (
              <Heading
                key={index}
                style={{ textAlign, fontSize, fontWeight, marginBlock }}
              >
                {serializedChildren}
              </Heading>
            );
          }
          case "list": {
            type List = Extract<keyof JSX.IntrinsicElements, "ul" | "ol">;
            const Tag = node?.tag as List;
            return <Tag key={index}>{serializedChildren}</Tag>;
          }
          case "listitem": {
            if (node?.checked != null) {
              return (
                <li
                  key={index}
                  value={node?.value}
                  role="checkbox"
                  aria-checked={node.checked ? "true" : "false"}
                  tabIndex={-1}
                >
                  {serializedChildren}
                </li>
              );
            } else {
              return (
                <li key={index} value={node?.value}>
                  {serializedChildren}
                </li>
              );
            }
          }
          case "quote": {
            return (
              <blockquote key={index} style={{ textAlign }}>
                {serializedChildren}
              </blockquote>
            );
          }
          case "link": {
            return (
              <Link
                key={index}
                href={node.fields.url}
                target={'target="_blank"'}
              >
                {serializedChildren}
              </Link>
            );
          }

          case "upload":
            const media = node.value;
            if (!media.mimeType.startsWith("image/")) {
              throw new Error("Only images are supported");
            }
            return <img key={index} src={media.url} alt={media.alt} />;

          case "horizontalrule":
            return (
              <Hr
                key={index}
                style={{
                  borderColor: color,
                  borderStyle: "dotted",
                  borderBottomWidth: "4px",
                  borderTopWidth: 0,
                  marginBlock: "1em",
                }}
              />
            );

          default:
            return <p key={index}>unimplemented node type {node.type}</p>;
        }
      })}
    </Fragment>
  );
}
