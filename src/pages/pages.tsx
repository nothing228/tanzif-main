import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import { Eco } from "../components/Eco";
import { Calculator } from "../components/Calculator";
import { Pickup } from "../components/Pickup";
import { Tracking } from "../components/Tracking";
import { Live } from "../components/Live";
import { Gallery } from "../components/Gallery";
import { Concierge } from "../components/Concierge";
import { Personal } from "../components/Personal";
import { Business } from "../components/Business";
import { Club } from "../components/Club";
import { Knowledge } from "../components/Knowledge";
import {
  CareDryClean,
  CareHand,
  IconBag,
  IconCamera,
  IconLeaf,
  IconStar,
  Sparkle,
} from "../components/icons";
import "./Home.scss";

const TEASER_ICONS = [IconBag, IconCamera, Sparkle, IconStar];

function EcosystemTeasers() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();

  return (
    <div className="teasers reveal" ref={ref}>
      {t.home.cards.map((card, i) => {
        const Icon = TEASER_ICONS[i];
        return (
          <SpotlightCard
            key={card.to}
            as={AnchorLink}
            id={card.to}
            className="teasers__card"
            spotlightColor="rgba(201, 162, 84, 0.45)"
          >
            <span className="teasers__icon">
              <Icon size={22} />
            </span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <span className="teasers__arrow" aria-hidden>
              →
            </span>
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

  // Arriving from the profile page with a section in mind: jump straight there
  // — gliding through the whole one-pager would take seconds. The second pass
  // corrects for layout that settles right after mount (fonts, reveals).
  useEffect(() => {
    const target = (state as { scrollTo?: string } | null)?.scrollTo;
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
            id: "live",
            tag: <SectionTag num="06" label={t.module} icon={<IconCamera size={18} />} />,
            title: t.live.title,
            lead: t.live.lead,
            content: <Live />,
          },
          {
            id: "concierge",
            tag: <SectionTag num="07" label={t.module} icon={<CareDryClean size={18} />} />,
            title: t.concierge.title,
            lead: t.concierge.lead,
            content: <Concierge />,
          },
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
            id: "eco",
            tag: <SectionTag num="15" label={t.module} icon={<IconLeaf size={17} />} />,
            title: t.eco.title,
            lead: t.eco.lead,
            content: <Eco />,
          },
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
