import classes from "./index.module.css";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Gutter: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={[classes.gutter, className].filter(Boolean).join(" ")}>
      {props.children}
    </div>
  );
};

export default Gutter;
