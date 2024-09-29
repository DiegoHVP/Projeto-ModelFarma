import Script from "next/script";
import Link from "next/link";
import Img from "next/image"
import custom from "./footer.module.css"

import Facebook from "../../../public/svgs/facebook.svg";
import Github from "../../../public/svgs/github.svg";
import Instagram from "../../../public/svgs/instagram.svg";
import Twitter from "../../../public/svgs/twitter-x.svg";

export default function Footer() {

  const SVG_Facebook = "https://facebook.com/"
  const SVG_Instagram = "https://instagram.com/"
  const SVG_Github = "https://github.com/DiegoHVP"
  const SVG_Twitter = "https://x.com/"




  return (
    <div>
      <footer className={`bg-dark text-center text-white p-0 ${custom.footer_body}`}>
        <div className="container p-4 pb-0">
          <section className="mb-3">
            <Link href={SVG_Facebook} role="button" className="btn btn-outline-light btn-floating m-1">
              <Img src={Facebook} alt="Facebook" />
            </Link>

            <Link href={SVG_Twitter} role="button" className="btn btn-outline-light btn-floating m-1">
              <Img src={Twitter} alt="Twitter" />
            </Link>

            <Link href={SVG_Instagram} role="button" className="btn btn-outline-light btn-floating m-1">
              <Img src={Instagram} alt="Instagram" />
            </Link>

            <Link href={SVG_Github} role="button" className="btn btn-outline-light btn-floating m-1">
              <Img src={Github} alt="Github" />
            </Link>
          </section>
        </div>

        <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          @Model-Farma Inc.<br />202x-202x
        </div>
      </footer>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></Script>
    </div>
  );
}
