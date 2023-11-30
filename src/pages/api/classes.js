import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { method, body, query } = req;

  // Get the absolute path to your JSON file
  const filePath = path.resolve("src/json/classes.json");

  // Read the current data from your JSON file
  const fileData = fs.readFileSync(filePath);
  const classesData = JSON.parse(fileData);

  switch (method) {
    case "GET":
      if (query.id) {
        const classes = classesData.find((c) => c.id === parseInt(query.id));
        if (classes) {
          res.status(200).json(classes);
        } else {
          res.status(404).json({ message: "Classes not found" });
        }
      } else {
        res.status(200).json(classesData);
      }
      break;

    case "POST":
      try {
        body.id = classesData.length + 1;
        classesData.push(body);

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(classesData));

        // Respond with a success message
        res
          .status(201)
          .json({ message: "Class created successfully", classes: body });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
      break;

    case "PUT":
      const existingClassIndex = classesData.findIndex((c) => c.id === body.id);
      if (existingClassIndex !== -1) {
        // Copy the existing classes data
        const updatedClass = {
          ...classesData[existingClassIndex],
          ...body,
        };

        // Update the classesData array with the updated classes
        classesData[existingClassIndex] = updatedClass;

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(classesData));

        res.status(200).json({
          message: "Class updated successfully",
          classes: updatedClass,
        });
      } else {
        res.status(404).json({ message: "Class not found" });
      }
      break;

    case "DELETE":
      const classesToDeleteIndex = classesData.findIndex(
        (c) => c.id === body.id
      );
      if (classesToDeleteIndex !== -1) {
        const deletedClass = classesData.splice(classesToDeleteIndex, 1)[0];

        // Write the updated data back to your JSON file
        fs.writeFileSync(filePath, JSON.stringify(classesData));

        res.status(200).json({
          message: "Class deleted successfully",
          classes: deletedClass,
        });
      } else {
        res.status(404).json({ message: "Class not found" });
      }
      break;

    case "PATCH":
      try {
        const classesToArchiveIndex = classesData.findIndex(
          (c) => c.id === body.id
        );

        if (classesToArchiveIndex !== -1) {
          classesData[classesToArchiveIndex].archived = body.archived;

          // Write the updated data back to your JSON file
          fs.writeFileSync(filePath, JSON.stringify(classesData));

          res.status(200).json({
            message: "Class archived status updated successfully",
            classes: classesData[classesToArchiveIndex],
          });
        } else {
          res.status(404).json({ message: "Class not found" });
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
