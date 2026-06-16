"use server";

import { auth } from "@/auth"; 
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User"; 
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: { success: boolean } | null, formData: FormData) {
  const session = await auth(); 
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const imageEntry = formData.get("image");
  
  let imageUrl: string | undefined;
  if (imageEntry && typeof imageEntry !== "string" && imageEntry.size > 0) {
    const buffer = Buffer.from(await imageEntry.arrayBuffer());
    imageUrl = `data:${imageEntry.type};base64,${buffer.toString("base64")}`;
  }
  
  await connectMongoDB();

  const updateFields: Record<string, any> = { name };
  if (imageUrl) {
    updateFields.image = imageUrl;
  }

  // Update using the Mongoose model
  await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: updateFields },
    { new: true }
  );

  revalidatePath("/dashboard"); 
  
  return { success: true, name, image: imageUrl ?? null };
}

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.email) return null;

  await connectMongoDB();
  const user = await User.findOne({ email: session.user.email }).select("name image").lean();

  if (!user) return null;

  return {
    name: user.name as string,
    image: user.image as string | null,
  };
}