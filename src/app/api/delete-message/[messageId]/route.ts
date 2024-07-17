import connectDbs from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  { params }: { params: { messageId: string } }
) => {
  if (request.method !== "DELETE") {
    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }
  const { messageId } = params;
  const session = await getServerSession();
  const user: User = session?.user as User;
  await connectDbs();

  try {
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Not Authenticated", success: false },
        { status: 401 }
      );
    }

    const updateResult = await UserModel.updateOne({ _id: user._id },{$pull: { messages: { _id: messageId} }})

    if(updateResult.modifiedCount === 0){
        return NextResponse.json(
            { success: false, message: "Message not found or already deleted" },
            { status: 404 }
          );
    }

    return NextResponse.json({ message: "Message Deleted Successfully", success: true },{status: 200});
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
};
