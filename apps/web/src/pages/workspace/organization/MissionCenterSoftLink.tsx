import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { getAppPath } from "../../../workspace/appRegistry.js";
import { MISSION_LINK_DESCRIPTION, MISSION_LINK_HEADING, MISSION_LINK_LABEL } from "./organizationCopy.js";

export function MissionCenterSoftLink(): ReactNode {
  return (
    <section
      aria-labelledby="organization-mission-link-heading"
      className="rounded-lg border border-gray-200 bg-white p-6"
      data-testid="organization-mission-link"
    >
      <h2 id="organization-mission-link-heading" className="text-lg font-semibold text-gray-900">
        {MISSION_LINK_HEADING}
      </h2>
      <p className="mt-1 max-w-prose text-gray-600">{MISSION_LINK_DESCRIPTION}</p>
      <Link
        className="mt-3 inline-block font-medium text-[#0a6ed1] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6ed1]"
        to={getAppPath("centre-mission")}
        data-testid="organization-mission-link-cta"
      >
        {MISSION_LINK_LABEL}
      </Link>
    </section>
  );
}
