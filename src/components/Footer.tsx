import * as React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="text-center text-lg-start bg-light text-muted mt-auto">
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <span>
          <Link to="/contact" className="text-reset me-4 text-decoration-none">
            Contact Us
          </Link>
        </span>
      </section>
    </footer>
  );
};

export default Footer;
