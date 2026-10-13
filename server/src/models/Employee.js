import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"]
        },
    
    createdBy: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true,
       index: true
},
  },
  {
    timestamps: true
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;