import Modal from "@mo/components/Modal";
import Table from "@mo/components/Table";
import TextInput from "@mo/components/TextInput";
import React, { useEffect, useState } from "react";

const SubjectPage = () => {
  // READ OR GET SUBJECTS AND FILTER BASED ON ARCHIVED FIELD
  const [data, setData] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  // Event handler for Show Archived Data
  const handleToggle = () => {
    setShowArchive(!showArchive);
  };
  const fetchSubjects = () => {
    fetch("api/subjects")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };
  useEffect(() => {
    fetchSubjects();
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

  // CREATE OR ADD SUBJECT
  const [newSubject, setNewSubject] = useState({
    archived: false,
    name: "",
  });
  const addSubject = async () => {
    try {
      const res = await fetch("api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubject),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setNewSubject({
        archived: false,
        name: "",
      });
      document.getElementById("addSubject").close();
      window.alert("Subject created successfully");
      fetchSubjects();
    } catch (error) {
      console.log(error);
      document.getElementById("addSubject").close();
      window.alert("Failed to create subject");
    }
  };
  const handleSubmitAdd = (e) => {
    e.preventDefault();
    addSubject();
  };

  // UPDATE OR EDIT SUBJECT
  const [selectedSubject, setSelectedSubject] = useState();
  const handleEdit = (row) => {
    setSelectedSubject(row);
    document.getElementById("editSubject").showModal();
  };
  const editSubject = async () => {
    try {
      const res = await fetch("api/subjects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedSubject),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setSelectedSubject("");
      document.getElementById("editSubject").close();
      window.alert("Subject edited successfully");
      fetchSubjects();
    } catch (error) {
      console.log(error);
      document.getElementById("editSubject").close();
      window.alert("Failed to edit subject");
    }
  };
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    editSubject();
  };

  // DELETE SUBJECT
  const deleteClass = async (id) => {
    try {
      const res = await fetch("/api/subjects", {
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

      window.alert("Subject deleted successfully");

      fetchSubjects();
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

  // ARCHIVE SUBJECT
  const archiveSubject = async (id) => {
    try {
      const res = await fetch("/api/subjects", {
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

      window.alert("Subject archived successfully");

      fetchSubjects();
    } catch (error) {
      console.error(
        `There was a problem with the fetch operation: ${error.message}`
      );

      window.alert("Failed to archive subject");
    }
  };
  const handleArchive = (row) => {
    // Display a confirm dialog
    if (window.confirm("Are you sure you want to archive this item?")) {
      archiveSubject(row);
    }
  };

  return (
    <>
      <div className="mx-auto py-4 w-[90%] max-w-[1200px]">
        <Table
          columns={columns}
          data={filteredData}
          addLabel="Add Subject"
          modalId="addSubject"
          showArchive={showArchive}
          handleShowArchive={handleToggle}
        />
        <Modal id="addSubject">
          <form className="flex flex-col gap-4" onSubmit={handleSubmitAdd}>
            <TextInput
              label="Name"
              type="text"
              placeholder="type here ..."
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
              required={true}
              inputClass="input-bordered"
              value={newSubject.name}
            />
            <button className="btn">Create Subject</button>
          </form>
        </Modal>
        <Modal id="editSubject">
          <form className="flex flex-col gap-4" onSubmit={handleSubmitEdit}>
            <TextInput
              label="Name"
              type="text"
              placeholder="type here ..."
              onChange={(e) =>
                setSelectedSubject({
                  id: selectedSubject && selectedSubject.id,
                  name: e.target.value,
                })
              }
              required={true}
              inputClass="input-bordered"
              value={selectedSubject && selectedSubject.name}
            />
            <button className="btn">Edit Subject</button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default SubjectPage;
