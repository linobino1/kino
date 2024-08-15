import React from "react";
import { Gutter } from "payload/components/elements";

const HowTo = () => {
  return (
    <Gutter>
      <h1>How to use Mailings</h1>
      <p>To create a new mailing, follow these steps:</p>
      <ol>
        <li>
          Create a new item or duplicate the latest item in the list of
          mailings.
        </li>
        <li>Edit the content as needed.</li>
        <li>Hit Save.</li>
        <li>
          Scroll down, verify that the HTML preview looks good, and click "Copy
          to clipboard".
        </li>
        <li>
          Click "What now?" to see the next steps.{" "}
          <i>
            The button will appear underneath the "Copy to clipboard" button.
          </i>
        </li>
      </ol>
    </Gutter>
  );
};
export default HowTo;
