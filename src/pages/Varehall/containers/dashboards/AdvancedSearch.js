/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, {useState} from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Button,
  Label,
  Input,
  CustomInput
} from "reactstrap";
import Select from "react-select";

// import IntlMessages from "../../helpers/IntlMessages";
import CustomSelectInput from "../../mycomponents/common/CustomSelectInput";

const selectData = [
  {label: "Chocolate", value: "chocolate", key: 0},
  {label: "Vanilla", value: "vanilla", key: 1},
  {label: "Strawberry", value: "strawberry", key: 2},
  {label: "Caramel", value: "caramel", key: 3},
  {label: "Cookies and Cream", value: "cookiescream", key: 4},
  {label: "Peppermint", value: "peppermint", key: 5}
];

const selectDataType = [
  {label: "Cake", value: "cake", key: 0},
  {label: "Cupcake", value: "cupcake", key: 1},
  {label: "Dessert", value: "dessert", key: 2}
];

const AdvancedSearch = ({messages}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsType, setSelectedOptionsType] = useState([]);

  return (
    <Card className="dashboard-search">
      <CardBody>
        <CardTitle className="text-white">
          <div>Title</div>
        </CardTitle>
        <Form className="form-container">
          <FormGroup>
            <label>
              <div>Label</div>
            </label>
            <Select
              components={{Input: CustomSelectInput}}
              className="react-select"
              classNamePrefix="react-select"
              name="form-field-name"
              value={selectedOptions}
              onChange={val => setSelectedOptions(val)}
              options={selectData}
            />
          </FormGroup>
          <FormGroup>
            <label>label</label>
            <Select
              components={{Input: CustomSelectInput}}
              className="react-select"
              classNamePrefix="react-select"
              name="form-field-name"
              value={selectedOptionsType}
              onChange={val => setSelectedOptionsType(val)}
              options={selectDataType}
            />
          </FormGroup>
          <FormGroup>
            <Label>label</Label>
            <Input type="text" placeholder={`messages['dashboards.keyword']`} />
          </FormGroup>
          <FormGroup>
            <CustomInput
              type="checkbox"
              id="exampleCustomCheckbox"
              label="Check this custom checkbox"
            />
          </FormGroup>
          <FormGroup className="text-center">
            <Button color="primary" className="btn-lg mt-3">
              Search
            </Button>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};
export default AdvancedSearch;
