import React, { useState, useEffect } from "react";

const FormValidation = ({ fields }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const customTextValidation = (value, field) => {
    const validationErrors = [];

    if (field.required && !value) {
      validationErrors.push("Field is required");
    } else {
      for (const validation of field.validations) {
        if (validation.size) {
          const { min, max } = validation.size;
          if (value.length < min || value.length > max) {
            validationErrors.push(validation.message);
          }
        }

        if (validation.in) {
          if (!validation.in.includes(value)) {
            validationErrors.push(validation.message);
          }
        }
      }
    }

    return validationErrors;
  };

  useEffect(() => {
    // Perform initial validation when the component is mounted
    const initialErrors = {};

    fields
      .filter((field) => field.type === "text")
      .forEach((field) => {
        const value = formData[field.id] || "";
        const validationErrors = customTextValidation(value, field);
        if (validationErrors.length > 0) {
          initialErrors[field.id] = validationErrors;
        }
      });

    setErrors(initialErrors);
  }, [fields, formData]);

  const handleChange = (event, field) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };

    if (field.type === "text") {
      const validationErrors = customTextValidation(value, field);
      setErrors({ ...errors, [name]: validationErrors });
    }

    setFormData(newFormData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation before submission
    const submissionErrors = {};

    fields
      .filter((field) => field.type === "text")
      .forEach((field) => {
        const value = formData[field.id];
        const validationErrors = customTextValidation(value, field);
        if (validationErrors.length > 0) {
          submissionErrors[field.id] = validationErrors;
        }
      });

    if (Object.keys(submissionErrors).length > 0) {
      // Validation errors found, don't submit
      setErrors(submissionErrors);
      return;
    }

    // Handle form submission here if there are no validation errors
    console.log("Form submitted with data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields?.map((field) => (
        <div key={field.id}>
          {field.type === "text" ? (
            <div className={errors[field.id] ? "Error" : "none"}>
              <label htmlFor={field.id}>{field.name}:</label>
              <input
                type="text"
                id={field.id}
                name={field.id}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(e, field)}
                required={field.required}
              />
              <ul style={{ color: "red" }}>
                {errors[field.id] &&
                  errors[field.id].map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
              </ul>
            </div>
          ) : field.type === "radio" ? (
            <div>
              <label>{field.name}:</label>
              {field.options.map((option) => (
                <div key={option.value}>
                  <input
                    type="radio"
                    id={option.value}
                    name={field.id}
                    value={option.value}
                    checked={formData[field.id] === option.value}
                    onChange={(e) => handleChange(e, field)}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          ) : field.type === "file" ? (
            <div>
              <label htmlFor={field.id}>{field.name}:</label>
              <input
                type="file"
                id={field.id}
                name={field.id}
                onChange={(e) => handleChange(e, field)}
              />
            </div>
          ) : null}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormValidation;
