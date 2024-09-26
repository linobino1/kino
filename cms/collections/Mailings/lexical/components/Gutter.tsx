import { type ContainerProps, Container } from "@react-email/components";
import { containerWidth } from "../../templates/Newsletter";

const Gutter: React.FC<ContainerProps> = ({ style, ...props }) => {
  return (
    <Container
      {...props}
      style={{
        paddingInline: "5px",
        width: "100%",
        maxWidth: containerWidth,
      }}
    />
  );
};
export default Gutter;
