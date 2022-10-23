import { PERMITS } from "../../config/permission";
import { useSelector } from "react-redux";

export default function PermitContainer({ children, permit }) {
  const user = useSelector((state) => state.auth.user);
  if (permit?.except) return children;
  return permit &&
    PERMITS?.[user?.role]?.[permit?.domain]?.includes(permit?.can)
    ? children
    : null;
}
