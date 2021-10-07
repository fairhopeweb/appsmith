import React, { memo, useState } from "react";
import styled from "styled-components";
import Button from "components/ads/Button";
import { ASSETS_CDN_URL } from "constants/ThirdPartyConstants";
import { useEffect } from "react";
import { playWelcomeAnimation } from "utils/helpers";
import {
  createMessage,
  WELCOME_ACTION,
  WELCOME_BODY,
  WELCOME_FORM_NON_SUPER_USER_ROLE_DROPDOWN,
  WELCOME_FORM_NON_SUPER_USER_USE_CASE,
  WELCOME_HEADER,
} from "constants/messages";
import StyledFormGroup from "components/ads/formFields/FormGroup";
import Dropdown, { DropdownOption } from "components/ads/Dropdown";
import { roleOptions, useCaseOptions } from "./constants";

const LandingPageWrapper = styled.div<{ hide: boolean }>`
  width: ${(props) => props.theme.pageContentWidth}px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  opacity: ${(props) => (props.hide ? 0 : 1)};
`;

const LandingPageContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 100;
`;

const StyledTextBanner = styled.div`
  min-width: ${(props) => props.theme.pageContentWidth * 0.55}px;
  padding-left: 64px;
`;

const StyledBannerHeader = styled.h1`
  font-family: "Paytone One", sans-serif;
  font-size: 72px;
  margin: 0px 0px;
`;

const StyledBannerBody = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 24px;
  margin: ${(props) => props.theme.spaces[7]}px 0px;
  width: 400px;
`;

const StyledImageBanner = styled.div`
  min-width: ${(props) => props.theme.pageContentWidth * 0.45}px;
`;

const ActionContainer = styled.div`
  margin-top: ${(props) => props.theme.spaces[15]}px;
`;

const StyledButton = styled(Button)`
  width: 136px;
  height: 38px;
  font-size: 13px;
  margin-top: ${(props) => props.theme.spaces[3]}px;
`;

const StyledImage = styled.img``;

const getWelcomeImage = () => `${ASSETS_CDN_URL}/welcome-banner.svg`;

type LandingPageProps = {
  onGetStarted?: (role?: string, useCase?: string) => void;
  forSuperUser: boolean;
};

const WELCOME_PAGE_ANIMATION_CONTAINER = "welcome-page-animation-container";

const includeFonts = () => {
  const preconnectGoogleapis = document.createElement("link");
  preconnectGoogleapis.rel = "preconnect";
  preconnectGoogleapis.href = "https://fonts.googleapis.com";
  document.head.appendChild(preconnectGoogleapis);

  const preconnectGstatic = document.createElement("link") as any;
  preconnectGstatic.rel = "preconnect";
  preconnectGstatic.href = "https://fonts.gstatic.com";
  preconnectGstatic.crossorigin = "crossorigin";
  document.head.appendChild(preconnectGstatic);

  const fonts = document.createElement("link");
  fonts.rel = "stylesheet";
  fonts.href =
    "https://fonts.googleapis.com/css2?family=Montserrat&family=Paytone+One&display=swap";
  document.head.appendChild(fonts);
};

type UserFormProps = {
  onGetStarted?: (role?: string, useCase?: string) => void;
};

function Banner() {
  return (
    <>
      <StyledBannerHeader>{createMessage(WELCOME_HEADER)}</StyledBannerHeader>
      <StyledBannerBody>{createMessage(WELCOME_BODY)}</StyledBannerBody>
    </>
  );
}

function SuperUserForm(props: UserFormProps) {
  return (
    <ActionContainer>
      <StyledButton
        onClick={() => props.onGetStarted && props.onGetStarted()}
        text={createMessage(WELCOME_ACTION)}
      />
    </ActionContainer>
  );
}

const DROPDOWN_WIDTH = "400px";

const StyledNonSuperUserForm = styled.div``;

const Space = styled.div`
  height: 20px;
`;

function NonSuperUserForm(props: UserFormProps) {
  const [role, setRole] = useState<string | undefined>("");
  const [useCase, setUsercase] = useState<string | undefined>("");
  const selectedRole = roleOptions.find(
    (option) => option.value === role,
  ) as DropdownOption;
  const selectedUsecase = useCaseOptions.find(
    (option) => option.value === useCase,
  ) as DropdownOption;
  return (
    <StyledNonSuperUserForm>
      <Space />
      <StyledFormGroup
        label={createMessage(WELCOME_FORM_NON_SUPER_USER_ROLE_DROPDOWN)}
      >
        <Dropdown
          dontUsePortal
          fillOptions
          onSelect={(selected) => setRole(selected)}
          options={roleOptions}
          placeholder="select role"
          selected={selectedRole}
          showLabelOnly
          width={DROPDOWN_WIDTH}
        />
      </StyledFormGroup>
      <Space />
      <StyledFormGroup
        label={createMessage(WELCOME_FORM_NON_SUPER_USER_USE_CASE)}
      >
        <Dropdown
          dontUsePortal
          fillOptions
          onSelect={(selected) => setUsercase(selected)}
          options={useCaseOptions}
          placeholder="select"
          selected={selectedUsecase}
          showLabelOnly
          width={DROPDOWN_WIDTH}
        />
      </StyledFormGroup>
      <ActionContainer>
        <StyledButton
          disabled={!role || !useCase}
          onClick={() =>
            props.onGetStarted && props.onGetStarted(role, useCase)
          }
          text={createMessage(WELCOME_ACTION)}
        />
      </ActionContainer>
    </StyledNonSuperUserForm>
  );
}

export default memo(function LandingPage(props: LandingPageProps) {
  const [fontsInjected, setFontsInjected] = useState(false);
  useEffect(() => {
    includeFonts();
    playWelcomeAnimation(`#${WELCOME_PAGE_ANIMATION_CONTAINER}`);
    //wait for the fonts to be loaded
    setTimeout(() => {
      setFontsInjected(true);
    }, 100);
  }, []);
  return (
    <LandingPageWrapper
      hide={!fontsInjected}
      id={WELCOME_PAGE_ANIMATION_CONTAINER}
    >
      <LandingPageContent>
        <StyledTextBanner>
          <Banner />
          {props.forSuperUser ? (
            <SuperUserForm onGetStarted={props.onGetStarted} />
          ) : (
            <NonSuperUserForm onGetStarted={props.onGetStarted} />
          )}
        </StyledTextBanner>
        <StyledImageBanner>
          <StyledImage src={getWelcomeImage()} />
        </StyledImageBanner>
      </LandingPageContent>
    </LandingPageWrapper>
  );
});
