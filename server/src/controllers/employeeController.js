
import mongoose from "mongoose";
import Employee from "../models/Employee.js";

const invalidId = (res) =>
  res.status(400).json({
    success: false,
    message: "Invalid employee ID"
  });

const handleWriteError = (res, error, fallbackMessage) => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "An employee with this email already exists"
    });
  }

  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  console.error(fallbackMessage, error.message);

  return res.status(500).json({
    success: false,
    message: fallbackMessage
  });
};

// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error("Get employees error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees"
    });
  }
};

// GET /api/employees/:id
export const getEmployeeById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return invalidId(res);
  }

  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error("Get employee error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee"
    });
  }
};

// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      designation,
      salary
    } = req.body;

    const employee = await Employee.create({
      name,
      email,
      department,
      designation,
      salary,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee
    });
  } catch (error) {
    return handleWriteError(
      res,
      error,
      "Failed to create employee"
    );
  }
};

// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return invalidId(res);
  }

  try {
    const allowedFields = [
      "name",
      "email",
      "department",
      "designation",
      "salary"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] =
          field === "salary"
            ? Number(req.body[field])
            : req.body[field];
      }
    }

    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id
      },
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee
    });
  } catch (error) {
    return handleWriteError(
      res,
      error,
      "Failed to update employee"
    );
  }
};

// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return invalidId(res);
  }

  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    console.error("Delete employee error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete employee"
    });
  }
};
