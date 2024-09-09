import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
  Font,
} from "@react-email/components";
import type {
  Country,
  FilmPrint,
  Format,
  Genre,
  LanguageVersion,
  Mailing,
  Media,
  Movie,
  Person,
  Event,
} from "payload/generated-types";
import { seed } from "../seed";
import { SerializeLexicalToEmail } from "../lexical/SerializeLexicalToEmail";
import { parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import { Node as SlateNode } from "slate";

const tz = process.env.TIMEZONE ?? "Europe/Berlin";

const formatDate = (iso: string, format: string) => {
  const date = parseISO(iso);
  return formatInTimeZone(date, tz, format, { locale: de });
};

export const slateToPlainText = (content: any) => {
  return content?.map((n: any) => SlateNode.string(n)).join("\n");
};

export type Props = {
  mailing: Omit<Mailing, "updatedAt" | "createdAt" | "id">;
};
const bgGrey = "#f2f2f2";
const containerWidth = 580;
const fontSize = "16px";

export default function Newsletter({ mailing }: Props) {
  const color = mailing.color ?? "#000";
  const { footer } = mailing;
  return (
    <Html
      lang={mailing.language ?? "de"}
      dir="ltr"
      style={{
        fontFamily: "Helvetica, Arial, sans",
        fontSize: "16px",
        margin: 0,
        padding: 0,
      }}
    >
      <Head>
        <Font
          fontFamily="Open Sans"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Open Sans"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.gstatic.com/s/opensans/v40/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="bold"
        />
      </Head>
      <Body style={{ padding: 0, margin: 0 }}>
        {typeof mailing.headerImage === "object" && (
          <Img
            src={(mailing.headerImage as Media).url ?? ""}
            alt="header"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "400px",
            }}
          />
        )}
        <Container
          style={{
            paddingBottom: "20px",
            paddingInline: "5px",
            width: "100%",
            maxWidth: containerWidth,
          }}
        >
          <SerializeLexicalToEmail
            nodes={mailing.content?.root.children as any}
            color={color}
          />
        </Container>
        {mailing.events?.map((item, index) => {
          const event = item.event as Event;
          const filmprint = event.films?.[0]?.filmprint as
            | FilmPrint
            | undefined;
          const movie = filmprint?.movie as Movie | undefined;

          let subtitle = event.subtitle;
          if (event.type === "screening" && movie) {
            subtitle = [
              movie.originalTitle !== movie.title &&
                `OT: ${movie.originalTitle}`,
              (movie.genres as Genre[]).map((x) => x.name).join(", "),
              (movie.countries as Country[])?.map((x) => x.name).join(", "),
              movie.year,
              movie.directors &&
                `R: ${(movie.directors as Person[])
                  ?.map((x) => x.name)
                  .join(", ")}`,

              `${movie.duration} min`,
              (filmprint?.format as Format).name,
              filmprint
                ? (filmprint.languageVersion as LanguageVersion)?.name
                : null,
              movie.cast?.length &&
                `Mit: ${(movie.cast as Person[])
                  ?.slice(0, 3)
                  .map((x) => x.name)
                  .join(", ")}`,
            ]
              .filter(Boolean)
              .join(", ");
          }
          const additionalText = item.additionalText;

          return (
            <Section
              key={index}
              style={{ backgroundColor: bgGrey, paddingBlock: "20px" }}
            >
              <Container
                style={{
                  backgroundColor: "#FFFFFF",
                  width: "100%",
                  maxWidth: containerWidth,
                }}
              >
                <Link href={event.url} style={{ display: "contents" }}>
                  <Img
                    src={(event.header as Media).url ?? ""}
                    style={{
                      width: "100%",
                      height: "auto",
                      aspectRatio: "16 / 9",
                      objectFit: "cover",
                    }}
                  />
                  <Text
                    style={{
                      color: "#000000",
                      borderColor: color,
                      borderStyle: "inset",
                      borderWidth: "2px",
                      padding: "10px",
                      margin: 0,
                      fontSize: "18px",
                      lineHeight: "27px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {`${formatDate(event.date, "dd. LLL - p")} Uhr`}
                  </Text>
                </Link>
                <Container style={{ padding: "20px" }}>
                  <Heading
                    style={{
                      borderColor: color,
                      marginBlock: 0,
                      fontSize: "23px",
                    }}
                  >
                    {event.title}
                  </Heading>
                  {subtitle && (
                    <Text
                      style={{ marginBlock: 0, fontSize, fontStyle: "italic" }}
                    >
                      {subtitle}
                    </Text>
                  )}
                  <Text style={{ fontSize }}>
                    {event.type === "screening"
                      ? movie?.synopsis
                      : slateToPlainText(event.info)}
                  </Text>
                  {additionalText && (
                    <SerializeLexicalToEmail
                      nodes={additionalText.root.children as any}
                    />
                  )}
                </Container>
              </Container>
            </Section>
          );
        })}
        {typeof footer?.image === "object" && footer.label && footer.link && (
          <Section
            style={{
              width: "100%",
              backgroundImage: `url(${(footer.image as Media).url ?? ""})`,
              backgroundSize: "cover",
              minHeight: "40px",
              textAlign: "center",
            }}
          >
            <Link
              href={footer.link}
              style={{
                color,
                display: "inline-block",
                backgroundColor: bgGrey,
                borderWidth: "1px",
                borderColor: color,
                borderRadius: "50px",
                borderStyle: "solid",
                fontSize: "17px",
                fontWeight: "bold",
                padding: "8px 24px",
                margin: "20px",
              }}
            >
              {footer.label}
            </Link>
          </Section>
        )}
        <Container
          style={{
            color: "#7f8c8d",
            textAlign: "center",
            fontSize: "12px",
            lineHeight: "18px",
          }}
        >
          <Section style={{ padding: "20px" }}>
            <Text style={{ lineHeight: "18px" }}>
              Kino im Blauen Salon e.V.
              <br />
              HfG Karlsruhe
              <br />
              Lorenzstraße 15
              <br />
              76135 Karlsruhe
              <br />
              <Link href="https://kinoimblauensalon.de">
                www.kinoimblauensalon.de
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// this is for using the react-email dev server with `pnpm email`
Newsletter.PreviewProps = seed;
