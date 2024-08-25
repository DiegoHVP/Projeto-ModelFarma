import React, { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

interface MainContainer {
    children: ReactNode;
  }

export default function MainContainer({children}: MainContainer){
    return(
    <div>
      <Navbar/>
      {children}
      <Footer/>
    </div>
    );
}