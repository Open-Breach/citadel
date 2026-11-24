import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { projects } from "../../src/content/projects.ts";
import { latestReleases, releases } from "../../src/content/releases.ts";
import { frontPage, site } from "../../src/content/site.ts";
import { team } from "../../src/content/team.ts";
import type { Copy, Release } from "../../src/content/types.ts";

function isMarked(copy: Copy): boolean {
  return copy.text.trim().length > 0 && copy.placeholder === true;
}

describe("the five projects", () => {
  test("are Rick, Meeseeks, Gossip, Trebuchet and Butterbot, in that order", () => {
    assert.deepEqual(
      projects.map((project) => project.name),
      ["Rick", "Meeseeks", "Gossip", "Trebuchet", "Butterbot"],
    );
  });

  test("each has a slug that is its name in lower case", () => {
    for (const project of projects) assert.equal(project.slug, project.name.toLowerCase());
  });

  test("each has one line and a repository under Open-Breach on GitHub", () => {
    for (const project of projects) {
      assert.ok(isMarked(project.tagline), `${project.name}: a tagline, marked as a draft`);
      assert.equal(project.repository, `https://github.com/Open-Breach/${project.slug}`);
    }
  });

  test("only Rick has a page in this round", () => {
    assert.deepEqual(
      projects.filter((project) => project.page).map((project) => project.name),
      ["Rick"],
    );
  });
});

describe("Rick's texts", () => {
  const page = projects[0].page!;

  test("say what Rick is and why it exists, marked as drafts", () => {
    assert.ok(isMarked(page.what));
    assert.ok(isMarked(page.description));
    assert.ok(isMarked(page.why.heading));
    assert.ok(page.why.paragraphs.length > 0);
    assert.ok(page.why.paragraphs.every(isMarked));
  });

  test("list three to eight top features, each with a name and a description", () => {
    assert.ok(page.features.length >= 3 && page.features.length <= 8);
    for (const feature of page.features) {
      assert.ok(isMarked(feature.name));
      assert.ok(isMarked(feature.description));
    }
  });

  test("have install steps for each platform Rick runs on", () => {
    assert.deepEqual(
      page.install.map((instructions) => instructions.platform),
      projects[0].platforms.list,
    );
    for (const instructions of page.install) {
      assert.ok(instructions.steps.length > 0);
      assert.ok(instructions.steps.every((step) => isMarked(step.text)));
    }
  });

  test("show a command or a download only for a way of installing that works today", () => {
    const steps = page.install.flatMap((instructions) => instructions.steps);
    const later = steps.filter((step) => step.stillToCome);
    assert.equal(later.length, 1, "the package repository is named as still to come");
    assert.match(later[0].text.text, /package repository/);
    assert.equal(later[0].command, undefined);
    assert.equal(later[0].downloads, undefined);
    for (const step of steps) {
      assert.doesNotMatch(step.command?.text ?? "", /https?:\/\//, "no command reaches for a host");
      for (const download of step.downloads ?? []) {
        assert.match(download.url, /^https:\/\/github\.com\/Open-Breach\/rick\/releases\/download\/v0\.6\.0\/rick-0\.6\.0-/);
        assert.notEqual(download.placeholder, true, "checked against the latest release");
      }
    }
    assert.equal(page.badges.version, "0.6.0");
  });

  test("show at least three screenshots, each with a caption", () => {
    assert.ok(page.screenshots.length >= 3);
    assert.ok(page.screenshots.every((screenshot) => isMarked(screenshot.caption)));
  });

  test("have sample badge values, marked as a placeholder", () => {
    assert.equal(page.badges.placeholder, true);
    assert.ok(page.badges.version && page.badges.licence);
  });
});

describe("Open-Breach's texts", () => {
  test("the headline, the two lines, the mission and the Claude statement are marked drafts", () => {
    assert.ok(frontPage.hero.headline.length > 0 && frontPage.hero.headline.every(isMarked));
    assert.ok(isMarked(frontPage.hero.intro));
    assert.ok(isMarked(frontPage.hero.label));
    assert.ok(isMarked(frontPage.mission.statement));
    assert.ok(frontPage.mission.paragraphs.every(isMarked));
    assert.ok(isMarked(frontPage.claude.statement));
    assert.match(frontPage.claude.statement.text, /built with Claude/);
    assert.ok(isMarked(site.description));
  });

  test("no support target is configured", () => {
    assert.equal(site.supportUrl, null);
  });
});

describe("releases", () => {
  test("the sample entries are marked as placeholders", () => {
    assert.ok(releases.length > 5, "more than five, so that the limit shows");
    assert.ok(releases.every((release) => release.placeholder === true));
  });

  test("the latest come newest first, five at most", () => {
    const latest = latestReleases(releases);
    assert.equal(latest.length, 5);
    const dates = latest.map((release) => release.date);
    assert.deepEqual(dates, [...dates].sort().reverse());
    assert.equal(latest[0].date, [...releases.map((r) => r.date)].sort().at(-1));
  });

  test("with fewer than five, all are returned, and none gives none", () => {
    const two: Release[] = releases.slice(0, 2);
    assert.equal(latestReleases(two).length, 2);
    assert.deepEqual(latestReleases([]), []);
  });
});

describe("the team", () => {
  test("has two people, each with a name, a role and one line, marked as placeholders", () => {
    assert.equal(team.length, 2);
    for (const member of team) {
      assert.ok(isMarked(member.name) && isMarked(member.role) && isMarked(member.line));
    }
  });

  test("lists no AI as a member", () => {
    for (const member of team) assert.doesNotMatch(member.name.text, /claude|\bAI\b/i);
  });
});
