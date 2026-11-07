import { PrismaClient, ReportCategory, ReportStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const reportSeeder = async () => {
  try {
    const reporter1 = await prisma.user.findUnique({
      where: { email: "reporter@amana.id" },
    });
    const reporter2 = await prisma.user.findUnique({
      where: { email: "siti@amana.id" },
    });

    if (!reporter1 || !reporter2) {
      throw new Error("Test reporters not found. Run userSeeder first.");
    }

    const sampleReports = [
      {
        referenceNumber: "WBP-20261101-A1B2C",
        title: "Suspected Misuse of Company Resources",
        category: ReportCategory.MISUSE_OF_RESOURCES,
        description:
          "Observed unauthorized usage of company fleet vehicles and corporate fuel cards during non-working weekends by logistics personnel at Warehouse B.",
        incidentDate: new Date("2026-10-25T10:00:00.000Z"),
        status: ReportStatus.DRAFT,
        adminNotes: null,
        reporterId: reporter1.id,
      },
      {
        referenceNumber: "WBP-20261102-D3E4F",
        title: "Irregular Vendor Invoice Approval in Procurement",
        category: ReportCategory.FRAUD,
        description:
          "Multiple invoices from PT Maju Bersama were approved without standard three-way matching or delivery receipts in Q3.",
        incidentDate: new Date("2026-10-18T09:00:00.000Z"),
        status: ReportStatus.SUBMITTED,
        adminNotes: null,
        reporterId: reporter1.id,
      },
      {
        referenceNumber: "WBP-20261103-G5H6I",
        title: "Unreported Conflict of Interest in IT Vendor Selection",
        category: ReportCategory.CONFLICT_OF_INTEREST,
        description:
          "A committee member evaluating cloud service subcontractors has an undisclosed family relationship with one of the bidding company directors.",
        incidentDate: new Date("2026-10-12T14:30:00.000Z"),
        status: ReportStatus.UNDER_REVIEW,
        adminNotes:
          "Internal audit team has been assigned to verify vendor ownership documents and procurement committee declarations.",
        reporterId: reporter1.id,
      },
      {
        referenceNumber: "WBP-20261104-J7K8L",
        title: "Safety Protocol Bypass at Main Assembly Line",
        category: ReportCategory.SAFETY_VIOLATION,
        description:
          "Emergency interlock sensors on Line 3 were manually bypassed during the night shift to meet output quotas, creating a hazard for operators.",
        incidentDate: new Date("2026-10-05T22:00:00.000Z"),
        status: ReportStatus.RESOLVED,
        adminNotes:
          "HSE inspection conducted immediately. Sensors restored, supervisor reprimanded, and mandatory safety retraining completed on Oct 15.",
        reporterId: reporter1.id,
      },
      {
        referenceNumber: "WBP-20261105-M9N0P",
        title: "Improper Sharing of Customer PII via Unencrypted Spreadsheet",
        category: ReportCategory.DATA_PRIVACY_BREACH,
        description:
          "Customer contact records were exported and shared over personal messaging channels without encryption or access controls.",
        incidentDate: new Date("2026-10-28T11:15:00.000Z"),
        status: ReportStatus.SUBMITTED,
        adminNotes: null,
        reporterId: reporter2.id,
      },
      {
        referenceNumber: "WBP-20261105-Q1R2S",
        title: "Workplace Harassment Complaint in Regional Sales Office",
        category: ReportCategory.HARASSMENT,
        description:
          "Repeated verbal intimidation and hostile remarks directed at junior team members during weekly sales review meetings.",
        incidentDate: new Date("2026-10-20T16:00:00.000Z"),
        status: ReportStatus.UNDER_REVIEW,
        adminNotes:
          "HR Ethics Committee is conducting confidential interviews with witnesses.",
        reporterId: reporter2.id,
      },
    ];

    for (const report of sampleReports) {
      await prisma.incidentReport.upsert({
        where: { referenceNumber: report.referenceNumber },
        update: {
          title: report.title,
          category: report.category,
          description: report.description,
          incidentDate: report.incidentDate,
          status: report.status,
          adminNotes: report.adminNotes,
          reporterId: report.reporterId,
          deletedAt: null,
        },
        create: report,
      });
    }

    console.log("Seeding incident reports completed successfully!");
  } catch (err: any) {
    console.error("seeding incident reports error", err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
