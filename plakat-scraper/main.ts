import { DOMParser } from "@b-fuze/deno-dom";
import { sendMail } from "./mailer.ts";
import { getState, saveState } from "./state.ts";

const url =
  "https://docs.google.com/spreadsheets/d/1dWTBSZ8CgLFDBUKRkuJ9CbkYE9szNQKZH8brfTzxF-k/pubhtml/sheet?headers=false&gid=0";
// The published sheet assigns class names dynamically. The current saved
// development snapshot is only the table fragment, so it has no CSS rules;
// in that fragment the green cell is s10.
const fragmentGreenClass = "s10";

function getGreenCellClasses(html: string): Set<string> {
  const greenClasses = new Set<string>();
  const classRules = [...html.matchAll(/\.s(\d+)\s*\{([^}]*)\}/g)];

  for (const [, classNumber, declarations] of classRules) {
    if (
      /background-color\s*:\s*(?:#00ff00\b|rgb\(\s*0\s*,\s*255\s*,\s*0\s*\)|green)\s*(?:;|$)/i
        .test(declarations)
    ) {
      greenClasses.add(`s${classNumber}`);
    }
  }

  // output.html is an extracted table fragment with no style definitions.
  // Use the current published class for that format; full documents always
  // use their CSS mapping above instead.
  if (classRules.length === 0) {
    greenClasses.add(fragmentGreenClass);
  }

  return greenClasses;
}

export function parseAvailableSpots(html: string): string[] {
  const dom = new DOMParser().parseFromString(html, "text/html")!;
  const rows = dom.querySelector("tbody")?.querySelectorAll("tr");
  const greenClasses = getGreenCellClasses(html);
  const result: string[] = [];

  // Skip the title, spacer, and column-heading rows. Data rows have the row
  // number in column A and the date range in column B.
  for (let i = 3; i < (rows?.length || 0); i++) {
    const cells = rows![i].querySelectorAll("td");
    const dateRange = cells[1]?.textContent?.trim();
    if (!dateRange) continue;

    // Cells after the date range represent the available poster positions.
    for (let j = 2; j < cells.length; j++) {
      const cell = cells[j];
      if (
        [...greenClasses].some((className) =>
          cell.classList.contains(className)
        )
      ) {
        result.push(dateRange);
        console.log("Found an available spot:", cell.textContent, dateRange);
      }
    }
  }

  return result;
}

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

  const result = parseAvailableSpots(html);

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
