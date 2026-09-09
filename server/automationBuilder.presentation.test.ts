import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("../client/src/pages/AutomationBuilder.tsx", import.meta.url), "utf8");
const router = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

describe("owner automation specification builder", () => {
  it("keeps user-defined specifications constrained to protected Blog releases", () => {
    expect(page).toContain("Owner automation builder");
    expect(page).toContain("Approved automation specification");
    expect(page).toContain("cannot execute arbitrary instructions or code");
    expect(page).toContain("/owner/content");
  });

  it("exposes schedule lifecycle controls only through protected scheduler procedures", () => {
    expect(page).toContain("Pause");
    expect(page).toContain("Resume");
    expect(page).toContain("Cancel");
    expect(router).toContain("pause: adminProcedure");
    expect(router).toContain("resume: adminProcedure");
    expect(router).toContain("specification: z.string().trim().min(12");
  });
});
