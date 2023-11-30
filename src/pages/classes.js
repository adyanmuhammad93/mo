import Modal from "@mo/components/Modal";
import Table from "@mo/components/Table";
import TextInput from "@mo/components/TextInput";
import TextInputLookUp from "@mo/components/TextInputLookUp";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ClassPage = () => {
  // READ OR GET CLASSES AND FILTER BASED ON ARCHIVED FIELD
  const [data, setData] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  // Event handler for Show Archived Data
  const handleToggle = () => {
    setShowArchive(!showArchive);
  };
  const fetchClasses = () => {
    fetch("api/classes")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setData(data);
      });
  };
  useEffect(() => {
    fetchClasses();
  }, []);
  const filteredData = showArchive
    ? data.filter((row) => row.archived === true)
    : data.filter((row) => row.archived === false);

  //
  const [teacherNames, setTeacherNames] = useState({});
  const [subjectNames, setSubjectNames] = useState({});
  useEffect(() => {
    data.forEach((row) => {
      const teacherId = row.teacherId;
      if (!teacherNames[teacherId]) {
        fetch(`api/teachers?id=${teacherId}`)
          .then((response) => {
            if (!response.ok) {
              setTeacherNames((prev) => ({
                ...prev,
                [teacherId]: "not assigned yet",
              }));
              throw new Error("Teacher not found");
            }
            return response.json();
          })
          .then((data) => {
            // Update the state with the new teacher name
            setTeacherNames((prev) => ({ ...prev, [teacherId]: data.name }));
          })
          .catch((error) => {
            // Log the error and continue with the next row
            console.error(
              `Error fetching teacher with id ${teacherId}: ${error.message}`
            );
          });
      }
    });
  }, [data, teacherNames]);
  useEffect(() => {
    data.forEach((row) => {
      const subjectId = row.subjectId;
      if (!subjectNames[subjectId]) {
        fetch(`api/subjects?id=${subjectId}`)
          .then((response) => {
            if (!response.ok) {
              setSubjectNames((prev) => ({
                ...prev,
                [subjectId]: (
                  <div className="badge badge-warning">not assigned yet</div>
                ),
              }));
              throw new Error("Subject not found");
            }
            return response.json();
          })
          .then((data) => {
            setSubjectNames((prev) => ({ ...prev, [subjectId]: data.name }));
          })
          .catch((error) => {
            // Log the error and continue with the next row
            console.error(
              `Error fetching subject with id ${subjectId}: ${error.message}`
            );
          });
      }
    });
  }, [data, subjectNames]);

  // COLUMNS
  const columns = React.useMemo(
    () => [
      {
        Header: "No",
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Subject",
        accessor: "subjectId",
        Cell: ({ row }) => {
          if (subjectNames[row.original.subjectId] === "not assigned yet") {
            return (
              <span className="badge badge-warning">not assigned yet</span> ||
              "Loading ..."
            );
          }
          return subjectNames[row.original.subjectId] || "Loading";
        },
      },
      {
        Header: "Teacher",
        accessor: "teacherId",
        Cell: ({ row }) => {
          if (teacherNames[row.original.teacherId] === "not assigned yet") {
            return (
              <span className="badge badge-warning">not assigned yet</span> ||
              "Loading ..."
            );
          }
          return teacherNames[row.original.teacherId] || "Loading";
        },
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Time",
        accessor: "time",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button
              className="btn btn-xs"
              onClick={() =>
                handleEdit(
                  row.original,
                  subjectNames[row.original.subjectId],
                  teacherNames[row.original.teacherId]
                )
              }
            >
              Edit
            </button>
            <button
              className="btn btn-xs"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </button>
            <button
              className="btn btn-xs"
              onClick={() => handleArchive(row.original.id)}
            >
              Archive
            </button>
          </div>
        ),
      },
    ],
    [teacherNames, subjectNames]
  );

  // CREATE OR ADD CLASS
  const [newClass, setNewClass] = useState({
    id: uuidv4(),
    archived: false,
    name: "",
  });
  const addClass = async () => {
    try {
      const res = await fetch("api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClass),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setNewClass({
        id: uuidv4(),
        archived: false,
      });
      document.getElementById("addClass").close();
      window.alert("Class created successfully");
      fetchClasses();
    } catch (error) {
      console.log(error);
      document.getElementById("addClass").close();
      window.alert("Failed to create class");
    }
  };
  const handleSubmitAdd = (e) => {
    e.preventDefault();
    // console.log(newClass);
    addClass();
  };
  // Callback function to update teacherId in the state
  const addTeacherId = (selectedItem) => {
    setNewClass({
      ...newClass,
      teacherId: selectedItem.id,
    });
  };
  // Callback function to update subjectId in the state
  const addSubjectId = (selectedItem) => {
    setNewClass({
      ...newClass,
      subjectId: selectedItem.id,
    });
  };

  // UPDATE OR EDIT CLASS
  const [selectedClass, setSelectedClass] = useState();
  const handleEdit = (row, subject, teacher) => {
    setSelectedClass({
      ...row,
      subjectName: subject,
      teacherName: teacher,
    });
    document.getElementById("editClass").showModal();
  };
  // Callback function to update teacherId in the state
  const updateTeacherId = (selectedItem) => {
    setSelectedClass({
      ...selectedClass,
      teacherId: selectedItem.id,
    });
  };
  // Callback function to update subjectId in the state
  const updateSubjectId = (selectedItem) => {
    setSelectedClass({
      ...selectedClass,
      subjectId: selectedItem.id,
    });
  };
  const editClass = async () => {
    try {
      const res = await fetch("api/classes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedClass),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setSelectedClass("");
      document.getElementById("editClass").close();
      window.alert("Class edited successfully");
      fetchClasses();
    } catch (error) {
      console.log(error);
      document.getElementById("editClass").close();
      window.alert("Failed to edit class");
    }
  };
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    editClass();
  };

  // DELETE CLASS
  const deleteClass = async (id) => {
    try {
      const res = await fetch("/api/classes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data.message);

      window.alert("Class deleted successfully");

      fetchClasses();
    } catch (error) {
      console.error(
        `There was a problem with the fetch operation: ${error.message}`
      );
      window.alert("Failed to delete class");
    }
  };
  const handleDelete = (row) => {
    // Display a confirm dialog
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteClass(row);
    }
  };

  // ARCHIVE CLASS
  const archiveClass = async (id) => {
    try {
      const res = await fetch("/api/classes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, archived: true }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data.message);

      window.alert("Class archived successfully");

      fetchClasses();
    } catch (error) {
      console.error(
        `There was a problem with the fetch operation: ${error.message}`
      );

      window.alert("Failed to archive class");
    }
  };
  const handleArchive = (row) => {
    // Display a confirm dialog
    if (window.confirm("Are you sure you want to archive this item?")) {
      archiveClass(row);
    }
  };

  return (
    <>
      <div className="mx-auto py-4 w-[90%] max-w-[1200px]">
        <Table
          columns={columns}
          data={filteredData}
          addLabel="Add Class"
          modalId="addClass"
          showArchive={showArchive}
          handleShowArchive={handleToggle}
        />
        <Modal id="addClass">
          <form className="flex flex-col gap-4" onSubmit={handleSubmitAdd}>
            <div className="font-medium">Create New Class</div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="text"
                name="name"
                value={newClass && newClass.name}
                onChange={(e) => {
                  setNewClass({ ...newClass, name: e.target.value });
                }}
                required={true}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Date</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="date"
                name="date"
                value={newClass && newClass.date}
                onChange={(e) => {
                  setNewClass({ ...newClass, date: e.target.value });
                }}
                required={true}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Time</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="time"
                name="time"
                value={newClass && newClass.time}
                onChange={(e) => {
                  setNewClass({ ...newClass, time: e.target.value });
                }}
                required={true}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Duration</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="number"
                name="duration"
                value={newClass && newClass.duration}
                onChange={(e) => {
                  setNewClass({
                    ...newClass,
                    duration: e.target.value,
                  });
                }}
                required={true}
              />
            </label>
            <TextInputLookUp
              label="Teacher"
              apiURL="api/teachers"
              onSelect={addTeacherId}
              value={newClass && newClass.teacherId}
              placeholder="search here ..."
            />
            <TextInputLookUp
              label="Subject"
              apiURL="api/subjects"
              onSelect={addSubjectId}
              value={newClass && newClass.subjectId}
              placeholder="search here ..."
            />
            <button className="btn" type="submit">
              Create Class
            </button>
          </form>
        </Modal>
        <Modal id="editClass">
          <form className="flex flex-col gap-4" onSubmit={handleSubmitEdit}>
            <div className="font-medium">
              Update {selectedClass && selectedClass.name}
            </div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Date</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="date"
                name="date"
                value={selectedClass && selectedClass.date}
                onChange={(e) => {
                  setSelectedClass({ ...selectedClass, date: e.target.value });
                }}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Time</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="time"
                name="time"
                value={selectedClass && selectedClass.time}
                onChange={(e) => {
                  setSelectedClass({ ...selectedClass, time: e.target.value });
                }}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Duration</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="number"
                name="duration"
                value={selectedClass && selectedClass.duration}
                onChange={(e) => {
                  setSelectedClass({
                    ...selectedClass,
                    duration: e.target.value,
                  });
                }}
              />
            </label>
            {selectedClass &&
            selectedClass.teacherId &&
            selectedClass.teacherId !== "not assigned yet" ? (
              <div className="flex flex-col gap-4">
                {/* <span className="flex flex-col gap-2">
                  <span>
                    This class has a teacher assigned to{" "}
                    <span className="badge badge-info">
                      {selectedClass.teacherName}
                    </span>
                  </span>
                  <span>
                    If you want to change, please search and select a teacher
                    below!
                  </span>
                </span> */}
                <TextInputLookUp
                  label="Teacher"
                  apiURL="api/teachers"
                  onSelect={updateTeacherId}
                  // value={selectedClass && selectedClass.teacherId}
                  placeholder={selectedClass && selectedClass.teacherName}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* <span className="badge badge-warning">
                  Not assigned yet, please search and select a teacher below!
                </span> */}
                <TextInputLookUp
                  label="Teacher"
                  apiURL="api/teachers"
                  onSelect={updateTeacherId}
                  placeholder="search here ..."
                />
              </div>
            )}
            {selectedClass &&
            selectedClass.subjectId &&
            selectedClass.subjectName !== "not assigned yet" ? (
              <div className="flex flex-col gap-4">
                {/* <span className="flex flex-col gap-2">
                  <span>
                    This class has a subject assigned to{" "}
                    <span className="badge badge-info">
                      {selectedClass.subjectName}
                    </span>
                  </span>
                  <span>
                    If you want to change, please search and select a subject
                    below!
                  </span>
                </span> */}
                <TextInputLookUp
                  label="Subject"
                  apiURL="api/subjects"
                  onSelect={updateSubjectId}
                  // value={selectedClass && selectedClass.subjectId}
                  placeholder={selectedClass && selectedClass.subjectName}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* <span className="badge badge-warning">
                  Not assigned yet, please search and select a subject below!
                </span> */}
                <TextInputLookUp
                  label="Subject"
                  apiURL="api/subjects"
                  onSelect={updateSubjectId}
                  placeholder="search here ..."
                />
              </div>
            )}
            <button className="btn" type="submit">
              Update Class
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ClassPage;
