import {
  Container,
  Heading,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import type {
  Country,
  FilmPrint,
  Format,
  Genre,
  LanguageVersion,
  Media,
  Movie,
  Person,
  Event as EventType,
} from "payload/generated-types";
import { SerializeLexicalToEmail } from "../SerializeLexicalToEmail";
import {
  bgGrey,
  containerWidth,
  formatDate,
  slateToPlainText,
  fontSize,
} from "../../templates/Newsletter";

type EventProps = {
  event: EventType;
  color: string;
  additionalText?: any;
};

const Event: React.FC<EventProps> = ({ event, color, additionalText }) => {
  const filmprint = event.films?.[0]?.filmprint as FilmPrint | undefined;
  const movie = filmprint?.movie as Movie | undefined;

  let subtitle = event.subtitle;
  if (event.type === "screening" && movie) {
    subtitle = [
      movie.originalTitle !== movie.title && `OT: ${movie.originalTitle}`,
      (movie.genres as Genre[]).map((x) => x.name).join(", "),
      (movie.countries as Country[])?.map((x) => x.name).join(", "),
      movie.year,
      movie.directors &&
        `R: ${(movie.directors as Person[])?.map((x) => x.name).join(", ")}`,

      `${movie.duration} min`,
      (filmprint?.format as Format).name,
      filmprint ? (filmprint.languageVersion as LanguageVersion)?.name : null,
      movie.cast?.length &&
        `Mit: ${(movie.cast as Person[])
          ?.slice(0, 3)
          .map((x) => x.name)
          .join(", ")}`,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return (
    <Section style={{ backgroundColor: bgGrey, paddingBlock: "20px" }}>
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
            <Text style={{ marginBlock: 0, fontSize, fontStyle: "italic" }}>
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
              color={color}
            />
          )}
        </Container>
      </Container>
    </Section>
  );
};

export default Event;
