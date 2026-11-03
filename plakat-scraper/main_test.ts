import { assertEquals } from "@std/assert";
import { parseAvailableSpots } from "./main.ts";

Deno.test("uses the published CSS to identify green cells", () => {
  const html = `
    <style>
      .ritz .waffle .s8{background-color:#ff0000;}
      .ritz .waffle .s10{background-color:#00ff00;}
    </style>
    <table><tbody>
      <tr><td>title</td></tr>
      <tr><td>section</td></tr>
      <tr><td>number</td><td>date</td></tr>
      <tr><td>43</td><td>30.10 bis 05.11</td><td class="s8"></td><td class="s10"></td></tr>
    </tbody></table>
  `;

  assertEquals(parseAvailableSpots(html), ["30.10 bis 05.11"]);
});

Deno.test("uses the current green class for style-less table fragments", () => {
  const html = `
    <table><tbody>
      <tr><td>title</td></tr>
      <tr><td>section</td></tr>
      <tr><td>number</td><td>date</td></tr>
      <tr><td>43</td><td>30.10 bis 05.11</td><td class="s8"></td><td class="s10"></td></tr>
    </tbody></table>
  `;

  assertEquals(parseAvailableSpots(html), ["30.10 bis 05.11"]);
});
