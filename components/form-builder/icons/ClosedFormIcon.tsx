import React from "react";
export const ClosedFormIcon = ({ className, title }: { className?: string; title?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="41"
    width="40"
    className={className}
    focusable="false"
    aria-hidden={title ? false : true}
    role={title ? "img" : "presentation"}
  >
    {title && <title>{title}</title>}
    <path
      fill="#000"
      d="M20.5 40c-2.767 0-5.367-.525-7.8-1.575-2.433-1.05-4.55-2.475-6.35-4.275-1.8-1.8-3.225-3.917-4.275-6.35C1.025 25.367.5 22.767.5 20c0-2.767.525-5.367 1.575-7.8C3.125 9.767 4.55 7.65 6.35 5.85c1.8-1.8 3.917-3.225 6.35-4.275C15.133.525 17.733 0 20.5 0c2.767 0 5.367.525 7.8 1.575 2.433 1.05 4.55 2.475 6.35 4.275 1.8 1.8 3.225 3.917 4.275 6.35 1.05 2.433 1.575 5.033 1.575 7.8 0 2.767-.525 5.367-1.575 7.8-1.05 2.433-2.475 4.55-4.275 6.35-1.8 1.8-3.917 3.225-6.35 4.275C25.867 39.475 23.267 40 20.5 40Zm0-3c4.733 0 8.75-1.65 12.05-4.95 3.3-3.3 4.95-7.317 4.95-12.05 0-2.033-.35-3.983-1.05-5.85a17.722 17.722 0 0 0-2.95-5.1L9.55 33c1.5 1.3 3.192 2.292 5.075 2.975A17.093 17.093 0 0 0 20.5 37ZM7.55 30.95l23.9-23.9a17.135 17.135 0 0 0-5.1-3A16.524 16.524 0 0 0 20.5 3c-4.733 0-8.75 1.65-12.05 4.95C5.15 11.25 3.5 15.267 3.5 20c0 2.033.367 3.992 1.1 5.875a18.496 18.496 0 0 0 2.95 5.075Z"
    />
  </svg>
);
