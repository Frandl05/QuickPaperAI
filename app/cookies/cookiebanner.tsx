"use client";

import React from "react";
import { useCookieContext } from "@/app/cookies/cookiecontext";
import { X } from "lucide-react";

const CookieBanner: React.FC = () => {
  const { consentStatus, setConsentStatus } = useCookieContext();

  const acceptCookies = () => setConsentStatus("accepted");
  const rejectCookies = () => setConsentStatus("rejected");

  if (consentStatus !== "unknown") {
    return null; // Do not show the banner if the user has already given consent
  }

  return (
    <div className="cookie-banner fixed bottom-4 md:bottom-4 md:left-4 bg-white p-4 rounded-lg shadow-md border border-gray-300 text-gray-800 md:max-w-xs">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg mb-2">This website uses cookies</h3>
          <p className="text-sm">
            We use cookies to enhance your experience. By using our site, you accept all cookies in accordance with our policy. Closing this banner also means you accept all cookies.
          </p>
        </div>
        <button onClick={() => setConsentStatus("accepted")} className="text-gray-500 ml-2">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={acceptCookies}
          className="bg-black text-white px-8 py-2 rounded font-semibold hover:bg-gray-800"
        >
          Accept
        </button>
        <button
          onClick={rejectCookies}
          className="bg-transparent text-gray-600 px-8 py-2 rounded font-semibold hover:bg-gray-100"
        >
          Decline
        </button>
      </div>

      <a
        href="https://quickpaperai.com/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 text-sm mt-3 ml-1 underline hover:text-black block"
        style={{ marginTop: '0.75rem', marginLeft: '0.25rem' }}
      >
        Show details
      </a>
    </div>
  );
};

export default CookieBanner;
