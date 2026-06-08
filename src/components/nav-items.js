const overviewIcon = (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h10" />
  </svg>
);

const completedCarsIcon = (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 3h8l4 4v14H7z" />
    <path d="M15 3v4h4" />
    <path d="m10 14 2 2 4-4" />
  </svg>
);

export const staffNavItems = [
  {
    href: "/staff",
    label: "Overview",
    icon: overviewIcon,
  },
  {
    href: "/staff/completed",
    label: "Past Sessions",
    icon: completedCarsIcon,
  },
];

export const dashboardNavItems = [
  {
    href: "/owner",
    label: "Overview",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 20V10" />
        <path d="M12 20V4" />
        <path d="M19 20v-7" />
      </svg>
    ),
  },
  {
    href: "/owner/staff",
    label: "Staff View",
    icon: overviewIcon,
  },
  {
    href: "/owner/completed",
    label: "Past Sessions",
    icon: completedCarsIcon,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-.33-1 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.33H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1-.33 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6c.36 0 .7-.13 1-.37.26-.22.42-.54.45-.88V3a2 2 0 1 1 4 0v.09c.03.34.19.66.45.88.3.24.64.37 1 .37a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.46.46-.6 1.14-.33 1.82.12.39.35.74.67 1 .28.22.62.33.97.33H21a2 2 0 1 1 0 4h-.09c-.35 0-.69.11-.97.33-.32.26-.55.61-.67 1Z" />
      </svg>
    ),
  },
  {
    href: "/activity",
    label: "Staff Activity",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12h4l3-8 4 16 3-8h4" />
      </svg>
    ),
  },
  {
    href: "/reports/daily",
    label: "Daily Report",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 3h8l4 4v14H7z" />
        <path d="M15 3v4h4" />
        <path d="M10 13h6" />
        <path d="M10 17h4" />
      </svg>
    ),
  },
];

export function isStaffAreaPath(pathname) {
  return (
    pathname === "/staff" ||
    pathname.startsWith("/staff/") ||
    pathname.startsWith("/vehicles/")
  );
}

export function getVisibleNavItems(pathname) {
  return isStaffAreaPath(pathname) ? staffNavItems : dashboardNavItems;
}
