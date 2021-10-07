import { firstTimeUserOnboardingInit } from "actions/onboardingActions";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import {
  APPLICATIONS_URL,
  extractAppIdAndPageIdFromUrl,
  SIGNUP_SUCCESS_URL,
} from "constants/routes";
import { requiresUnauthHOC } from "pages/UserAuth/requiresAuthHOC";
import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "selectors/usersSelectors";
import { useSelector } from "store";
import { getIsSafeRedirectURL } from "utils/helpers";
import history from "utils/history";
import PerformanceTracker, {
  PerformanceTransactionName,
} from "utils/PerformanceTracker";
import Landing from "./Welcome";

export function SignupSuccess() {
  const dispatch = useDispatch();
  useEffect(() => {
    PerformanceTracker.stopTracking(PerformanceTransactionName.SIGN_UP);
  }, []);

  const redirectUsingQueryParam = useCallback(() => {
    const urlObject = new URL(window.location.href);
    const redirectUrl = urlObject?.searchParams.get("redirectUrl");
    const shouldEnableFirstTimeUserOnboarding = urlObject?.searchParams.get(
      "enableFirstTimeUserExperience",
    );
    if (redirectUrl) {
      try {
        if (
          window.location.pathname == SIGNUP_SUCCESS_URL &&
          shouldEnableFirstTimeUserOnboarding === "true"
        ) {
          const { applicationId, pageId } = extractAppIdAndPageIdFromUrl(
            redirectUrl,
          );
          if (applicationId && pageId) {
            dispatch(firstTimeUserOnboardingInit(applicationId, pageId));
          }
        } else if (getIsSafeRedirectURL(redirectUrl)) {
          window.location.replace(redirectUrl);
        }
      } catch (e) {
        console.error("Error handling the redirect url");
      }
    } else {
      history.replace(APPLICATIONS_URL);
    }
  }, []);

  const onGetStarted = useCallback((role?: string, useCase?: string) => {
    dispatch({
      type: ReduxActionTypes.UPDATE_USER_DETAILS_INIT,
      payload: {
        role,
        useCase,
      },
    });
    redirectUsingQueryParam();
  }, []);

  const user = useSelector(getCurrentUser);
  if (user?.isSuperUser || (user?.role && user?.useCase)) {
    redirectUsingQueryParam();
  }
  return <Landing forSuperUser={false} onGetStarted={onGetStarted} />;
}

export default requiresUnauthHOC(SignupSuccess);
