import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useField } from "payload/components/forms";

const HtmlField = () => {
  const { t } = useTranslation();
  const { value } = useField({ path: "html" });
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
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
              setCopied(true);
            }}
            style={{
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
            }}
          >
            {t("Copy to clipboard")}
          </button>
        )}
        {copied && <span style={{ marginLeft: 5 }}>{"✅"}</span>}
      </label>
      {typeof value === "string" && value.length > 0 ? (
        <iframe
          title="preview"
          width={750}
          height={3500}
          srcDoc={value ?? ""}
          style={{ maxHeight: "80vh", marginTop: 10 }}
        />
      ) : (
        <p>{t("not available")}</p>
      )}
    </div>
  );
};
export default HtmlField;
