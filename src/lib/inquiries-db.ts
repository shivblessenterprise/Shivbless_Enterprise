import { getDb } from "@/lib/mongodb";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  product: string;
  quantity: string;
  city: string;
  message: string;
  createdAt: string;
  status: "new" | "read";
};

type InquiryDoc = Inquiry & { _id: string };

export async function listInquiries(): Promise<Inquiry[]> {
  const db = await getDb();
  const rows = await db
    .collection<InquiryDoc>("inquiries")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return rows.map(({ _id, ...rest }) => rest);
}

export async function createInquiry(
  inquiry: Omit<Inquiry, "id" | "createdAt" | "status">
): Promise<Inquiry> {
  const db = await getDb();
  const doc: InquiryDoc = {
    _id: `inq-${Date.now()}`,
    id: "",
    ...inquiry,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  doc.id = doc._id;
  await db.collection<InquiryDoc>("inquiries").insertOne(doc);
  const { _id, ...rest } = doc;
  return rest;
}

export async function updateInquiryStatus(
  id: string,
  status: "new" | "read"
): Promise<Inquiry[]> {
  const db = await getDb();
  await db.collection("inquiries").updateOne({ _id: id }, { $set: { status } });
  return listInquiries();
}

export async function deleteInquiry(id: string): Promise<Inquiry[]> {
  const db = await getDb();
  await db.collection("inquiries").deleteOne({ _id: id });
  return listInquiries();
}
