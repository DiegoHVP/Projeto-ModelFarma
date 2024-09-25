import React, { ReactNode } from "react";
import Navbar from "./geral/navbar/navbar";
import Footer from "./geral/footer";

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