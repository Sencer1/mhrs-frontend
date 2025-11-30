import React from "react";

type PageContainerProps = {
  maxWidth?: number;
  children: React.ReactNode;
};

const PageContainer: React.FC<PageContainerProps> = ({
  maxWidth = 700,
  children,
}) => {
  return (
    <div style={{ padding: "24px", maxWidth, margin: "24px auto" }}>
      {children}
    </div>
  );
};

export default PageContainer;
