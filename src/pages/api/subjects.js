import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { method, body, query } = req;

  // Get the absolute path to your JSON file
  const filePath = path.resolve("src/json/subjects.json");

  // Read the current data from your JSON file
  const fileData = fs.readFileSync(filePath);
  const subjectsData = JSON.parse(fileData);

  switch (method) {
    case "GET":
      if (query.id) {
        const subject = subjectsData.find((c) => c.id === parseInt(query.id));
        if (subject) {
          res.status(200).json(subject);
        } else {
          res.status(404).json({ message: "Subjects not found" });
        }
      } else {
        res.status(200).json(subjectsData);
      }
      break;

    case "POST":
      try {
        body.id = subjectsData.length + 1;
        subjectsData.push(body);

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(subjectsData));

        // Respond with a success message
        res
          .status(201)
          .json({ message: "Subject created successfully", subject: body });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
      break;

    case "PUT":
      const existingSubjectIndex = subjectsData.findIndex(
        (c) => c.id === body.id
      );
      if (existingSubjectIndex !== -1) {
        // Copy the existing subject data
        const updatedSubject = {
          ...subjectsData[existingSubjectIndex],
          ...body,
        };

        // Update the subjectsData array with the updated subject
        subjectsData[existingSubjectIndex] = updatedSubject;

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(subjectsData));

        res.status(200).json({
          message: "Subject updated successfully",
          subject: updatedSubject,
        });
      } else {
        res.status(404).json({ message: "Subject not found" });
      }
      break;

    case "DELETE":
      const subjectToDeleteIndex = subjectsData.findIndex(
        (c) => c.id === body.id
      );
      if (subjectToDeleteIndex !== -1) {
        const deletedSubject = subjectsData.splice(subjectToDeleteIndex, 1)[0];

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(subjectsData));

        res.status(200).json({
          message: "Subject deleted successfully",
          subject: deletedSubject,
        });
      } else {
        res.status(404).json({ message: "Subject not found" });
      }
      break;

    case "PATCH":
      try {
        const subjectToArchiveIndex = subjectsData.findIndex(
          (c) => c.id === body.id
        );

        if (subjectToArchiveIndex !== -1) {
          subjectsData[subjectToArchiveIndex].archived = body.archived;

          // Write the updated data back to your JSON file
          fs.writeFileSync(filePath, JSON.stringify(subjectsData));

          res.status(200).json({
            message: "Subject archived status updated successfully",
            subject: subjectsData[subjectToArchiveIndex],
          });
        } else {
          res.status(404).json({ message: "Subject not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}
