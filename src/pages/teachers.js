import Modal from "@mo/components/Modal";
import Table from "@mo/components/Table";
import TextInput from "@mo/components/TextInput";
import React, { useEffect, useState } from "react";

const TeacherPage = () => {
  // READ OR GET TEACHERS AND FILTER BASED ON ARCHIVED FIELD
  const [data, setData] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  // Event handler for Show Archived Data
  const handleToggle = () => {
    setShowArchive(!showArchive);
  };
  const fetchTeachers = () => {
    fetch("api/teachers")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  };
  useEffect(() => {
    fetchTeachers();
  }, []);
  const filteredData = showArchive
    ? data.filter((row) => row.archived === true)
    : data.filter((row) => row.archived === false);

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
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button
              className="btn btn-xs"
              onClick={() => handleEdit(row.original)}
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
    []
  );

  // CREATE OR ADD TEACHER
  const [newTeacher, setNewTeacher] = useState({
    archived: false,
    name: "",
  });
  const addTeacher = async () => {
    try {
      const res = await fetch("api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeacher),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setNewTeacher({
        archived: false,
        name: "",
      });
      document.getElementById("addTeacher").close();
      window.alert("Teacher created successfully");
      fetchTeachers();
    } catch (error) {
      console.log(error);
      document.getElementById("addTeacher").close();
      window.alert("Failed to create teacher");
    }
  };
  const handleSubmitAdd = (e) => {
    e.preventDefault();
    addTeacher();
  };

  // UPDATE OR EDIT TEACHER
  const [selectedTeacher, setSelectedTeacher] = useState();
  const handleEdit = (row) => {
    setSelectedTeacher(row);
    document.getElementById("editTeacher").showModal();
  };
  const editTeacher = async () => {
    try {
      const res = await fetch("api/teachers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTeacher),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setSelectedTeacher("");
      document.getElementById("editTeacher").close();
      window.alert("Teacher edited successfully");
      fetchTeachers();
    } catch (error) {
      console.log(error);
      document.getElementById("editTeacher").close();
      window.alert("Failed to edit teacher");
    }
  };
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    editTeacher();
  };

  // DELETE TEACHER
  const deleteClass = async (id) => {
    try {
      const res = await fetch("/api/teachers", {
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

      window.alert("Teacher deleted successfully");

      fetchTeachers();
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

  // ARCHIVE TEACHER
  const archiveTeacher = async (id) => {
    try {
      const res = await fetch("/api/teachers", {
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

      window.alert("Teacher archived successfully");

      fetchTeachers();
    } catch (error) {
      console.error(
        `There was a problem with the fetch operation: ${error.message}`
      );

      window.alert("Failed to archive teacher");
    }
  };
  const handleArchive = (row) => {
    // Display a confirm dialog
    if (window.confirm("Are you sure you want to archive this item?")) {
      archiveTeacher(row);
    }
  };

  return (
    <>
      <div className="mx-auto py-4 w-[90%] max-w-[1200px]">
        <Table
          columns={columns}
          data={filteredData}
          addLabel="Add Teacher"
          modalId="addTeacher"
          showArchive={showArchive}
          handleShowArchive={handleToggle}
        />
        <Modal id="addTeacher">
          <form className="flex flex-col gap-4" onSubmit={handleSubmitAdd}>
            <TextInput
              label="Name"
              type="text"
              placeholder="type here ..."
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, name: e.target.value })
              }
              required={true}
              inputClass="input-bordered"
              value={newTeacher.name}
            />
            <button className="btn">Create Teacher</button>
          </form>
        </Modal>
        <Modal id="editTeacher">
          <form className="flex flex-col gap-4" onSubmit={handleSubmitEdit}>
            <TextInput
              label="Name"
              type="text"
              placeholder="type here ..."
              onChange={(e) =>
                setSelectedTeacher({
                  id: selectedTeacher && selectedTeacher.id,
                  name: e.target.value,
                })
              }
              required={true}
              inputClass="input-bordered"
              value={selectedTeacher && selectedTeacher.name}
            />
            <button className="btn">Edit Teacher</button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default TeacherPage;
