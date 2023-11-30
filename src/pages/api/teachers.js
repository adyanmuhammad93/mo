import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { method, body, query } = req;

  // Get the absolute path to your JSON file
  const filePath = path.resolve("src/json/teachers.json");

  // Read the current data from your JSON file
  const fileData = fs.readFileSync(filePath);
  const teachersData = JSON.parse(fileData);

  switch (method) {
    case "GET":
      if (query.id) {
        const teacher = teachersData.find((c) => c.id === parseInt(query.id));
        if (teacher) {
          res.status(200).json(teacher);
        } else {
          res.status(404).json({ message: "teachers not found" });
        }
      } else {
        res.status(200).json(teachersData);
      }
      break;

    case "POST":
      try {
        body.id = teachersData.length + 1;
        teachersData.push(body);

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(teachersData));

        // Respond with a success message
        res
          .status(201)
          .json({ message: "teacher created successfully", teacher: body });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
      break;

    case "PUT":
      const existingteacherIndex = teachersData.findIndex(
        (c) => c.id === body.id
      );
      if (existingteacherIndex !== -1) {
        // Copy the existing teacher data
        const updatedteacher = {
          ...teachersData[existingteacherIndex],
          ...body,
        };

        // Update the teachersData array with the updated teacher
        teachersData[existingteacherIndex] = updatedteacher;

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(teachersData));

        res.status(200).json({
          message: "teacher updated successfully",
          teacher: updatedteacher,
        });
      } else {
        res.status(404).json({ message: "teacher not found" });
      }
      break;

    case "DELETE":
      const teacherToDeleteIndex = teachersData.findIndex(
        (c) => c.id === body.id
      );
      if (teacherToDeleteIndex !== -1) {
        const deletedteacher = teachersData.splice(teacherToDeleteIndex, 1)[0];

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(teachersData));

        res.status(200).json({
          message: "teacher deleted successfully",
          teacher: deletedteacher,
        });
      } else {
        res.status(404).json({ message: "teacher not found" });
      }
      break;

    case "PATCH":
      try {
        const teacherToArchiveIndex = teachersData.findIndex(
          (c) => c.id === body.id
        );

        if (teacherToArchiveIndex !== -1) {
          teachersData[teacherToArchiveIndex].archived = body.archived;

          // Write the updated data back to your JSON file
          fs.writeFileSync(filePath, JSON.stringify(teachersData));

          res.status(200).json({
            message: "teacher archived status updated successfully",
            teacher: teachersData[teacherToArchiveIndex],
          });
        } else {
          res.status(404).json({ message: "teacher not found" });
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
