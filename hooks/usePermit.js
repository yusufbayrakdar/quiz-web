import { useCallback } from "react";
import { useSelector } from "react-redux";

import { PERMITS } from "../config/permission";

function usePermit(permit) {
  const user = useSelector((state) => state.auth.user);

  const permissionCheck = useCallback(() => {
    return (
      PERMITS?.[user?.role]?.[permit?.domain]?.includes(permit?.can) || false
    );
  }, [user, permit]);

  return permissionCheck();
}

export default usePermit;
