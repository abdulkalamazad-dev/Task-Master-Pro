import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>TaskMaster &copy; {new Date().getFullYear()} - End Term React Project</p>
        <div className="footer-links">
          <a href="https://github.com" className="footer-link" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://linkedin.com" className="footer-link" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com" className="footer-link" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
