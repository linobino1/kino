import {
  Container,
  Heading,
  Img,
  Section,
  Text,
} from "@react-email/components";
import type {
  Country,
  Genre,
  Media,
  Movie as MovieType,
  Person,
} from "payload/generated-types";
import { SerializeLexicalToEmail } from "../SerializeLexicalToEmail";
import { bgGrey, containerWidth, fontSize } from "../../templates/Newsletter";
import Shorten from "./Shorten";

type MovieProps = {
  movie: MovieType;
  color: string;
  additionalText?: any;
};

const Movie: React.FC<MovieProps> = ({ movie, color, additionalText }) => {
  const subtitle = [
    movie.originalTitle !== movie.title && `OT: ${movie.originalTitle}`,
    (movie.genres as Genre[])?.map((x) => x.name).join(", "),
    (movie.countries as Country[])?.map((x) => x.name).join(", "),
    movie.year,
    movie.directors &&
      `R: ${(movie.directors as Person[])?.map((x) => x.name).join(", ")}`,

    `${movie.duration} min`,
    movie.cast?.length &&
      `Mit: ${(movie.cast as Person[])
        ?.slice(0, 3)
        .map((x) => x.name)
        .join(", ")}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Section style={{ backgroundColor: bgGrey, paddingBlock: "20px" }}>
      <Container
        style={{
          backgroundColor: "#FFFFFF",
          width: "100%",
          maxWidth: containerWidth,
        }}
      >
        <Img
          src={(movie.still as Media).url ?? ""}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "16 / 9",
            objectFit: "cover",
          }}
        />
        <Container style={{ padding: "20px" }}>
          <Heading
            style={{
              borderColor: color,
              marginBlock: 0,
              fontSize: "23px",
            }}
          >
            {movie.title}
          </Heading>
          <Text style={{ marginBlock: 0, fontSize, fontStyle: "italic" }}>
            {subtitle}
          </Text>
          <Text style={{ fontSize }}>
            <Shorten text={movie?.synopsis} />
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

export default Movie;
