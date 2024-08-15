import styled from "styled-components";

export const HomePage = styled.div`
  /* mobile */
  @media (min-width: 280px) {
    & {
      display: flex;
      align-items: center;
      background: url('../../assets/img/homepage_mobileHero_bg.webp') !important;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      height: 100vh;
    }

    & .ui.menu .ui.button,
    .ui.menu a.ui.inverted.button {
      margin-left: 0.5em;
    }

    & h1.ui.header {
      font-size: 4em;
      font-weight: normal;
    }

    & h2 {
      font-size: 1.7em;
      font-weight: normal;
    }
  }

  /* tablet */
  @media (min-width: 768px) {
    & {
      background: url('../../assets/img/homepage_tabletHero_bg.webp');
    
    }

  }

  /* desktop */
  @media (min-width: 1025px) {
    & {
      background: url('../../assets/img/homepage_hero_bg.webp');
    }
  }
`;