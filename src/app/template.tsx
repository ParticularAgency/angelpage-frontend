"use client";
import { Footer, Header } from "@/components";
import React from "react";
// import LoadingScreen from "@/components/common/pre-loader/LoadingScreen";

export default function Template({ children }: { children: React.ReactNode }) {
  // const [pageLoaded, setPageLoaded] = useState(false);
  return (
    <>
      <Header />
      <div className="angelpage-template-main-wraper">{children}</div>
      <Footer />
      {/* {!pageLoaded && (
				<LoadingScreen  />
			)} */}
    </>
  );
}
