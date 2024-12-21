import React from "react";

function AppFooter() {
  return (
    <footer className="bg-yellow-600 text-white py-1">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Copyright */}
        <p className="text-sm">© 2024 MyApp. All Rights Reserved.</p>

        {/* Social Links */}
        <div className="space-x-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-400"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-400"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-400"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
