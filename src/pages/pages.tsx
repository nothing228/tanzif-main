import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { AnchorLink, scrollToSection } from "../components/AnchorLink";
import { SpotlightCard } from "../components/SpotlightCard";
import { StickyFlow } from "../components/StickyFlow";
import { SectionTag } from "../components/SectionTag";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { HowItWorks } from "../components/HowItWorks";
import { Trust } from "../components/Trust";
import { Calculator } from "../components/Calculator";
import { Pickup } from "../components/Pickup";
import { Tracking } from "../components/Tracking";
import { Gallery } from "../components/Gallery";
import { Personal } from "../components/Personal";
import { Business } from "../components/Business";
import { Club } from "../components/Club";
import { Knowledge } from "../components/Knowledge";
import {
  CareHand,
  IconBag,
  IconCamera,
  IconCoat,
  IconShield,
  IconStar,
  Sparkle,
} from "../components/icons";
import "./Home.scss";

const TEASER_ICONS = [IconBag, IconCamera, Sparkle, IconStar, IconShield, IconCoat];

function EcosystemTeasers() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();

  return (
    <div className="teasers reveal" ref={ref}>
      {t.home.cards.map((card, i) => {
        const Icon = TEASER_ICONS[i];
        const body = (
          <>
            <span className="teasers__icon">
              <Icon size={22} />
            </span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span className="teasers__arrow" aria-hidden>
              →
            </span>
          </>
        );
        /* Most cards scroll to a section on this page; the cabinet card leaves
           for /profile. Spelled out rather than spread, so `as` stays concrete
           and SpotlightCard can infer the element type. */
        return card.route ? (
          <SpotlightCard
            key={card.title}
            as={Link}
            to={card.route}
            className="teasers__card"
            spotlightColor="rgba(201, 162, 84, 0.45)"
          >
            {body}
          </SpotlightCard>
        ) : (
          <SpotlightCard
            key={card.title}
            as={AnchorLink}
            id={card.to}
            className="teasers__card"
            spotlightColor="rgba(201, 162, 84, 0.45)"
          >
            {body}
          </SpotlightCard>
        );
      })}
    </div>
  );
}

/** The whole site lives on one page; only auth and profile are separate routes. */
export function HomePage() {
  const { state } = useLocation();
  const { t } = useLang();

  // Arriving from another route (or /#section) with a target in mind: jump
  // straight there — gliding through the whole one-pager would take seconds.
  // The second pass corrects for layout that settles after mount (fonts, reveals).
  useEffect(() => {
    const fromState = (state as { scrollTo?: string } | null)?.scrollTo;
    const fromHash = window.location.hash.replace(/^#/, "");
    const target = fromState || fromHash;
    if (!target) return;
    const first = window.setTimeout(() => scrollToSection(target, "instant"), 60);
    const settle = window.setTimeout(() => scrollToSection(target, "instant"), 500);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(settle);
    };
  }, [state]);

  return (
    <>
      <Hero />
      <Services />

      {/* one sticky column for everything up to the price list */}
      <StickyFlow
        blocks={[
          { id: "how", title: t.how.title, lead: t.how.lead, content: <HowItWorks /> },
          {
            id: "explore",
            title: t.home.explore,
            lead: t.home.exploreLead,
            content: <EcosystemTeasers />,
          },
        ]}
      />

      {/* full width: these need the room */}
      <Calculator />
      <Pickup />
      <Tracking />

      {/* and one sticky column for the rest of the page */}
      <StickyFlow
        blocks={[
          {
            id: "personal",
            title: t.personal.title,
            lead: t.personal.lead,
            content: <Personal />,
          },
          {
            id: "business",
            title: t.business.title,
            lead: t.business.lead,
            content: <Business />,
          },
          { id: "club", title: t.club.title, lead: t.club.lead, content: <Club /> },
          {
            id: "knowledge",
            tag: <SectionTag num="16" label={t.module} icon={<CareHand size={18} />} />,
            title: t.knowledge.title,
            lead: t.knowledge.lead,
            content: <Knowledge />,
          },
          { id: "trust", title: t.trust.title, content: <Trust /> },
        ]}
      />

      {/* results sit last, right above the footer */}
      <Gallery />
    </>
  );
}
