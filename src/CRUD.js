import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure to import Bootstrap CSS
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { ToastContainer, Toast } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";

const TableComponent = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    clean(); // Reset form when modal closes
  };
  const handleShow = () => setShow(true);
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSalary, setEditSalary] = useState("");

  const getData = () => {
    axios
      .get("http://localhost:5086/api/Employees")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSave = () => {
    const url = "http://localhost:5086/api/Employees";
    const newEmployee = { name, phone, salary };
    axios
      .post(url, newEmployee)
      .then((result) => {
        getData(); // Refresh data after adding new employee
        clean(); // Clear inputs
        alert("Employee has been added");
      })
      .catch((error) => {
        console.error("Error saving employee:", error);
      });
  };

  const clean = () => {
    setName("");
    setPhone("");
    setSalary("");
    setEditId("");
    setEditName("");
    setEditPhone("");
    setEditSalary("");
  };

  const handleEdit = (id) => {
    setEditId(id);
    handleShow();
    axios.get(`http://localhost:5086/api/Employees/${id}`).then((result) => {
      setEditName(result.data.name);
      setEditPhone(result.data.phone);
      setEditSalary(result.data.salary);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this employee") === true) {
      axios
        .delete(`http://localhost:5086/api/Employees/${id}`)
        .then((result) => {
          if (result.status === 200) {
            alert("Employee deleted");
            getData(); // Refresh data after deletion
          }
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
        });
    }
  };

  const handleUpdate = () => {
    const updatedEmployee = {
      name: editName,
      phone: editPhone,
      salary: editSalary,
    };
    axios
      .put(`http://localhost:5086/api/Employees/${editId}`, updatedEmployee)
      .then((result) => {
        alert("Employee details updated");
        getData(); // Refresh data after update
        handleClose(); // Close modal after updating
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
      });
  };

  useEffect(() => {
    getData(); // Fetch data on component mount
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="container mt-4">
      <ToastContainer />
      <Container>
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </Col>
          <Col>
            <Button variant="primary" onClick={handleSave}>
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
      <h2 className="text-center mb-4">Employee Details</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.salary}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(employee.id)}
                >
                  Edit
                </button>
                &nbsp;&nbsp;
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Phone number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Salary"
                value={editSalary}
                onChange={(e) => setEditSalary(e.target.value)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TableComponent;
