import { NavLink as RemixNavLink, NavLinkProps } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { localizeTo } from "./util/localizeTo";

export interface InternalLinkProps extends NavLinkProps {}

const NavLink: React.FC<InternalLinkProps> = ({ to, ...props }) => {
  const { i18n } = useTranslation();
  to = localizeTo(to, i18n.language);

  return <RemixNavLink {...props} to={to} />;
};
export default NavLink;
