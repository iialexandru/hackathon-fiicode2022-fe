import React, { useEffect, useRef, useState } from "react";
import type { FC } from 'react'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'

let autoComplete: any;

interface Props {
    setName: any;
    setFullExactPosition: any;
}

const loadScript = (url: any, callback: any) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if ((script as any).readyState) {
    (script as any).onreadystatechange = function() {
      if ((script as any).readyState === "loaded" || (script as any).readyState === "complete") {
        (script as any).onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateQuery: any, autoCompleteRef: any, setFullExactPosition: any, setName: any) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { componentRestrictions: { country: "ro" } }
  );
  autoComplete.setFields(["address_components", "formatted_address", 'name']);
  autoComplete.addListener("place_changed", () =>
    handlePlaceSelect(updateQuery, setFullExactPosition, setName)
  );
}

async function handlePlaceSelect(updateQuery: any, setFullExactPosition: any, setName: any) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.name;
  setName(addressObject.name)
  setFullExactPosition(addressObject)
  updateQuery(query);
}

const SearchLocationInput: FC<Props> = ({ setName, setFullExactPosition }) => {
  const autoCompleteRef = useRef(null);

  const [ query, setQuery ] = useState(null)

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyC8OO5kEbqdGpEb_61WlsCnRUS_NHX94CE&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef, setFullExactPosition, setName)
    );
  }, []);

  return (
      <FormControl variant='standard' >
        <InputLabel htmlFor='location'>Location</InputLabel>
        <Input id='location' type='text' name='location' value='' inputProps={{ ref: autoCompleteRef, value: query, onChange: (e: any) => { setQuery(e.target.value) }, placeholder: '' }} />
      </FormControl>
  );
}

export default SearchLocationInput;