// Dependencies
import React, { useState } from "react";
import { Picklist, Option } from "react-rainbow-components";

// Styles
import "./tailwind.output.css";

import mockData from "./mockData.json";

const App = () => {
  const [currentField, setCurrentField] = useState("");
  const [isActiveAdd, setIsActiveAdd] = useState(false);
  const [fields, setFields] = useState({});
  const [customPropertier, setCustomPropertier] = useState({});

  const handleSave = () => {
    if (currentField === "properties") {
      const newProperties = fields?.properties || [];

      setFields((prevState) => ({
        ...prevState,
        properties: [...newProperties, customPropertier]
      }));

      setCustomPropertier({});
    }
    setIsActiveAdd(false);
    setCurrentField("");
  };

  const handleTypeField = (event) => {
    const { value, label } = event.currentTarget;

    setCurrentField(value);

    setFields((prevState) => ({
      ...prevState,
      [value]: {
        value: prevState[value],
        label
      }
    }));
  };

  const handleAddNameField = (event) => {
    const { value } = event.currentTarget;

    setFields((prevState) => ({
      ...prevState,
      [currentField]: value
    }));
  };

  /*const handleAddPropertier = (event) => {
    const { name: typeName, value } = event.currentTarget;

    let currentValue = value;

    if (typeName === "name") {
      currentValue = String(currentValue.replace(" ", "_").toLowerCase());
    }

    setCustomPropertier((prevState) => ({
      ...prevState,
      [typeName]: currentValue
    }));
  };*/

  const handleSelect = (event) => {
    const { value, label } = event;

    setFields((prevState) => ({
      ...prevState,
      [currentField]: {
        value,
        label
      }
    }));
  };

  const handleDelete = (key, itemName) => {
    let filterFields = { ...fields };

    if (key === "properties") {
      const filteredProperties = filterFields?.properties?.filter(
        (item) => item.name !== itemName
      );

      filterFields.properties = filteredProperties;

      setFields(filterFields);

      return;
    }

    delete filterFields[key];

    setFields(filterFields);
  };

  const handleRemoveInput = (id) => {
    const customField = { ...fields };

    delete customField[id];

    setFields(customField);

    setCurrentField(false);
  };

  return (
    <div className="min-h-screen bg-gray-500 flex flex-col space-y-2 p-5">
      {JSON.stringify(fields)}
      <ul>
        {Object.keys(fields).map((key) => {
          if (!fields[key].value) return null;

          /*if (key === "properties") {
            return fields["properties"]?.map((el, i) => (
              <li key={el.name} className="mb-2">
                {`${el.name} => ${el.value}`}
                <button
                  onClick={() => handleDelete(key, el.name)}
                  className="bg-gray-600 px-1 mx-2 text-white"
                >
                  Deletar
                </button>
              </li>
            ));
          }*/

          return (
            <li key={key} className="mb-2">
              {`${key} => ${fields[key].value} - Label: ${fields[key].label}`}
              <button
                onClick={() => handleDelete(key)}
                className="bg-gray-600 px-1 mx-2 text-white"
              >
                Deletar
              </button>
            </li>
          );
        })}
      </ul>

      <div>
        {isActiveAdd && (
          <select
            defaultValue=""
            className="text-gray-800 h-6"
            onChange={handleTypeField}
          >
            <option value="" disabled>
              Tipo do campo
            </option>
            <option
              value="unit_id"
              label="Unidade de medida"
              disabled={!!Object.keys(fields).find((key) => key === "unit_id")}
            >
              Unidade de medida
            </option>
            <option
              value="category_id"
              disabled={
                !!Object.keys(fields).find((key) => key === "category_id")
              }
            >
              Categoria
            </option>
            <option
              value="warehouses"
              disabled={
                !!Object.keys(fields).find((key) => key === "warehouses")
              }
            >
              Armazem
            </option>
            <option
              value="supplier_id"
              disabled={
                !!Object.keys(fields).find((key) => key === "supplier_id")
              }
            >
              Fornecedor
            </option>
            <option
              value="brand_id"
              disabled={!!Object.keys(fields).find((key) => key === "brand_id")}
            >
              Marca
            </option>
            {/*<option value="properties">Propriedades cuspomizadas</option>*/}
          </select>
        )}

        {isActiveAdd && !!["warehouses"].includes(currentField) && (
          <input
            type="text"
            placeholder="nome do campo"
            className="h-6"
            onChange={handleAddNameField}
          />
        )}

        {isActiveAdd &&
          !!currentField.length &&
          !!["unit_id", "category_id", "brand_id", "supplier_id"].includes(
            currentField
          ) && (
            <Picklist
              className="rounded-none"
              onChange={(value) => handleSelect(value)}
              value={{
                value: fields[currentField] || "",
                label:
                  mockData[currentField]?.find(
                    (e) => e.id === fields[currentField]
                  )?.name || "Selecione"
              }}
              label="Select Building"
              hideLabel
            >
              <Option name="header" label="Your Buildings" variant="header" />
              {mockData[currentField]?.map((option) => (
                <Option key={option.id} value={option.id} label={option.name} />
              ))}
            </Picklist>
          )}

        {/*isActiveAdd && currentField === "properties" && (
          <div>
            <input
              placeholder="nome do campo"
              name="name"
              onChange={(event) => handleAddPropertier(event)}
            />
            <input
              placeholder="valor do campo"
              name="value"
              onChange={(event) => handleAddPropertier(event)}
            />
          </div>
        )*/}

        {isActiveAdd && (
          <button
            onClick={() => handleRemoveInput(currentField)}
            className="bg-indigo-500 w-6 h-6 text-white mx-1"
          >
            -
          </button>
        )}
      </div>

      <button
        onClick={() =>
          !isActiveAdd ? setIsActiveAdd(!isActiveAdd) : handleSave()
        }
        className="w-full py-1 text-blue-600 border border-blue-600 border-dashed focus:outline-none hover:text-blue-700 hover:border-blue-700"
      >
        {!!currentField ? "Save field" : "+ Add new field"}
      </button>
    </div>
  );
};

export default App;
