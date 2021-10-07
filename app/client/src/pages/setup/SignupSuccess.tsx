import React from "react";
import { useEffect } from "react";
import PerformanceTracker, {
  PerformanceTransactionName,
} from "utils/PerformanceTracker";
import Landing from "./Landing";

export default function SignupSuccess() {
  useEffect(() => {
    PerformanceTracker.stopTracking(PerformanceTransactionName.SIGN_UP);
  }, []);
  return <Landing forSuperUser={false} />;
}
