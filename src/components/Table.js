import React, { useState } from "react";
import { useTable, useGlobalFilter } from "react-table";
import TextInput from "./TextInput";

const Table = ({
  columns,
  data,
  addLabel,
  modalId,
  showArchive,
  handleShowArchive,
}) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter
  );

  const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    const [value, setValue] = useState(globalFilter);

    const handleGlobalFilterChange = () => {
      setGlobalFilter(value || undefined);
    };

    return (
      <div className="flex items-center justify-center gap-4">
        <TextInput
          type="search"
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          inputClass="input-sm input-bordered"
        />
        <button
          className="btn btn-sm btn-primary"
          onClick={handleGlobalFilterChange}
        >
          Search
        </button>
      </div>
    );
  };
  return (
    <>
      <div className="flex flex-col gap-4 min-h-[85vh]">
        <div className="flex items-center justify-between">
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <div className="flex items-center gap-4">
            <div className="form-control">
              <label className="cursor-pointer label flex gap-4">
                <span className="label-text">Show Archived Data</span>
                {/* Use the state variable and event handler */}
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={showArchive}
                  onChange={handleShowArchive}
                />
              </label>
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => document.getElementById(modalId).showModal()}
            >
              {addLabel}
            </button>
          </div>
        </div>
        <div className="grow">
          <table {...getTableProps()} className="table drop-shadow bg-white">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Table;
