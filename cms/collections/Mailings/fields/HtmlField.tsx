import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useField } from "payload/components/forms";

const stylesButton: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: 12,
  appearance: "none",
  border: "none",
  outline: "none",
  background: "#3C3C3C",
  color: "white",
  borderRadius: 5,
  cursor: "pointer",
  margin: 0,
  padding: "5px 10px",
  marginLeft: 5,
};

const HtmlField = () => {
  const { t } = useTranslation();
  const { value } = useField({ path: "html" });
  const [copied, setCopied] = React.useState(false);
  const [showHowTo, setShowHowTo] = React.useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <div>
      <label className="field-label">
        {t("HTML")}
        {typeof value === "string" && value.length > 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(value);
              if (copied) {
                setCopied(false);
                window.setTimeout(() => setCopied(true), 100);
              } else {
                setCopied(true);
              }
            }}
            style={stylesButton}
          >
            {t("Copy to clipboard")}
          </button>
        )}
        {copied && <span style={{ marginLeft: 5 }}>{"✅"}</span>}
      </label>
      {typeof value === "string" && value.length > 0 ? (
        <>
          {copied && !showHowTo && (
            <div
              onClick={() => setShowHowTo(true)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              What now?
            </div>
          )}
          {showHowTo && (
            <div
              style={{
                position: "fixed",
                zIndex: 1000,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                padding: "5vw",
                background: "white",
              }}
            >
              <p>Now we have our email content, let's send it!</p>
              <ol>
                <li>
                  Log in at{" "}
                  <a
                    target="_blank"
                    href="https://news.kinoimblauensalon.de"
                    rel="noopener noreferrer"
                  >
                    news.kinoimblauensalon.de
                  </a>
                  .
                </li>
                <li>Create a new campaign.</li>
                <li>
                  Give it a name (not important), a subject (important), and
                  assign it to the "Newsletter" list.
                </li>
                <li>Click "Continue".</li>
                <li>
                  In the "Content Editor" tab, choose the format "Raw HTML".
                </li>
                <li>Paste the HTML code you copied earlier.</li>
                <li>Click "Save Changes".</li>
                <li>
                  Go back to the "Campaign" tab and send a test email to
                  yourself.
                </li>
                <li>Send or schedule the campaign.</li>
              </ol>
              <button style={stylesButton} onClick={() => setShowHowTo(false)}>
                Close
              </button>
            </div>
          )}
          <iframe
            title="preview"
            width={750}
            height={3500}
            srcDoc={value ?? ""}
            style={{ maxHeight: "80vh", marginTop: 0 }}
          />
        </>
      ) : (
        <p>{t("not available")}</p>
      )}
    </div>
  );
};
export default HtmlField;
