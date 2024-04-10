// import { db_comments } from "../../../../lib/db_comments";
import dbConnect from "../../../../db/connect";
import Place from "../../../../db/models/Place";
import Comment from "../../../../db/models/Comment";

export default async function handler(request, response) {
  const { id } = request.query;

  await dbConnect();
  if (!id) {
    return;
  }

  if (request.method === "PATCH") {
    await Place.findByIdAndUpdate(id, {
      $set: request.body,
    });
    response.status(200).json({
      status: `Place ${id} updated!`,
    });
  }

  if (request.method === "DELETE") {
    await Place.findByIdAndDelete(id);
    response
      .status(200)
      .json({ status: "Nobody wants to visit this place anyways" });
  }

  if (request.method === "GET") {
    const test = await Place.findById(id).populate("comments");
    if (!test) {
      return response.status(404).json({ status: "page not found" }); // added no data case
    }
    return response.status(200).json(test);
  }

  // const place = await Place.findById(id);

  // const comment = place?.comments;
  // const allCommentIds = comment?.map((comment) => comment.$oid) || [];
  // const comments = db_comments.filter((comment) =>
  //   allCommentIds.includes(comment._id.$oid)
  // );
  // if (!place) {
  //   return response.status(404).json({ status: "Not found" });
  // }

  if (request.method === "POST") {
    console.log("========================", request.body);
    try {
      const newComment = await Comment.create(request.body);
      await Place.findByIdAndUpdate(
        id,
        { $push: { comments: newComment._id } },
        { new: true }
      );
      response.status(200).json({ status: "uploaded new comment" });
    } catch (error) {
      response.status(500).json({ error: "error uploading" });
    }
  }
}
