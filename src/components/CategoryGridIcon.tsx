import type { SVGProps } from "react";

/** Same 3-tile grid as search result cards (replaces BiCategoryAlt elsewhere). */
export default function CategoryGridIcon(props: SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <path
        d="M3 7h6v6H3zM15 3h6v6h-6zM15 15h6v6h-6z"
        fill="currentColor"
      />
    </svg>
  );
}
