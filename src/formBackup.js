import React, { Component } from "react";

class FormValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      errors: {}
    };
  }

  validationRules = [
    {
      size: {
        min: 5,
        max: 10
      },
      message: "Character should be 5 to 10"
    },
    {
      in: ["Sumanta", "turtlemint"],
      message: "Value must be 'Sumanta' or 'turtlemint'"
    }
  ];

  customTextValidation = (value) => {
    const errors = [];

    if (!value) {
      errors.push("Field is required");
    } else {
      for (const rule of this.validationRules) {
        if (rule.size) {
          const { min, max } = rule.size;
          if (value.length < min || value.length > max) {
            errors.push(rule.message);
          }
        }

        if (rule.in) {
          if (!rule.in.includes(value)) {
            errors.push(rule.message);
          }
        }
      }
    }

    return errors;
  };

  componentDidMount() {
    // Perform initial validation when the component is mounted

    const { fields } = this.props;
    const initialErrors = {};

    fields
      .filter((field) => field.type === "text")
      .forEach((field) => {
        const value = this.state.formData[field.id] || "";
        const validationErrors = this.customTextValidation(value);
        if (validationErrors.length > 0) {
          initialErrors[field.id] = validationErrors;
        }
      });

    this.setState({ errors: initialErrors });
  }

  handleChange = (event, field) => {
    const { formData, errors } = this.state;
    const { name, value } = event.target;

    formData[name] = value;

    if (field.type === "text") {
      const validationErrors = this.customTextValidation(value);
      errors[name] = validationErrors;
    }

    this.setState({ formData, errors });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // Validation before submission
    const { formData } = this.state;
    const submissionErrors = {};

    const { fields } = this.props;

    fields
      .filter((field) => field.type === "text")
      .forEach((field) => {
        const value = formData[field.id];
        const validationErrors = this.customTextValidation(value);
        if (validationErrors.length > 0) {
          submissionErrors[field.id] = validationErrors;
        }
      });

    if (Object.keys(submissionErrors).length > 0) {
      // Validation errors found, don't submit
      this.setState({ errors: submissionErrors });
      return;
    }

    // Handle form submission here if there are no validation errors
    console.log("Form submitted with data:", formData);
  };

  render() {
    const { formData, errors } = this.state;
    const { fields } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        {fields?.map((field) => (
          <div key={field.id}>
            {field.type === "text" ? (
              <div>
                <label htmlFor={field.id}>{field.name}:</label>
                <input
                  type="text"
                  id={field.id}
                  name={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) => this.handleChange(e, field)}
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
                      onChange={(e) => this.handleChange(e, field)}
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
                  onChange={(e) => this.handleChange(e, field)}
                />
              </div>
            ) : null}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default FormValidation;
