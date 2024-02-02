import classes from "./index.module.css";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  size?: "medium" | "large";
}

const Gutter: React.FC<Props> = ({ size = "medium", className, ...props }) => {
  return (
    <div
      className={[classes.gutter, classes[size], className]
        .filter(Boolean)
        .join(" ")}
    >
      {props.children}
    </div>
  );
};

export default Gutter;
