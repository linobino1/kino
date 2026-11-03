import { DOMParser } from "@b-fuze/deno-dom";
import { sendMail } from "./mailer.ts";
import { getState, saveState } from "./state.ts";

const url =
  "https://docs.google.com/spreadsheets/d/1dWTBSZ8CgLFDBUKRkuJ9CbkYE9szNQKZH8brfTzxF-k/pubhtml/sheet?headers=false&gid=0";
const cssGreen = "s8";

async function fetchHtml(): Promise<string> {
  //  during development, try loading the saved HTML file first
  if (Deno.env.get("ENV") !== "production") {
    try {
      return Deno.readTextFileSync("output.html");
    } catch {
      // ignore
    }
  }

  // The published Google Sheet includes its table in the HTTP response, so
  // there is no need to launch a browser to retrieve it.
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch published spreadsheet: ${response.status} ${response.statusText}`,
    );
  }
  const value = await response.text();

  // during development, save the HTML to a file
  if (Deno.env.get("ENV") !== "production") {
    Deno.writeTextFileSync("output.html", value);
  }

  return value;
}

export async function run() {
  // fetch HTML from the web or from a saved file (dev only)
  const html = await fetchHtml();

  const dom = new DOMParser().parseFromString(html, "text/html")!;

  // search for the colspan of A1
  const tbody = dom.querySelector("tbody");
  const rows = tbody?.querySelectorAll("tr");

  const headerRowIndex = 1;
  const headerColumns = 2;

  // iterate rows and find green cells
  // ignore header rows
  const result = [];
  for (let i = headerRowIndex + 1; i < (rows?.length || 0); i++) {
    const row = rows![i];
    const cells = row.querySelectorAll("td");

    // cell[0] is the row number
    // cell[1] is the header
    // cell[2,3,...] are the cells we need
    const header = cells[1];
    for (let j = headerColumns; j < cells.length - 1; j++) {
      const cell = cells[j];
      if (cell.classList.contains(cssGreen)) {
        result.push(header.textContent);
        console.log(
          "Found an available spot:",
          cell.textContent,
          header.textContent,
        );
      }
    }
  }

  if (result.length > 0) {
    const state = await getState();
    if (state) {
      console.log("Already sent email, not sending again.");
      return;
    }

    await sendMail({
      subject: "Luke Plakatwalker - Green Cells in A1",
      text: `
        Green cells found in these rows:
        ${result.map((r) => `- ${r}`).join("\n")}
      `,
    });

    await saveState(true);
  } else {
    console.log("No green cells found in A1 section.");
    await saveState(false);
  }

  console.log("Done.");
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  run().catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}
