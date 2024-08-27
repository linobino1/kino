import { Link as RemixLink, LinkProps } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { localizeTo } from "./util/localizeTo";

export interface InternalLinkProps extends LinkProps {}

const Link: React.FC<InternalLinkProps> = ({ to, ...props }) => {
  const { i18n } = useTranslation();
  to = localizeTo(to, i18n.language);

  return <RemixLink {...props} to={to} />;
};
export default Link;
