import "./styles.css";
import FormValidation from "./formFunctionalComponent";

export default function App() {
  const fields = [
    {
      id: "name",
      name: "Name",
      type: "text",
      required: true,
      validations: [
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
      ],
      disabled: false
    },
    {
      id: "title",
      name: "Title",
      type: "text",
      required: true,
      validations: [],
      disabled: false
    }
  ];

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <FormValidation fields={fields} />
    </div>
  );
}
