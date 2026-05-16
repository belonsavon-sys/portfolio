/**
 * @react-pdf/renderer document for Pierre's downloadable résumé.
 * Editorial single-page layout — same content as /resume but
 * compressed and print-tuned. Geist Sans body + Geist Mono labels +
 * one accent color, deep-blue typography hierarchy.
 *
 * Rendered server-side from /src/app/api/resume/route.ts.
 */

import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/components/contact-config";
import {
  education,
  experience,
  languages,
  professionalSummary,
  projects,
  skillGroups,
} from "@/data/resume";

// Built-in @react-pdf fonts (Helvetica + Courier) — clean, reliable,
// zero external font fetch at request time. @react-pdf auto-resolves
// fontWeight + fontStyle to the right variant (Helvetica-Bold,
// Helvetica-Oblique, etc.) so we can keep semantic style props.

// Palette mirrors the site tokens but tuned for print contrast.
const ACCENT = "#1a4e9c";
const ACCENT_LIGHT = "#296ed6";
const INK = "#0f172a";
const MUTED = "#475569";
const RULE = "#cbd5e1";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.45,
    paddingBottom: 36,
    paddingHorizontal: 40,
    paddingTop: 36,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    borderBottomColor: INK,
    borderBottomStyle: "solid",
    borderBottomWidth: 1.2,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "column",
  },
  name: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: -0.4,
    lineHeight: 1,
  },
  role: {
    color: ACCENT,
    fontFamily: "Courier",
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: 1.6,
    marginTop: 5,
    textTransform: "uppercase",
  },
  headerRight: {
    flexDirection: "column",
    textAlign: "right",
  },
  headerLine: {
    color: MUTED,
    fontFamily: "Courier",
    fontSize: 8.5,
    marginBottom: 2,
  },
  headerLink: {
    color: ACCENT,
    fontFamily: "Courier",
    fontSize: 8.5,
    marginBottom: 2,
    textDecoration: "none",
  },
  headerLinkBold: {
    color: ACCENT,
    fontFamily: "Courier",
    fontSize: 9.5,
    fontWeight: 700,
    marginBottom: 3,
    textDecoration: "underline",
  },

  // ── Section ─────────────────────────────────────────────────
  section: {
    marginTop: 16,
  },
  sectionHead: {
    alignItems: "baseline",
    borderBottomColor: RULE,
    borderBottomStyle: "solid",
    borderBottomWidth: 0.6,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 4,
  },
  sectionTitle: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionMeta: {
    color: MUTED,
    fontFamily: "Courier",
    fontSize: 7.5,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  // ── Summary ─────────────────────────────────────────────────
  summary: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    marginTop: 7,
  },

  // ── Experience ──────────────────────────────────────────────
  roleBlock: {
    marginTop: 9,
  },
  roleHead: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  companyName: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: -0.1,
  },
  rolePeriod: {
    color: MUTED,
    fontFamily: "Courier",
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  roleSub: {
    color: ACCENT,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    fontStyle: "italic",
    fontWeight: 500,
  },
  roleLocation: {
    color: MUTED,
    fontFamily: "Courier",
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 3,
  },
  bulletMark: {
    color: ACCENT,
    fontSize: 9.5,
    marginRight: 6,
    width: 8,
  },
  bulletText: {
    color: INK,
    flex: 1,
    fontFamily: "Helvetica",
    fontSize: 9.2,
    lineHeight: 1.4,
  },
  receipts: {
    color: ACCENT,
    fontFamily: "Courier",
    fontSize: 7.5,
    letterSpacing: 1,
    marginTop: 4,
    textDecoration: "none",
    textTransform: "uppercase",
  },

  // ── Projects ────────────────────────────────────────────────
  projectsRow: {
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
  projectCol: {
    width: "100%",
  },
  projectHead: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectName: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 10,
    fontWeight: 600,
  },
  projectMeta: {
    color: MUTED,
    fontFamily: "Courier",
    fontSize: 7.5,
    letterSpacing: 0.8,
    marginTop: 1,
    textTransform: "uppercase",
  },
  projectBody: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.4,
    marginTop: 3,
  },
  projectStack: {
    color: MUTED,
    fontFamily: "Courier",
    fontSize: 7.5,
    letterSpacing: 0.6,
    marginTop: 3,
  },

  // ── Skills ──────────────────────────────────────────────────
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  skillGroup: {
    marginRight: 18,
    marginTop: 4,
    width: "47%",
  },
  skillTitle: {
    color: ACCENT,
    fontFamily: "Courier",
    fontSize: 7.5,
    fontWeight: 600,
    letterSpacing: 1.2,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  skillItem: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.45,
  },

  // ── Education ───────────────────────────────────────────────
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  eduLeft: {
    flex: 1,
  },
  eduProgram: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 10,
    fontWeight: 600,
  },
  eduIssuer: {
    color: INK,
    fontFamily: "Helvetica",
    fontSize: 9,
    marginTop: 1,
  },
  eduMeta: {
    color: MUTED,
    fontFamily: "Courier",
    fontSize: 7.5,
    letterSpacing: 1,
    marginTop: 1,
    textAlign: "right",
    textTransform: "uppercase",
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    bottom: 18,
    color: MUTED,
    fontFamily: "Courier",
    fontSize: 7,
    left: 40,
    letterSpacing: 1.2,
    position: "absolute",
    right: 40,
    textTransform: "uppercase",
  },
  footerRow: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function todayDateline(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();
}

export function ResumeDocument() {
  return (
    <Document
      author="Pierre Belon Savon"
      creator="pierrebelonsavon.com"
      keywords="AI engineer, agent harness, hotel operations, Atlas, Blackdoor"
      producer="pierrebelonsavon.com"
      subject="Résumé · Pierre Belon Savon"
      title="Pierre Belon Savon — Résumé"
    >
      <Page size="LETTER" style={styles.page} wrap>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>Pierre Belon Savon</Text>
            <Text style={styles.role}>AI Engineer · Building Production Systems</Text>
          </View>
          <View style={styles.headerRight}>
            <Link src="https://pierrebelonsavon.com" style={styles.headerLinkBold}>
              pierrebelonsavon.com
            </Link>
            <Link src={EMAIL_MAILTO} style={styles.headerLink}>
              {EMAIL_DISPLAY}
            </Link>
            <Link src={PHONE_TEL} style={styles.headerLink}>
              {PHONE_DISPLAY}
            </Link>
            <Link src={GITHUB_URL} style={styles.headerLink}>
              github.com/belonsavon-sys
            </Link>
            {LINKEDIN_URL ? (
              <Link src={LINKEDIN_URL} style={styles.headerLink}>
                {LINKEDIN_URL.replace(/^https?:\/\/(www\.)?/, "")}
              </Link>
            ) : null}
            <Text style={styles.headerLine}>OCEAN SHORES, WA · PT</Text>
          </View>
        </View>

        {/* SUMMARY */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.sectionMeta}>{languages.join(" · ")}</Text>
          </View>
          <Text style={styles.summary}>{professionalSummary}</Text>
        </View>

        {/* EXPERIENCE */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <Text style={styles.sectionMeta}>
              {experience.length} roles · both current
            </Text>
          </View>
          {experience.map((entry) => (
            <View key={entry.company} style={styles.roleBlock} wrap={false}>
              <View style={styles.roleHead}>
                <Text style={styles.companyName}>{entry.company}</Text>
                <Text style={styles.rolePeriod}>{entry.period}</Text>
              </View>
              <View style={styles.roleHead}>
                <Text style={styles.roleSub}>{entry.role}</Text>
                <Text style={styles.roleLocation}>{entry.location}</Text>
              </View>
              {entry.bullets.map((bullet) => (
                <View key={bullet} style={styles.bulletRow}>
                  <Text style={styles.bulletMark}>—</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
              {entry.receipts ? (
                <Link src={entry.receipts.href} style={styles.receipts}>
                  &gt;&gt; {entry.receipts.label}
                </Link>
              ) : null}
            </View>
          ))}
        </View>

        {/* PROJECTS */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Independent Projects</Text>
            <Text style={styles.sectionMeta}>
              {projects.length} active · personal
            </Text>
          </View>
          <View style={styles.projectsRow}>
            {projects.map((entry) => (
              <View key={entry.name} style={styles.projectCol} wrap={false}>
                <View style={styles.projectHead}>
                  <Text style={styles.projectName}>{entry.name}</Text>
                  <Text style={styles.projectMeta}>
                    Shipped {entry.shipped} · {entry.scope}
                  </Text>
                </View>
                <Text style={styles.projectBody}>{entry.bullets[0]}</Text>
                <Text style={styles.projectStack}>
                  {entry.stack.map((t) => t.toLowerCase()).join(" · ")}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* SKILLS */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.sectionMeta}>
              {skillGroups.length} categories
            </Text>
          </View>
          <View style={styles.skillsGrid}>
            {skillGroups.map((group) => (
              <View key={group.title} style={styles.skillGroup} wrap={false}>
                <Text style={styles.skillTitle}>{group.title}</Text>
                {group.items.map((item) => (
                  <Text key={item} style={styles.skillItem}>
                    — {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* EDUCATION */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text style={styles.sectionMeta}>IBM cert · in progress</Text>
          </View>
          {education.map((entry) => (
            <View key={entry.program} style={styles.eduRow} wrap={false}>
              <View style={styles.eduLeft}>
                <Text style={styles.eduProgram}>{entry.program}</Text>
                <Text style={styles.eduIssuer}>{entry.issuer}</Text>
              </View>
              <View>
                <Text style={styles.eduMeta}>{entry.meta}</Text>
                <Text style={styles.eduMeta}>{entry.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* FOOTER — generated stamp */}
        <View fixed style={styles.footer}>
          <View style={styles.footerRow}>
            <Text>Generated {todayDateline()} · pierrebelonsavon.com</Text>
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
