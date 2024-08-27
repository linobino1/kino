import { Link as RemixLink, LinkProps } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { localizeTo } from "./util/localizeTo";

export interface InternalLinkProps extends LinkProps {
  localize?: boolean;
}

const Link: React.FC<InternalLinkProps> = ({
  to,
  localize = true,
  ...props
}) => {
  const { i18n } = useTranslation();
  if (localize) {
    to = localizeTo(to, i18n.language);
  }

  return <RemixLink {...props} to={to} />;
};
export default Link;
